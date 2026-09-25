// Smart Multi-Criteria Night Routing Engine for Mumbai Commuters

import { MUMBAI_LOCATIONS, SAFE_HAVENS } from '../data/mumbaiData';

/**
 * Calculates Euclidean / Haversine distance in km between two lat/lng pairs
 */
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Generates smooth path waypoints between origin and destination with slight realistic road curves
 */
function generateWaypoints(origin, dest, viaOffset = 0, numPoints = 6) {
  const points = [];
  const midLat = (origin.lat + dest.lat) / 2;
  const midLng = (origin.lng + dest.lng) / 2;

  // Add perpendicular offset for route variation (e.g. Western Express Highway vs SV Road vs Link Road)
  const offsetLat = (dest.lng - origin.lng) * viaOffset;
  const offsetLng = -(dest.lat - origin.lat) * viaOffset;

  points.push([origin.lat, origin.lng]);

  for (let i = 1; i < numPoints - 1; i++) {
    const t = i / (numPoints - 1);
    // quadratic bezier curve factor
    const curveFactor = Math.sin(t * Math.PI);
    const lat = (1 - t) * origin.lat + t * dest.lat + offsetLat * curveFactor;
    const lng = (1 - t) * origin.lng + t * dest.lng + offsetLng * curveFactor;
    points.push([lat, lng]);
  }

  points.push([dest.lat, dest.lng]);
  return points;
}

/**
 * Calculates comprehensive safety metrics and route details
 */
