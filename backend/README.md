# PathPal Backend

A **FastAPI + OSMnx** backend that powers real safety-aware routing for Mumbai using live OpenStreetMap data.

## Architecture

```
backend/
├── main.py            # FastAPI app — all REST endpoints
├── graph_loader.py    # OSMnx graph download + disk cache + background loading
├── safety_scorer.py   # OSM tag → nighttime safety score (0–100) per edge
├── router.py          # Dijkstra routing with safety-weighted edges
├── overpass_client.py # Live Overpass API: police/pharmacy/fuel POIs + dark zones
├── requirements.txt
└── .env.example
```

## How it works

1. **On startup**, `graph_loader` downloads Mumbai's full street graph from OSM via OSMnx.
   - ~50,000–200,000 nodes / edges depending on `OSM_NETWORK_TYPE`
   - Cached to `cache/mumbai_graph.pkl` after first download (takes 3–8 min on first run)

2. **Safety scoring**: Every edge gets a `safety_score` (0–100) based on real OSM tags:
   | Tag | Effect |
   |-----|--------|
   | `lit=yes` | +35 pts |
   | `lit=no` | −20 pts |
   | `highway=primary` | +18 pts |
   | `highway=path` | +4 pts |
   | `sidewalk=both` | +8 pts |
   | `access=private` | −15 pts |

3. **Routing**: Dijkstra with a safety-weighted cost function:
   ```
   w(edge) = length × (1 + α × (1 − safety_score/100) × 9)
   ```
   - `α=0.90` → Safest route (unsafe edges cost up to 10× more)
   - `α=0.50` → Balanced route
   - `α=0.05` → Fastest route (near-pure distance)

4. **Live POIs**: `/api/safe-havens` and `/api/hazards` query Overpass API in real-time for current data.

## Setup

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Copy env
cp .env.example .env

# 3. Start the server
uvicorn main:app --reload --port 8000
```

> **First run**: The Mumbai OSM graph will be downloaded automatically. This takes **3–8 minutes**.  
> The API is available immediately at port 8000 — routing endpoints return HTTP 503 until the graph is ready.  
> Check status at: `GET /api/health`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/api/health` | Server + graph load status |
| `POST` | `/api/route` | Compute safe routes |
| `GET`  | `/api/safe-havens` | Live OSM police/pharmacy/fuel POIs |
| `GET`  | `/api/hazards` | Live OSM dark zones (lit=no) |
| `GET`  | `/api/locations` | Mumbai landmark list |
| `GET`  | `/api/community-reports` | Crowdsourced safety reports |
| `POST` | `/api/community-reports` | Submit a report |
| `DELETE` | `/api/cache` | Invalidate graph cache (re-download) |

### POST /api/route — Example

```json
{
  "origin": { "lat": 19.0657, "lng": 72.8687 },
  "destination": { "lat": 19.0178, "lng": 72.8478 },
  "preferences": {
    "safety_priority": 70,
    "travel_mode": "auto_cab"
  }
}
```

`travel_mode` options: `walking` | `two_wheeler` | `auto_cab` | `public_transit`

### Response

```json
{
  "routes": [
    {
      "id": "safest",
      "title": "Safest Corridor",
      "safety_score": 84,
      "eta_minutes": 18,
      "distance_km": 5.3,
      "waypoints": [[19.065, 72.868], ...],
      "metrics": {
        "lighting_coverage": "91%",
        "footfall_activity": "78%",
        "police_proximity": "88%",
        "isolation_index": "Low (7%)"
      },
      "highlights": [...],
      "hazard_warnings": [...]
    }
  ]
}
```

## Connecting the Frontend

Add to `.env` in the Vite frontend:
```env
VITE_BACKEND_API_BASE_URL=http://localhost:8000
```

The frontend's `routingEngine.js` and `overpassService.js` can be replaced to call these endpoints directly.

## Data Sources

- **Street graph**: © OpenStreetMap contributors (ODbL) via OSMnx
- **POIs**: Live Overpass API (`overpass-api.de`)
- **Safety tags**: `lit=`, `highway=`, `sidewalk=`, `surface=`, `access=` from OSM contributors
