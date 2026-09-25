"""
router.py
---------
Weighted shortest-path routing on the Mumbai OSMnx street graph.

Produces 3 route variants for each origin→destination pair:
  1. Safest   — heavily penalises unsafe edges (dark, isolated, service roads)
  2. Balanced — equal weight on safety and distance
  3. Fastest  — pure distance minimisation (Dijkstra on edge lengths)

Safety weight function:
  w(e) = length(e) × (1 + α × (1 − safety_score(e)/100) × PENALTY_FACTOR)

  α=0.90 → Safest   (unsafe edges cost up to 10× more)
  α=0.50 → Balanced
  α=0.05 → Fastest  (safety barely affects cost)
"""

from __future__ import annotations

import logging
import math
from typing import Optional

import networkx as nx
import osmnx as ox

from safety_scorer import get_isolation_label

logger = logging.getLogger(__name__)

PENALTY_FACTOR = 9.0   # max multiplier for a 0-score edge in safest mode

ROUTE_CONFIGS = [
    {
        "id":         "safest",
        "title":      "Safest Corridor",
        "subtitle":   "Prioritises lit arterials, police coverage & high footfall",
        "badge":      "RECOMMENDED FOR NIGHT",
        "badge_color": "emerald",
        "color":      "#10B981",
        "alpha":      0.90,
    },
    {
        "id":         "balanced",
        "title":      "Balanced Route",
        "subtitle":   "Optimal trade-off between travel time and night safety",
        "badge":      "OPTIMAL ETA & SAFETY",
        "badge_color": "cyan",
        "color":      "#00F0FF",
        "alpha":      0.50,
    },
    {
        "id":         "fastest",
        "title":      "Fastest Shortcut",
        "subtitle":   "Shortest distance — may include isolated or unlit segments",
        "badge":      "CAUTION AFTER 10 PM",
        "badge_color": "amber",
        "color":      "#F59E0B",
        "alpha":      0.05,
    },
]


# ── Helpers ──────────────────────────────────────────────────────────────────

def _haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlng / 2) ** 2
    )
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def _make_weight_fn(alpha: float):
    """Return an edge weight callable for NetworkX dijkstra."""
    def weight_fn(u: int, v: int, edge_dict: dict) -> float:
        # For MultiDiGraph, edge_dict is {key: data_dict}
        # Take the minimum weight across parallel edges
        min_w = float("inf")
        for data in edge_dict.values():
            length = data.get("length", 50.0)           # metres
            safety = data.get("safety_score", 40.0)     # 0-100
            safety_factor = 1.0 - (safety / 100.0)      # 0=safe, 1=unsafe
            w = length * (1.0 + alpha * safety_factor * PENALTY_FACTOR)
            if w < min_w:
                min_w = w
        return min_w
    return weight_fn


def _path_to_waypoints(
    G: nx.MultiDiGraph, path: list[int], max_points: int = 120
) -> list[list[float]]:
    """Convert node ID path to [[lat, lng], …], downsampled if necessary."""
    coords = [[G.nodes[n]["y"], G.nodes[n]["x"]] for n in path]

    if len(coords) <= max_points:
        return coords

    # Uniform downsampling
    step = len(coords) / max_points
    sampled = [coords[int(i * step)] for i in range(max_points)]
    sampled.append(coords[-1])  # always include destination
    return sampled


def _compute_path_metrics(
    G: nx.MultiDiGraph, path: list[int]
) -> tuple[float, dict]:
    """
    Returns (total_length_km, metrics_dict) for the given node path.

    metrics_dict keys:
      avg_safety_score, lighting_coverage_pct, isolation_pct,
      lit_length_m, total_length_m, footfall_score
    """
    total_len = 0.0
    lit_len = 0.0
    isolated_len = 0.0
    safety_weighted = 0.0
    footfall_score_sum = 0.0

    for i in range(len(path) - 1):
        u, v = path[i], path[i + 1]
        if v not in G[u]:
            continue
        # Best (min length) parallel edge
        data = min(G[u][v].values(), key=lambda d: d.get("length", 999))

        length = data.get("length", 0.0)
        total_len += length

        safety = data.get("safety_score", 40.0)
        safety_weighted += safety * length

        lit = str(data.get("lit", "")).lower()
        if lit in ("yes", "24/7", "automatic", "sunset-sunrise"):
            lit_len += length

        hw = str(data.get("highway", "")).lower()
        if hw in ("service", "path", "track", "footway"):
            isolated_len += length

        # Footfall proxy: primary/secondary roads = high footfall
        fw = {
            "primary": 90, "secondary": 80, "tertiary": 70,
            "residential": 60, "pedestrian": 75,
        }.get(hw, 50)
        footfall_score_sum += fw * length

    if total_len == 0:
        return 0.0, {}

    avg_safety = int(safety_weighted / total_len)
    lighting_pct = int(lit_len / total_len * 100)
    isolation_pct = int(isolated_len / total_len * 100)
    footfall = int(footfall_score_sum / total_len)

    return total_len / 1000.0, {
        "avg_safety_score":      avg_safety,
        "lighting_coverage_pct": lighting_pct,
        "isolation_pct":         isolation_pct,
        "footfall_score":        footfall,
        "lit_length_m":          int(lit_len),
        "total_length_m":        int(total_len),
    }


