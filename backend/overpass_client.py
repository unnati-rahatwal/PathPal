"""
overpass_client.py
------------------
Fetches live Point-of-Interest data from the OpenStreetMap Overpass API.

Queries:
  - Police stations / chowkis / pink booths
  - 24/7 pharmacies
  - Fuel stations (petrol pumps)
  - CCTV surveillance nodes
  - Dark zones: ways tagged lit=no on walkable roads
"""

from __future__ import annotations

import os
import logging
import requests
from typing import Any

logger = logging.getLogger(__name__)

OVERPASS_URL = os.getenv("OVERPASS_API_URL", "https://overpass-api.de/api/interpreter")
TIMEOUT = 20  # seconds


def _run_query(query: str) -> list[dict]:
    """Execute an Overpass QL query and return elements."""
    try:
        resp = requests.post(
            OVERPASS_URL,
            data={"data": query},
            timeout=TIMEOUT,
            headers={"Accept": "application/json"},
        )
        resp.raise_for_status()
        data = resp.json()
        return data.get("elements", [])
    except requests.RequestException as e:
        logger.warning(f"Overpass query failed: {e}")
        return []


# ────────────────────────────────────────────────────────────────────────────
# SAFE HAVENS: Police, Pharmacy, Petrol Pump
# ────────────────────────────────────────────────────────────────────────────

SAFE_HAVEN_QUERY = """
[out:json][timeout:20];
(
  node["amenity"="police"]({bbox});
  node["amenity"="pharmacy"]({bbox});
  node["amenity"="fuel"]({bbox});
  node["man_made"="surveillance"]({bbox});
  node["amenity"="hospital"]({bbox});
);
out body 80;
"""

AMENITY_TYPE_MAP = {
    "police":      "Police Station",
    "pharmacy":    "Pharmacy",
    "fuel":        "Petrol Pump",
    "hospital":    "Hospital",
    "surveillance": "CCTV / Surveillance",
}

AMENITY_COLOR_MAP = {
    "police":      "#3B82F6",   # blue
    "pharmacy":    "#10B981",   # green
    "fuel":        "#F59E0B",   # amber
    "hospital":    "#EF4444",   # red
    "surveillance": "#8B5CF6",  # purple
}


def fetch_safe_havens(bbox: str = "18.89,72.77,19.27,73.00") -> list[dict]:
    """
    Return list of safe haven POIs from OSM for the given bounding box.
    bbox format: "south,west,north,east"
    """
    query = SAFE_HAVEN_QUERY.format(bbox=bbox)
    elements = _run_query(query)

    havens = []
    for el in elements:
        if el.get("type") != "node":
            continue
        tags = el.get("tags", {})
        amenity_key = tags.get("amenity") or tags.get("man_made", "")
        haven_type = AMENITY_TYPE_MAP.get(amenity_key, amenity_key.title())
        color = AMENITY_COLOR_MAP.get(amenity_key, "#6B7280")

        havens.append({
            "id": f"osm_{el['id']}",
            "name": tags.get("name") or f"{haven_type} (OSM)",
            "type": haven_type,
            "lat": el["lat"],
            "lng": el["lon"],
            "open_hours": tags.get("opening_hours", "24/7"),
            "contact": tags.get("phone") or tags.get("contact:phone") or "112",
            "color": color,
            "source": "openstreetmap",
        })

    logger.info(f"Fetched {len(havens)} safe haven POIs from Overpass")
    return havens


# ────────────────────────────────────────────────────────────────────────────
# DARK ZONES: OSM ways with lit=no on walkable streets
# ────────────────────────────────────────────────────────────────────────────

DARK_ZONE_QUERY = """
[out:json][timeout:20];
(
  way["lit"="no"]["highway"~"^(primary|secondary|tertiary|residential|unclassified|service|footway|path)$"]({bbox});
  way["lit"="no"]["highway"~"^(primary|secondary|tertiary|residential)$"]({bbox});
);
out body 40;
>;
out skel qt;
"""


def fetch_dark_zones(bbox: str = "18.89,72.77,19.27,73.00") -> list[dict]:
    """
    Return list of dark/hazardous way segments (lit=no) from OSM.
    """
    query = DARK_ZONE_QUERY.format(bbox=bbox)
    elements = _run_query(query)

    nodes_by_id: dict[int, dict] = {}
    ways = []

    for el in elements:
        if el["type"] == "node":
            nodes_by_id[el["id"]] = {"lat": el["lat"], "lng": el["lon"]}
        elif el["type"] == "way":
            ways.append(el)

    dark_zones = []
    for way in ways:
        tags = way.get("tags", {})
        node_refs = way.get("nodes", [])

        # Centroid of way
        coords = [nodes_by_id[n] for n in node_refs if n in nodes_by_id]
        if not coords:
            continue

        lat = sum(c["lat"] for c in coords) / len(coords)
        lng = sum(c["lng"] for c in coords) / len(coords)

        highway = tags.get("highway", "road")
        severity = "High" if highway in ("primary", "secondary") else "Medium"

        dark_zones.append({
            "id": f"hz_osm_{way['id']}",
            "title": f"Unlit {highway.replace('_', ' ').title()}",
            "location_name": tags.get("name", f"OSM Way #{way['id']}"),
            "lat": lat,
            "lng": lng,
            "severity": severity,
            "type": "Streetlight Deficit",
            "advice": "Use well-lit alternative road. Exercise extra caution at night.",
            "highway": highway,
            "source": "openstreetmap",
        })

    logger.info(f"Fetched {len(dark_zones)} dark zone segments from Overpass")
    return dark_zones
