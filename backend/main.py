"""
main.py
-------
PathPal FastAPI Backend — Night Safety Routing API for Mumbai

Endpoints:
  GET  /api/health              → server + graph load status
  POST /api/route               → compute safest/balanced/fastest routes
  GET  /api/safe-havens         → live OSM police/pharmacy/fuel POIs
  GET  /api/hazards             → live OSM dark zones (lit=no ways)
  GET  /api/locations           → curated Mumbai landmark list
  GET  /api/community-reports   → crowdsourced safety reports (in-memory)
  POST /api/community-reports   → submit a new safety report
  DELETE /api/cache             → invalidate cached OSM graph (admin)

Run:
  uvicorn main:app --reload --port 8000
"""

from __future__ import annotations

import logging
import threading
import time
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Optional

from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import graph_loader
import router as routing_engine
from overpass_client import fetch_safe_havens, fetch_dark_zones

# ── Logging ──────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("pathpal")

# ── Startup / Shutdown ───────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the OSM graph in a background thread so the API starts immediately."""
    logger.info("🚀 PathPal API starting — loading Mumbai OSM graph in background …")
    t = threading.Thread(target=graph_loader.load_graph_background, daemon=True)
    t.start()
    yield
    logger.info("PathPal API shutting down.")


# ── App ──────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="PathPal — Mumbai Night Safety API",
    description=(
        "Real-time safe routing and night safety intelligence for Mumbai "
        "powered by OpenStreetMap (OSMnx) and Overpass API."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS", "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory community reports store ────────────────────────────────────────

_community_reports: list[dict] = [
    {
        "id": "rep_101",
        "user": "Priya S.",
        "badge": "Verified Commuter",
        "time": "25 mins ago",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "location": "BKC Connector Flyover",
        "lat": 19.0657,
        "lng": 72.8687,
        "category": "Streetlight Restored",
        "lighting_rating": 5,
        "status": "Positive Alert",
        "comment": "Mumbai Municipal Corp just replaced 12 LED streetlamps on the connector. Very bright now!",
        "upvotes": 28,
    },
    {
        "id": "rep_102",
        "user": "Rohan M.",
        "badge": "Night Shift Commuter",
        "time": "45 mins ago",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "location": "Senapati Bapat Marg, Lower Parel",
        "lat": 19.0006,
        "lng": 72.8301,
        "category": "Police Patrol Active",
        "lighting_rating": 4,
        "status": "Safe Presence",
        "comment": "Pink police chowki & 2 beat marshals active near station exit. Felt very safe walking.",
        "upvotes": 42,
    },
    {
        "id": "rep_103",
        "user": "Ananya D.",
        "badge": "Daily Commuter",
        "time": "1 hour ago",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "location": "Dadar TT Circle Service Road",
        "lat": 19.0178,
        "lng": 72.8478,
        "category": "Low Visibility",
        "lighting_rating": 2,
        "status": "Caution Alert",
        "comment": "Tree branch blocking streetlamp near bus stop. Stick to the main road side.",
        "upvotes": 19,
    },
]

# ── Curated Mumbai landmark list ─────────────────────────────────────────────

MUMBAI_LOCATIONS = [
    {"id": "bkc",            "name": "Bandra-Kurla Complex (BKC)",          "category": "Commercial Hub",        "lat": 19.0657, "lng": 72.8687},
    {"id": "dadar_stn",      "name": "Dadar Station (West/East)",            "category": "Transit Hub",           "lat": 19.0178, "lng": 72.8478},
    {"id": "lower_parel",    "name": "Lower Parel (High St Phoenix)",        "category": "Nightlife & Tech",      "lat": 19.0006, "lng": 72.8301},
    {"id": "andheri_west",   "name": "Andheri West (Lokhandwala / SV Road)", "category": "Residential & Retail",  "lat": 19.1363, "lng": 72.8277},
    {"id": "airport_t2",     "name": "Mumbai Airport (T2 International)",    "category": "Airport & Transit",     "lat": 19.0896, "lng": 72.8656},
    {"id": "powai",          "name": "Powai (Hiranandani Gardens)",          "category": "Residential & Tech",    "lat": 19.1197, "lng": 72.9051},
    {"id": "colaba",         "name": "Colaba Causeway & Gateway",            "category": "Tourist & Waterfront",  "lat": 18.9220, "lng": 72.8347},
    {"id": "cst_fort",       "name": "CST (Chhatrapati Shivaji Terminus)",   "category": "Transit Hub",           "lat": 18.9401, "lng": 72.8347},
    {"id": "kurla_stn",      "name": "Kurla West (LBS Marg)",                "category": "Transit & Mixed",       "lat": 19.0650, "lng": 72.8790},
    {"id": "malad_mindspace","name": "Malad West (Mindspace IT Park)",       "category": "IT Hub",                "lat": 19.1860, "lng": 72.8350},
    {"id": "bandra_bandstand","name": "Bandra Bandstand & Promenade",        "category": "Waterfront Boulevard",  "lat": 19.0434, "lng": 72.8194},
    {"id": "juhu_beach",     "name": "Juhu Beach Circle & Hotel Zone",       "category": "Waterfront & Hospitality","lat": 19.0988, "lng": 72.8264},
    {"id": "thane_stn",      "name": "Thane Station (East/West)",            "category": "Transit Hub",           "lat": 19.1835, "lng": 72.9629},
    {"id": "navi_mumbai_vashi","name":"Vashi (Navi Mumbai)",                 "category": "Commercial Hub",        "lat": 19.0771, "lng": 72.9987},
    {"id": "worli_seaface",  "name": "Worli Sea Face & Bandra-Worli Sealink","category": "Waterfront",            "lat": 18.9987, "lng": 72.8151},
    {"id": "churchgate",     "name": "Churchgate Station",                   "category": "Transit Hub",           "lat": 18.9352, "lng": 72.8258},
    {"id": "andheri_east",   "name": "Andheri East (MIDC / Chakala)",        "category": "Industrial & IT",       "lat": 19.1151, "lng": 72.8608},
    {"id": "borivali",       "name": "Borivali West (National Park Side)",   "category": "Residential",           "lat": 19.2288, "lng": 72.8567},
    {"id": "dharavi",        "name": "Dharavi (Sion / Mahim Junction)",      "category": "Residential",           "lat": 19.0424, "lng": 72.8530},
    {"id": "goregaon",       "name": "Goregaon East (Film City Road)",       "category": "Media & Residential",   "lat": 19.1663, "lng": 72.8526},
]

# ── Request / Response Models ─────────────────────────────────────────────────

class Coordinate(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)


class RoutePreferences(BaseModel):
    safety_priority: int = Field(70, ge=0, le=100)
    travel_mode: str = Field("auto_cab", pattern="^(walking|two_wheeler|auto_cab|public_transit)$")


class RouteRequest(BaseModel):
    origin: Coordinate
    destination: Coordinate
    preferences: RoutePreferences = RoutePreferences()


class ReportSubmission(BaseModel):
    user: str = Field(..., min_length=2, max_length=60)
    location: str = Field(..., min_length=3, max_length=120)
    lat: Optional[float] = None
    lng: Optional[float] = None
    category: str
    lighting_rating: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=10, max_length=500)


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"service": "PathPal Mumbai Night Safety API", "version": "1.0.0"}


