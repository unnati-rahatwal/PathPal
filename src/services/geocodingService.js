import { fetchSpatialSafetyMetrics } from './overpassService';

/**
 * Searches locations worldwide or filtered within Mumbai bounding box
 */
export async function searchPlaces(query) {
  if (!query || query.trim().length < 2) return [];

  // Bounding box for Mumbai region: minLon=72.7, minLat=18.9, maxLon=73.1, maxLat=19.4
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    query
  )}&viewbox=72.7,18.9,73.1,19.4&bounded=0&limit=8`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'PathPal-NightSafetyApp/1.0'
      }
    });

    if (!response.ok) return [];

    const data = await response.json();
    return Promise.all(
      data.map(async (item) => {
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        const nameParts = item.display_name.split(',');
        const mainName = nameParts.slice(0, 2).join(',').trim();

        // Fetch live spatial metrics around location from OSM
        const metrics = await fetchSpatialSafetyMetrics(lat, lng);

        return {
          id: `nominatim_${item.place_id}`,
          name: mainName,
          fullName: item.display_name,
          lat,
          lng,
          category: item.type ? item.type.replace('_', ' ') : 'Location',
          lightingIndex: metrics.lightingIndex,
          crowdIndex: metrics.crowdIndex,
          policeDensity: metrics.policeDensity,
          description: item.display_name
        };
      })
    );
  } catch (err) {
    console.warn('Nominatim geocoding fetch error:', err);
    return [];
  }
}

/**
 * Reverse geocodes Lat/Lng to address string
 */
export async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PathPal-NightSafetyApp/1.0'
      }
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (err) {
    console.warn('Reverse geocode error:', err);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}
