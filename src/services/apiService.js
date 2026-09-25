/**
 * apiService.js
 * Centralized client for the PathPal FastAPI backend.
 * Falls back gracefully to local mock data if the backend is unavailable.
 */

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL || 'http://localhost:8000';

// ── Travel mode mapping: frontend labels → backend keys ──────────────────────
const TRAVEL_MODE_MAP = {
  'Auto/Cab':       'auto_cab',
  'Two-Wheeler':    'two_wheeler',
  'Walking':        'walking',
  'Public Transit': 'public_transit',
};

// ── Generic fetch wrapper ─────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw Object.assign(new Error(err?.detail?.message || err?.detail || res.statusText), {
      status: res.status,
      data: err,
    });
  }
  return res.json();
}

// ── Health check ──────────────────────────────────────────────────────────────
export async function fetchGraphHealth() {
  return apiFetch('/api/health');
}

// ── Route computation ─────────────────────────────────────────────────────────
/**
 * Compute safe routes between two coordinate pairs via the real OSMnx backend.
 *
 * @param {Object} origin      - { lat, lng }
 * @param {Object} destination - { lat, lng }
 * @param {Object} preferences - { safetyPriority, travelMode }
 * @returns {Promise<Array>}   - array of route objects
 */
export async function fetchRoutes(origin, destination, preferences = {}) {
  const payload = {
    origin: { lat: origin.lat, lng: origin.lng },
    destination: { lat: destination.lat, lng: destination.lng },
    preferences: {
      safety_priority: preferences.safetyPriority ?? 70,
      travel_mode: TRAVEL_MODE_MAP[preferences.travelMode] || 'auto_cab',
    },
  };

  const data = await apiFetch('/api/route', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  // Normalise backend response to match the shape the UI expects
  return data.routes.map(normaliseRoute);
}

// ── Normalise backend route => frontend route shape ────────────────────────────
function normaliseRoute(r) {
  return {
    id:           r.id,
    title:        r.title,
    subtitle:     r.subtitle,
    badge:        r.badge,
    badgeColor:   r.badge_color,
    safetyScore:  r.safety_score,
    etaMinutes:   r.eta_minutes,
    distanceKm:   r.distance_km,
    waypoints:    r.waypoints,        // [[lat, lng], ...]
    color:        r.color,
    metrics: {
      lightingCoverage: r.metrics?.lighting_coverage  ?? '--',
      footfallActivity: r.metrics?.footfall_activity  ?? '--',
      policeProximity:  r.metrics?.police_proximity   ?? '--',
      isolationIndex:   r.metrics?.isolation_index    ?? '--',
      transitAccess:    r.metrics?.transit_access     ?? '--',
    },
    highlights:     r.highlights     ?? [],
    hazardWarnings: r.hazard_warnings ?? [],
    nodeCount:      r.node_count,
    source: 'osmnx',
  };
}

// ── Safe havens (live Overpass) ───────────────────────────────────────────────
/**
 * Fetch real safe havens (police, pharmacy, fuel, CCTV) from the backend.
 * @param {Object} bounds - { south, west, north, east }
 */
export async function fetchSafeHavens(bounds = {}) {
  const { south = 18.89, west = 72.77, north = 19.27, east = 73.00 } = bounds;
  const params = new URLSearchParams({ south, west, north, east });
  const data = await apiFetch(`/api/safe-havens?${params}`);
  return data.havens;
}

// ── Hazardous dark zones (live Overpass) ─────────────────────────────────────
export async function fetchHazards(bounds = {}) {
  const { south = 18.89, west = 72.77, north = 19.27, east = 73.00 } = bounds;
  const params = new URLSearchParams({ south, west, north, east });
  const data = await apiFetch(`/api/hazards?${params}`);
  return data.hazards;
}

// ── Locations list ────────────────────────────────────────────────────────────
export async function fetchLocations(query = '') {
  const params = query ? new URLSearchParams({ q: query }) : '';
  const data = await apiFetch(`/api/locations${params ? `?${params}` : ''}`);
  return data.locations;
}

// ── Community reports ─────────────────────────────────────────────────────────
export async function fetchCommunityReports(limit = 20) {
  const data = await apiFetch(`/api/community-reports?limit=${limit}`);
  // Normalise snake_case to camelCase for the UI
  return data.reports.map((r) => ({
    id:             r.id,
    user:           r.user,
    badge:          r.badge,
    time:           r.time,
    timestamp:      r.timestamp,
    location:       r.location,
    lat:            r.lat,
    lng:            r.lng,
    category:       r.category,
    lightingRating: r.lighting_rating,
    status:         r.status,
    comment:        r.comment,
    upvotes:        r.upvotes,
  }));
}

export async function submitCommunityReport(report) {
  return apiFetch('/api/community-reports', {
    method: 'POST',
    body: JSON.stringify({
      user:            report.user || 'Anonymous Commuter',
      location:        report.location,
      lat:             report.lat  ?? null,
      lng:             report.lng  ?? null,
      category:        report.category,
      lighting_rating: Number(report.lightingRating),
      comment:         report.comment,
    }),
  });
}

// ── Free-form address search (Local + OSM Nominatim) ─────────────────────────
export async function searchAddresses(query) {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim();

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q + ', Mumbai')}&viewbox=72.75,19.32,73.05,18.88&bounded=1&limit=6`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'en' }
    });
    if (res.ok) {
      const data = await res.json();
      return data.map((item, idx) => {
        const parts = item.display_name.split(',');
        const mainName = parts.slice(0, 2).join(',').trim();
        const subName = parts.slice(2, 4).join(',').trim();
        return {
          id: `osm_${item.osm_id || idx}_${Date.now()}`,
          name: mainName,
          category: subName || item.type || 'Mumbai Locality',
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          source: 'osm'
        };
      });
    }
  } catch (err) {
    console.warn('Nominatim geocoding error:', err);
  }
  return [];
}

