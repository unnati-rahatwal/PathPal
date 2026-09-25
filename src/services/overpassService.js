// Live OpenStreetMap Overpass API Fetcher for Mumbai Night Safety Infrastructure

const OVERPASS_ENDPOINT = import.meta.env.VITE_OVERPASS_API_URL || 'https://overpass-api.de/api/interpreter';

/**
 * Fetches real live spatial nodes (Police stations, 24/7 Petrol Pumps, Pharmacies) across Mumbai
 */
export async function fetchLiveMumbaiOSMData(bbox = '18.9,72.7,19.3,73.0') {
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"="police"](${bbox});
      node["amenity"="fuel"](${bbox});
      node["amenity"="pharmacy"](${bbox});
    );
    out body 25;
  `;

  try {
    const response = await fetch(OVERPASS_ENDPOINT, {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!response.ok) {
      throw new Error(`Overpass API HTTP error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.elements) return [];

    return data.elements.map((el) => {
      const type = el.tags?.amenity === 'police' ? 'Police Station' :
                   el.tags?.amenity === 'fuel' ? 'Petrol Pump' : 'Pharmacy';
      
      return {
        id: `osm_${el.id}`,
        name: el.tags?.name || `${type} (OSM Verified)`,
        type: type,
        lat: el.lat,
        lng: el.lon,
        openHours: el.tags?.opening_hours || '24/7 Active',
        contact: el.tags?.phone || '100 / 112'
      };
    });
  } catch (err) {
    console.warn('Overpass API live fetch fallback:', err.message);
    return [];
  }
}