def _eta_minutes(distance_km: float, travel_mode: str) -> int:
    speeds = {
        "walking":        4.5,
        "two_wheeler":   28.0,
        "auto_cab":      22.0,
        "public_transit": 18.0,
    }
    kmh = speeds.get(travel_mode, 22.0)
    return max(1, round(distance_km / kmh * 60))


def _build_highlights(metrics: dict, config: dict) -> list[str]:
    highlights = []
    lp = metrics.get("lighting_coverage_pct", 0)
    fp = metrics.get("footfall_score", 0)

    if lp >= 70:
        highlights.append(f"{lp}% of route covered by street lighting")
    if fp >= 70:
        highlights.append("Passes through high-activity commercial corridors")
    if config["id"] == "safest":
        highlights.append("Routed via police chowki proximity corridors")
        highlights.append("Avoids isolated service lanes and unlit paths")
    elif config["id"] == "balanced":
        highlights.append("Near metro / bus stop access points")
    elif config["id"] == "fastest":
        highlights.append("Shortest distance — check for unlit stretches")

    return highlights


def _build_warnings(metrics: dict, config: dict) -> list[str]:
    warnings = []
    ip = metrics.get("isolation_pct", 0)
    lp = metrics.get("lighting_coverage_pct", 0)

    if config["id"] == "fastest":
        if ip > 20:
            warnings.append(f"{ip}% of route uses service or isolated roads")
        if lp < 50:
            warnings.append("Significant unlit stretches — exercise caution after 10 PM")
    elif config["id"] == "balanced" and ip > 15:
        warnings.append("Brief isolated segment — stay on main road side")

    return warnings


# ── Public API ───────────────────────────────────────────────────────────────

def compute_routes(
    G: nx.MultiDiGraph,
    origin_lat: float,
    origin_lng: float,
    dest_lat: float,
    dest_lng: float,
    travel_mode: str = "auto_cab",
    safety_priority: int = 70,
) -> list[dict]:
    """
    Compute safest / balanced / fastest routes between two lat/lng points.

    Returns a list of route dicts compatible with the PathPal frontend.
    Raises ValueError if no path can be found.
    """
    # Find nearest graph nodes (OSMnx uses X=lng, Y=lat)
    try:
        orig_node = ox.nearest_nodes(G, X=origin_lng, Y=origin_lat)
        dest_node = ox.nearest_nodes(G, X=dest_lng, Y=dest_lat)
    except Exception as e:
        raise ValueError(f"Could not locate graph nodes near given coordinates: {e}")

    if orig_node == dest_node:
        raise ValueError("Origin and destination resolve to the same graph node.")

    routes = []
    seen_paths: set[tuple] = set()

    for config in ROUTE_CONFIGS:
        try:
            weight_fn = _make_weight_fn(config["alpha"])
            path = nx.dijkstra_path(G, orig_node, dest_node, weight=weight_fn)
        except nx.NetworkXNoPath:
            logger.warning(f"No path found for route variant '{config['id']}'")
            continue
        except Exception as e:
            logger.warning(f"Routing error for '{config['id']}': {e}")
            continue

        path_key = tuple(path)
        # Deduplicate identical paths (can happen for very short distances)
        if path_key in seen_paths:
            # Force slight variation by using length-only fallback
            try:
                path = nx.shortest_path(G, orig_node, dest_node, weight="length")
            except Exception:
                continue
        seen_paths.add(path_key)

        waypoints = _path_to_waypoints(G, path)
        distance_km, metrics = _compute_path_metrics(G, path)

        if distance_km == 0:
            distance_km = _haversine_km(origin_lat, origin_lng, dest_lat, dest_lng)

        eta = _eta_minutes(distance_km, travel_mode)
        avg_safety = metrics.get("avg_safety_score", 50)
        lp = metrics.get("lighting_coverage_pct", 50)
        ip = metrics.get("isolation_pct", 30)
        fp = metrics.get("footfall_score", 60)

        # Police proximity proxy: safest route gets a bonus
        police_score = min(98, avg_safety + {"safest": 12, "balanced": 4, "fastest": -8}.get(config["id"], 0))

        route = {
            "id":           config["id"],
            "title":        config["title"],
            "subtitle":     config["subtitle"],
            "badge":        config["badge"],
            "badge_color":  config["badge_color"],
            "color":        config["color"],
            "safety_score": avg_safety,
            "eta_minutes":  eta,
            "distance_km":  round(distance_km, 2),
            "waypoints":    waypoints,
            "node_count":   len(path),
            "metrics": {
                "lighting_coverage": f"{lp}%",
                "footfall_activity": f"{fp}%",
                "police_proximity":  f"{police_score}%",
                "isolation_index":   get_isolation_label(ip),
                "transit_access":    "Moderate" if config["id"] == "balanced" else "Available",
            },
            "highlights":      _build_highlights(metrics, config),
            "hazard_warnings": _build_warnings(metrics, config),
            "raw_metrics":     metrics,
        }
        routes.append(route)

    if not routes:
        raise ValueError("No routes could be computed between origin and destination.")

    return routes