@app.get("/api/health")
def health():
    """Graph load status + server uptime."""
    status = graph_loader.get_status()
    return {
        "api": "ok",
        "graph": status,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.post("/api/route")
def compute_route(req: RouteRequest):
    """
    Compute safe routes between two lat/lng coordinates.

    Requires the OSM graph to be loaded (check /api/health first).
    Returns 3 route variants: safest, balanced, fastest.
    """
    if not graph_loader.is_ready():
        status = graph_loader.get_status()
        raise HTTPException(
            status_code=503,
            detail={
                "message": "OSM graph is still loading. Please retry in a moment.",
                "graph_status": status["status"],
            },
        )

    G = graph_loader.get_graph()

    try:
        routes = routing_engine.compute_routes(
            G,
            origin_lat=req.origin.lat,
            origin_lng=req.origin.lng,
            dest_lat=req.destination.lat,
            dest_lng=req.destination.lng,
            travel_mode=req.preferences.travel_mode,
            safety_priority=req.preferences.safety_priority,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.exception("Routing failed")
        raise HTTPException(status_code=500, detail=f"Routing error: {e}")

    return {
        "routes": routes,
        "origin": req.origin.model_dump(),
        "destination": req.destination.model_dump(),
        "graph_nodes": G.number_of_nodes(),
        "graph_edges": G.number_of_edges(),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/api/safe-havens")
def get_safe_havens(
    south: float = Query(18.89),
    west:  float = Query(72.77),
    north: float = Query(19.27),
    east:  float = Query(73.00),
):
    """
    Fetch real-time safe haven POIs from OpenStreetMap Overpass API.
    Includes police stations, pharmacies, petrol pumps, hospitals, CCTV.
    """
    bbox = f"{south},{west},{north},{east}"
    havens = fetch_safe_havens(bbox)
    return {"havens": havens, "count": len(havens), "source": "openstreetmap"}


@app.get("/api/hazards")
def get_hazards(
    south: float = Query(18.89),
    west:  float = Query(72.77),
    north: float = Query(19.27),
    east:  float = Query(73.00),
):
    """
    Fetch dark zones (OSM ways tagged lit=no) from OpenStreetMap.
    """
    bbox = f"{south},{west},{north},{east}"
    zones = fetch_dark_zones(bbox)
    return {"hazards": zones, "count": len(zones), "source": "openstreetmap"}


@app.get("/api/locations")
def get_locations(q: Optional[str] = Query(None, min_length=1)):
    """
    Return curated list of Mumbai landmarks.
    Optionally filter by name with ?q=query.
    """
    if q:
        q_lower = q.lower()
        results = [
            loc for loc in MUMBAI_LOCATIONS
            if q_lower in loc["name"].lower() or q_lower in loc["category"].lower()
        ]
    else:
        results = MUMBAI_LOCATIONS

    return {"locations": results, "count": len(results)}


@app.get("/api/community-reports")
def get_community_reports(limit: int = Query(20, ge=1, le=100)):
    """Return recent community safety reports (newest first)."""
    return {
        "reports": _community_reports[-limit:][::-1],
        "count": len(_community_reports),
    }


@app.post("/api/community-reports", status_code=201)
def submit_report(report: ReportSubmission):
    """Submit a new crowdsourced safety report."""
    now = datetime.now(timezone.utc)
    new_report = {
        "id":              f"rep_{uuid.uuid4().hex[:8]}",
        "user":            report.user,
        "badge":           "Community Reporter",
        "time":            "Just now",
        "timestamp":       now.isoformat(),
        "location":        report.location,
        "lat":             report.lat,
        "lng":             report.lng,
        "category":        report.category,
        "lighting_rating": report.lighting_rating,
        "status":          "Pending Review",
        "comment":         report.comment,
        "upvotes":         0,
    }
    _community_reports.append(new_report)
    logger.info(f"New community report submitted: {new_report['id']} @ {report.location}")
    return {"success": True, "report": new_report}


@app.delete("/api/cache")
def invalidate_cache():
    """
    Delete cached OSM graph and trigger a fresh download.
    WARNING: Next routing requests will fail until re-download completes (~5 min).
    """
    graph_loader.invalidate_cache()
    t = threading.Thread(target=graph_loader.load_graph_background, daemon=True)
    t.start()
    return {"message": "Cache invalidated. Graph re-downloading in background."}


# ── Dev entrypoint ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", "8000")),
        reload=True,
    )