export function computeRoutes(originId, destId, preferences = {}) {
  const {
    safetyPriority = 70, // 0-100 slider weight
    lightPreference = true,
    avoidIsolated = true,
    preferPoliceChowkis = true,
    travelMode = 'Auto/Cab' // 'Walking', 'Auto/Cab', 'Two-Wheeler', 'Public Transit'
  } = preferences;

  const origin = MUMBAI_LOCATIONS.find((l) => l.id === originId) || MUMBAI_LOCATIONS[0];
  const dest = MUMBAI_LOCATIONS.find((l) => l.id === destId) || MUMBAI_LOCATIONS[1];

  const straightDist = getDistanceKm(origin.lat, origin.lng, dest.lat, dest.lng);
  
  // Base speed multiplier by travel mode
  let baseSpeedKmh = 25; // Cab/Auto
  if (travelMode === 'Walking') baseSpeedKmh = 4.5;
  if (travelMode === 'Two-Wheeler') baseSpeedKmh = 30;
  if (travelMode === 'Public Transit') baseSpeedKmh = 20;

  // Route 1: SAFEST ROUTE (Arterial well-lit main avenues, police beat coverage, open late-night spots)
  const distSafest = Number((straightDist * 1.25).toFixed(1));
  const etaSafest = Math.round((distSafest / baseSpeedKmh) * 60) + 4; // slight main road traffic buffer
  
  const lightSafest = Math.min(98, Math.round((origin.lightingIndex + dest.lightingIndex) / 2 + 8));
  const footfallSafest = Math.min(95, Math.round((origin.crowdIndex + dest.crowdIndex) / 2 + 5));
  const policeSafest = Math.min(96, Math.round((origin.policeDensity + dest.policeDensity) / 2 + 6));
  const isolationRiskSafest = 8; // out of 100 (very low risk)

  const safetyScoreSafest = Math.round(
    lightSafest * 0.35 +
    footfallSafest * 0.25 +
    policeSafest * 0.25 +
    (100 - isolationRiskSafest) * 0.15
  );

  // Route 2: BALANCED ROUTE (Optimal trade-off between time and safety)
  const distBalanced = Number((straightDist * 1.12).toFixed(1));
  const etaBalanced = Math.round((distBalanced / baseSpeedKmh) * 60);

  const lightBalanced = Math.round((origin.lightingIndex + dest.lightingIndex) / 2);
  const footfallBalanced = Math.round((origin.crowdIndex + dest.crowdIndex) / 2);
  const policeBalanced = Math.round((origin.policeDensity + dest.policeDensity) / 2);
  const isolationRiskBalanced = 22;

  const safetyScoreBalanced = Math.round(
    lightBalanced * 0.35 +
    footfallBalanced * 0.25 +
    policeBalanced * 0.25 +
    (100 - isolationRiskBalanced) * 0.15
  );

  // Route 3: FASTEST ROUTE (Shortcuts, service lanes or flyovers with lower lighting/higher isolation)
  const distFastest = Number((straightDist * 1.03).toFixed(1));
  const etaFastest = Math.max(3, Math.round((distFastest / baseSpeedKmh) * 60) - 3);

  const lightFastest = Math.max(50, Math.round((origin.lightingIndex + dest.lightingIndex) / 2 - 18));
  const footfallFastest = Math.max(45, Math.round((origin.crowdIndex + dest.crowdIndex) / 2 - 20));
  const policeFastest = Math.max(52, Math.round((origin.policeDensity + dest.policeDensity) / 2 - 15));
  const isolationRiskFastest = 48; // Higher risk score

  const safetyScoreFastest = Math.round(
    lightFastest * 0.35 +
    footfallFastest * 0.25 +
    policeFastest * 0.25 +
    (100 - isolationRiskFastest) * 0.15
  );

  const waypointsSafest = generateWaypoints(origin, dest, 0.18, 8);
  const waypointsBalanced = generateWaypoints(origin, dest, 0.0, 7);
  const waypointsFastest = generateWaypoints(origin, dest, -0.15, 6);

  return [
    {
      id: 'safest',
      title: 'Safest Corridor',
      subtitle: 'Primary lit arterial avenues, continuous Police Chowki & CCTV coverage',
      badge: 'RECOMMENDED FOR NIGHT',
      badgeColor: 'emerald',
      safetyScore: safetyScoreSafest,
      etaMinutes: etaSafest,
      distanceKm: distSafest,
      metrics: {
        lightingCoverage: `${lightSafest}%`,
        footfallActivity: `${footfallSafest}%`,
        policeProximity: `${policeSafest}%`,
        isolationIndex: 'Low (8%)',
        transitAccess: 'Direct Access'
      },
      waypoints: waypointsSafest,
      color: '#10B981', // Emerald green
      highlights: [
        '100% High-Intensity LED Streetlights',
        '2 Police Pink Booths & 24/7 Patrol',
        'Passes open fuel stations with security guard',
        'Bypasses isolated flyover construction zone'
      ],
      hazardWarnings: []
    },
    {
      id: 'balanced',
      title: 'Balanced Route',
      subtitle: 'Standard city route balancing lighting, speed, and public transport hubs',
      badge: 'OPTIMAL ETA & SAFETY',
      badgeColor: 'cyan',
      safetyScore: safetyScoreBalanced,
      etaMinutes: etaBalanced,
      distanceKm: distBalanced,
      metrics: {
        lightingCoverage: `${lightBalanced}%`,
        footfallActivity: `${footfallBalanced}%`,
        policeProximity: `${policeBalanced}%`,
        isolationIndex: 'Moderate (22%)',
        transitAccess: 'Near Metro / Train'
      },
      waypoints: waypointsBalanced,
      color: '#00F0FF', // Cyan
      highlights: [
        'Main commercial road network',
        'Moderate late night traffic & taxi activity',
        'Near metro station entry points'
      ],
      hazardWarnings: ['1 brief 200m stretch with tree canopy shadows']
    },
    {
      id: 'fastest',
      title: 'Fastest Shortcut',
      subtitle: 'Shortest distance via service road / lower deck flyover',
      badge: 'CAUTION AFTER 10 PM',
      badgeColor: 'amber',
      safetyScore: safetyScoreFastest,
      etaMinutes: etaFastest,
      distanceKm: distFastest,
      metrics: {
        lightingCoverage: `${lightFastest}%`,
        footfallActivity: `${footfallFastest}%`,
        policeProximity: `${policeFastest}%`,
        isolationIndex: 'High (48%)',
        transitAccess: 'Limited Night Access'
      },
      waypoints: waypointsFastest,
      color: '#F59E0B', // Amber
      highlights: [
        'Saves ~3 to 5 minutes travel time',
        'Fewer traffic signals'
      ],
      hazardWarnings: [
        'Limited streetlighting on service alley',
        'Low pedestrian footfall after 11 PM',
        'Isolated underpass section'
      ]
    }
  ];
}
