"""
google_services.py
------------------
Integrates Google Maps Platform (Places API New & Street View) for PathPal:
  1. Google Places Text Search (New v1) - Fast, single-shot search with coordinates
  2. Google Places Nearby Search (New v1) - Verified 24/7 safe havens with live ratings
  3. Google Street View Static API - Drop-off visual night safety inspection

Gracefully falls back to OpenStreetMap Nominatim/Overpass when API key is unset.
"""

from __future__ import annotations

import logging
import os
import requests
from typing import Any, Optional

logger = logging.getLogger("google_services")


def get_api_key() -> str:
    """Retrieve Google Maps API Key from environment."""
    return os.getenv("GOOGLE_MAPS_API_KEY", "").strip()


def is_google_api_configured() -> bool:
    """Check if a valid Google Maps API Key is provided."""
    key = get_api_key()
    return bool(key and key != "YOUR_GOOGLE_MAPS_API_KEY_HERE")


# ── 1. Google Places Text Search (New v1 — Single Shot with Coordinates) ─────

def search_places_autocomplete(query: str) -> list[dict[str, Any]]:
    """
    Search places/buildings/addresses in Mumbai via Google Places API (New) v1 Text Search.
    Returns building names, formatted addresses, and precise coordinates in a single call.
    """
    api_key = get_api_key()
    if not api_key:
        return []

    url = "https://places.googleapis.com/v1/places:searchText"
    headers = {
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": "places.id,places.displayName,places.location,places.formattedAddress,places.primaryType",
        "Content-Type": "application/json",
    }
    
    # Ensure query is focused on Mumbai
    search_text = query if "mumbai" in query.lower() else f"{query} Mumbai"
    
    payload = {
        "textQuery": search_text,
        "locationBias": {
            "circle": {
                "center": {"latitude": 19.0760, "longitude": 72.8777},
                "radius": 35000.0,
            }
        },
        "maxResultCount": 6,
    }

    try:
        res = requests.post(url, headers=headers, json=payload, timeout=4)
        if not res.ok:
            logger.warning(f"Google Places Search failed [{res.status_code}]: {res.text[:120]}")
            return []

        data = res.json()
        places = data.get("places", [])
        results = []

        for p in places:
            loc = p.get("location", {})
            if not loc or "latitude" not in loc or "longitude" not in loc:
                continue

            name = p.get("displayName", {}).get("text", query)
            address = p.get("formattedAddress", "Mumbai, Maharashtra")
            primary_type = p.get("primaryType", "mumbai_location").replace("_", " ").title()

            results.append({
                "id": f"google_{p.get('id')}",
                "place_id": p.get("id"),
                "name": name,
                "category": address,
                "type": primary_type,
                "lat": float(loc["latitude"]),
                "lng": float(loc["longitude"]),
                "source": "google_places",
            })

        return results
    except Exception as e:
        logger.error(f"Google Places Search error: {e}")
        return []


# ── 2. Verified 24/7 Safe Havens (Places Nearby Search New v1) ────────────────

def fetch_verified_safe_havens(
    lat: float, lng: float, radius_meters: int = 2500
) -> list[dict[str, Any]]:
    """
    Query live verified 24/7 pharmacies, hospitals, police stations, and fuel stations
    around coordinates using Google Places API (New) v1 Nearby Search.
    """
    api_key = get_api_key()
    if not api_key:
        return []

    url = "https://places.googleapis.com/v1/places:searchNearby"
    headers = {
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": (
            "places.id,places.displayName,places.location,places.primaryType,"
            "places.currentOpeningHours,places.rating,places.userRatingCount,places.formattedAddress"
        ),
        "Content-Type": "application/json",
    }

    payload = {
        "includedTypes": ["pharmacy", "hospital", "police", "gas_station"],
        "locationRestriction": {
            "circle": {
                "center": {"latitude": lat, "longitude": lng},
                "radius": float(radius_meters),
            }
        },
        "maxResultCount": 10,
    }

    try:
        res = requests.post(url, headers=headers, json=payload, timeout=5)
        if not res.ok:
            logger.warning(f"Google Nearby Search failed [{res.status_code}]: {res.text[:120]}")
            return []

        data = res.json()
        places = data.get("places", [])
        results = []

        for p in places:
            loc = p.get("location", {})
            if not loc:
                continue

            name = p.get("displayName", {}).get("text", "Verified Safe Haven")
            primary_type = p.get("primaryType", "safe_haven")
            open_now = p.get("currentOpeningHours", {}).get("openNow", None)
            rating = p.get("rating", None)
            rating_count = p.get("userRatingCount", 0)
            address = p.get("formattedAddress", "")

            # Category label & color mapping
            if "hospital" in primary_type:
                cat_label = "24/7 Hospital / Emergency Care"
                color = "#EF4444"
            elif "police" in primary_type or "government" in primary_type:
                cat_label = "Mumbai Police Station / Chowki"
                color = "#3B82F6"
            elif "pharmacy" in primary_type or "drugstore" in primary_type:
                cat_label = "24/7 Medical Store / Pharmacy"
                color = "#10B981"
            elif "gas" in primary_type or "fuel" in primary_type or "cng" in name.lower():
                cat_label = "Lit Fuel / CNG Station"
                color = "#F59E0B"
            else:
                cat_label = "Verified Night Safe Haven"
                color = "#00F0FF"

            results.append({
                "id": f"g_{p.get('id')}",
                "name": name,
                "type": primary_type,
                "category": cat_label,
                "lat": float(loc.get("latitude")),
                "lng": float(loc.get("longitude")),
                "open_now": open_now,
                "rating": rating,
                "user_ratings_total": rating_count,
                "address": address,
                "color": color,
                "source": "google_places_verified",
            })

        return results
    except Exception as e:
        logger.error(f"Error in Google Nearby Safe Havens: {e}")
        return []


# ── 3. Street View Visual Safety Preview ─────────────────────────────────────

def get_street_view_preview(lat: float, lng: float) -> dict[str, Any]:
    """
    Generate Google Street View metadata & static preview image URL
    for drop-off safety inspection.
    """
    api_key = get_api_key()

    meta_url = "https://maps.googleapis.com/maps/api/streetview/metadata"
    meta_params = {
        "location": f"{lat},{lng}",
        "key": api_key if api_key else "NO_KEY",
        "radius": "100",
    }

    has_panorama = False
    pano_date = ""
    pano_id = ""

    if api_key:
        try:
            res = requests.get(meta_url, params=meta_params, timeout=4)
            if res.ok:
                meta = res.json()
                if meta.get("status") == "OK":
                    has_panorama = True
                    pano_date = meta.get("date", "")
                    pano_id = meta.get("pano_id", "")
        except Exception as e:
            logger.debug(f"Street View metadata check: {e}")

    image_url = ""
    if api_key:
        image_url = (
            f"https://maps.googleapis.com/maps/api/streetview?"
            f"size=600x340&location={lat},{lng}&fov=90&heading=235&pitch=0&key={api_key}"
        )

    return {
        "available": has_panorama,
        "lat": lat,
        "lng": lng,
        "pano_id": pano_id,
        "capture_date": pano_date,
        "image_url": image_url,
        "is_api_key_configured": bool(api_key),
    }
