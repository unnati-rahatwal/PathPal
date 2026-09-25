"""
graph_loader.py
---------------
Downloads Mumbai's full OSM street graph via OSMnx, annotates every edge
with a nighttime safety score, and caches the result to disk.

Graph is loaded once at startup and shared across all requests.
"""

from __future__ import annotations

import os
import pickle
import logging
import threading
from pathlib import Path
from typing import Optional

import osmnx as ox
import networkx as nx

from safety_scorer import score_edge

logger = logging.getLogger(__name__)

# ── Config ───────────────────────────────────────────────────────────────────

CACHE_DIR = Path(os.getenv("GRAPH_CACHE_DIR", "cache"))
GRAPH_CACHE_PATH = CACHE_DIR / "mumbai_graph.pkl"

MUMBAI_BBOX = (
    float(os.getenv("MUMBAI_NORTH", "19.27")),   # north
    float(os.getenv("MUMBAI_SOUTH", "18.89")),   # south
    float(os.getenv("MUMBAI_EAST",  "73.00")),   # east
    float(os.getenv("MUMBAI_WEST",  "72.77")),   # west
)

NETWORK_TYPE = os.getenv("OSM_NETWORK_TYPE", "all")

# Useful OSM tags to retain on edges (includes safety-relevant ones)
USEFUL_TAGS = [
    "bridge", "tunnel", "oneway", "lanes", "name", "highway",
    "maxspeed", "service", "access", "surface", "lit",
    "sidewalk", "footway", "cycleway", "foot", "bicycle",
    "junction", "width", "man_made",
]

# ── Internal state ───────────────────────────────────────────────────────────

_graph: Optional[nx.MultiDiGraph] = None
_graph_lock = threading.Lock()
_graph_status: str = "not_loaded"   # not_loaded | loading | ready | error
_graph_error: str = ""


def get_status() -> dict:
    return {
        "status": _graph_status,
        "error": _graph_error,
        "nodes": _graph.number_of_nodes() if _graph else 0,
        "edges": _graph.number_of_edges() if _graph else 0,
        "cache_exists": GRAPH_CACHE_PATH.exists(),
    }


def is_ready() -> bool:
    return _graph_status == "ready"


def get_graph() -> Optional[nx.MultiDiGraph]:
    return _graph


# ── Graph Loading ────────────────────────────────────────────────────────────

def _configure_osmnx() -> None:
    ox.settings.log_console = False
    ox.settings.use_cache = True
    ox.settings.useful_tags_way = USEFUL_TAGS
    ox.settings.requests_timeout = 180


def _annotate_safety_scores(G: nx.MultiDiGraph) -> nx.MultiDiGraph:
    """Add safety_score attribute to every edge based on OSM tags."""
    for _u, _v, _k, data in G.edges(data=True, keys=True):
        data["safety_score"] = score_edge(data)
    return G


def _load_from_cache() -> Optional[nx.MultiDiGraph]:
    if not GRAPH_CACHE_PATH.exists():
        return None
    try:
        logger.info(f"Loading cached graph from {GRAPH_CACHE_PATH} ...")
        with open(GRAPH_CACHE_PATH, "rb") as f:
            G = pickle.load(f)
        logger.info(
            f"Cache loaded: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges"
        )
        return G
    except Exception as e:
        logger.warning(f"Cache load failed ({e}), will re-download.")
        return None


def _save_to_cache(G: nx.MultiDiGraph) -> None:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    with open(GRAPH_CACHE_PATH, "wb") as f:
        pickle.dump(G, f, protocol=pickle.HIGHEST_PROTOCOL)
    logger.info(f"Graph cached to {GRAPH_CACHE_PATH}")


def _download_graph() -> nx.MultiDiGraph:
    north, south, east, west = MUMBAI_BBOX
    logger.info(
        f"Downloading Mumbai OSM graph (bbox={MUMBAI_BBOX}, type={NETWORK_TYPE}) …"
    )
    logger.info("This may take 2–8 minutes on first run depending on network speed.")

    # OSMnx 2.x: graph_from_bbox takes bbox=(left, bottom, right, top) = (west, south, east, north)
    try:
        # OSMnx 2.x API
        G = ox.graph_from_bbox(
            bbox=(west, south, east, north),
            network_type=NETWORK_TYPE,
            simplify=True,
            retain_all=False,
        )
    except TypeError:
        # OSMnx 1.x fallback
        G = ox.graph_from_bbox(
            north=north,
            south=south,
            east=east,
            west=west,
            network_type=NETWORK_TYPE,
            simplify=True,
            retain_all=False,
        )
    return G


def load_graph_background() -> None:
    """
    Called in a background thread at startup.
    Downloads (or loads from cache) the Mumbai street graph and annotates
    every edge with a safety score.
    """
    global _graph, _graph_status, _graph_error

    with _graph_lock:
        if _graph_status == "loading":
            return
        _graph_status = "loading"

    try:
        _configure_osmnx()

        # Try cache first
        G = _load_from_cache()

        if G is None:
            G = _download_graph()
            logger.info("Annotating edges with safety scores …")
            G = _annotate_safety_scores(G)
            _save_to_cache(G)
        else:
            # Ensure safety scores exist (re-annotate if missing)
            sample_edge = next(iter(G.edges(data=True)), (None, None, {}))
            if "safety_score" not in sample_edge[2]:
                logger.info("Re-annotating safety scores (cache from older version) …")
                G = _annotate_safety_scores(G)
                _save_to_cache(G)

        with _graph_lock:
            _graph = G
            _graph_status = "ready"

        logger.info(
            f"✅ Graph ready: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges"
        )

    except Exception as e:
        logger.exception("Failed to load Mumbai OSM graph")
        with _graph_lock:
            _graph_status = "error"
            _graph_error = str(e)


def invalidate_cache() -> None:
    """Delete cached graph file so it will be re-downloaded on next load."""
    if GRAPH_CACHE_PATH.exists():
        GRAPH_CACHE_PATH.unlink()
        logger.info("Graph cache invalidated.")
