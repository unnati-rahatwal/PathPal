// Free Open Source Routing Machine (OSRM) Live Road Network Fetcher

const OSRM_ENDPOINT = 'https://router.project-osrm.org/route/v1/driving';

/**
 * Fetches real road polylines, actual road driving distance, and travel duration from OSRM
 */
export async function fetchOSRMRoute(origin, dest) {
  if (!origin || !dest) return null;

  const url = `${OSRM_ENDPOINT}/${origin.lng},${origin.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson&steps=true`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    if (!data.routes || data.routes.length === 0) return null;

    const route = data.routes[0];
    // OSRM GeoJSON gives [lng, lat], Leaflet needs [lat, lng]
    const waypoints = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    const distanceKm = Number((route.distance / 1000).toFixed(1));
    const durationMins = Math.round(route.duration / 60);

    return {
      waypoints,
      distanceKm,
      durationMins
    };
  } catch (err) {
    console.warn('OSRM Live Route Fetcher fallback:', err);
    return null;
  }
}
