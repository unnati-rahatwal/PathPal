// Spatial Dataset for Mumbai NightSafe Navigation System

export const MUMBAI_LOCATIONS = [
  {
    id: 'bkc',
    name: 'Bandra-Kurla Complex (BKC)',
    category: 'Commercial Hub',
    lat: 19.0657,
    lng: 72.8687,
    lightingIndex: 94,
    crowdIndex: 78,
    policeDensity: 90,
    description: 'Major financial center with wide lit avenues, CCTV coverage, and 24/7 corporate security.'
  },
  {
    id: 'dadar_stn',
    name: 'Dadar Station (West/East)',
    category: 'Transit Hub',
    lat: 19.0178,
    lng: 72.8478,
    lightingIndex: 88,
    crowdIndex: 95,
    policeDensity: 92,
    description: 'Central transit interchange, highly active late night with high footfall & continuous police chowkis.'
  },
  {
    id: 'lower_parel',
    name: 'Lower Parel (High St Phoenix)',
    category: 'Nightlife & Tech',
    lat: 19.0006,
    lng: 72.8301,
    lightingIndex: 91,
    crowdIndex: 85,
    policeDensity: 88,
    description: 'Corporate and dining hub with well-patrolled arterial roads and open 24/7 establishments.'
  },
  {
    id: 'andheri_west',
    name: 'Andheri West (Lokhandwala / SV Road)',
    category: 'Residential & Retail',
    lat: 19.1363,
    lng: 72.8277,
    lightingIndex: 85,
    crowdIndex: 82,
    policeDensity: 80,
    description: 'Bustling suburb with active night markets, metro access, and multiple safe havens.'
  },
  {
    id: 'airport_t2',
    name: 'Mumbai Airport (T2 International)',
    category: 'Airport & Transit',
    lat: 19.0896,
    lng: 72.8656,
    lightingIndex: 98,
    crowdIndex: 92,
    policeDensity: 96,
    description: '24/7 heavily guarded international hub with continuous streetlights, CISF & Mumbai Police.'
  },
  {
    id: 'powai',
    name: 'Powai (Hiranandani Gardens)',
    category: 'Residential & Tech',
    lat: 19.1197,
    lng: 72.9051,
    lightingIndex: 89,
    crowdIndex: 75,
    policeDensity: 82,
    description: 'Gated township feel, brightly lit main boulevards with moderate late-night footfall.'
  },
  {
    id: 'colaba',
    name: 'Colaba Causeway & Gateway',
    category: 'Tourist & Waterfront',
    lat: 18.9220,
    lng: 72.8347,
    lightingIndex: 87,
    crowdIndex: 70,
    policeDensity: 91,
    description: 'Historic heritage zone with high police patrol density, coastal police chowkis.'
  },
  {
    id: 'cst_fort',
    name: 'Chhatrapati Shivaji Maharaj Terminus (CST)',
    category: 'Transit Hub',
    lat: 18.9401,
    lng: 72.8347,
    lightingIndex: 93,
    crowdIndex: 90,
    policeDensity: 95,
    description: 'UNESCO heritage central terminus with active police beat, 24/7 cab stands & CCTV.'
  },
  {
    id: 'kurla_stn',
    name: 'Kurla West (LBS Marg)',
    category: 'Transit & Mixed',
    lat: 19.0650,
    lng: 72.8790,
    lightingIndex: 72,
    crowdIndex: 88,
    policeDensity: 75,
    description: 'High footfall traffic corridor, some narrow unlit side lanes; main LBS road well-patrolled.'
  },
  {
    id: 'malad_mindspace',
    name: 'Malad West (Mindspace IT Park)',
    category: 'IT Hub',
    lat: 19.1860,
    lng: 72.8350,
    lightingIndex: 86,
    crowdIndex: 72,
    policeDensity: 84,
    description: 'BPO and corporate zone with night cab escorts, lit link road, and private security.'
  },
  {
    id: 'bandra_bandstand',
    name: 'Bandra Bandstand & Promenade',
    category: 'Waterfront Boulevard',
    lat: 19.0434,
    lng: 72.8194,
    lightingIndex: 84,
    crowdIndex: 68,
    policeDensity: 87,
    description: 'Popular coastal promenade with active police vans and bright promenade lamps.'
  },
  {
    id: 'juhu_beach',
    name: 'Juhu Beach Circle & Hotel Zone',
    category: 'Waterfront & Hospitality',
    lat: 19.0988,
    lng: 72.8264,
    lightingIndex: 89,
    crowdIndex: 84,
    policeDensity: 89,
    description: 'Vibrant hotel belt with continuous private security, open QSRs, and tourist police patrol.'
  }
];

export const SAFE_HAVENS = [
  {
    id: 'sh_1',
    name: 'Dadar Police Chowki & Pink Booth',
    type: 'Police Station',
    lat: 19.0190,
    lng: 72.8465,
    openHours: '24/7',
    contact: '022-24145454'
  },
  {
    id: 'sh_2',
    name: 'HP Fuel Station & 24/7 Quick Store (BKC)',
    type: 'Petrol Pump',
    lat: 19.0680,
    lng: 72.8640,
    openHours: '24/7',
    contact: '022-26501111'
  },
  {
    id: 'sh_3',
    name: 'Apollo 24/7 Pharmacy (Andheri SV Road)',
    type: 'Pharmacy',
    lat: 19.1340,
    lng: 72.8290,
    openHours: '24/7',
    contact: '1860-500-0101'
  },
  {
    id: 'sh_4',
    name: 'Lower Parel Women Safety Booth (RPF/Police)',
    type: 'Pink Booth',
    lat: 19.0015,
    lng: 72.8295,
    openHours: '24/7',
    contact: '103'
  },
  {
    id: 'sh_5',
    name: 'BPCL Petrol Pump & McDonald 24/7 (Airport Rd)',
    type: 'Safe Haven',
    lat: 19.0920,
    lng: 72.8680,
    openHours: '24/7',
    contact: '022-26829000'
  },
  {
    id: 'sh_6',
    name: 'Powai Hiranandani Police Beat Marshals',
    type: 'Police Patrol',
    lat: 19.1210,
    lng: 72.9035,
    openHours: '24/7',
    contact: '100'
  },
  {
    id: 'sh_7',
    name: 'Bandra Police Beat Chowki (Hill Road)',
    type: 'Police Station',
    lat: 19.0530,
    lng: 72.8310,
    openHours: '24/7',
    contact: '022-26422000'
  }
];

export const DARK_ZONES_AND_HAZARDS = [
  {
    id: 'hz_1',
    title: 'Low Lighting Underpass',
    locationName: 'Sion-Dadar Flyover Service Road',
    lat: 19.0350,
    lng: 72.8580,
    severity: 'Medium',
    type: 'Streetlight Deficit',
    advice: 'Prefer main flyover upper deck or well-lit Ambedkar road.'
  },
  {
    id: 'hz_2',
    title: 'Isolated Construction Stretch',
    locationName: 'Metro Line 3 Construction Bypass (Mahim)',
    lat: 19.0420,
    lng: 72.8410,
    severity: 'High',
    type: 'Isolation & Shadow Zone',
    advice: 'Pedestrians advised to avoid side walkway after 11 PM; stick to main bus route corridor.'
  },
  {
    id: 'hz_3',
    title: 'Low Footfall Industrial Lane',
    locationName: 'Elphinstone Road West Alley',
    lat: 19.0035,
    lng: 72.8240,
    severity: 'Medium',
    type: 'Low Night Activity',
    advice: 'Use Senapati Bapat Marg instead.'
  },
  {
    id: 'hz_4',
    title: 'Tree Canopy Shadow Zone',
    locationName: 'Juhu Tara Road Junction',
    lat: 19.0910,
    lng: 72.8270,
    severity: 'Low',
    type: 'Partial Shadow',
    advice: 'Main road lit; keep to wide sidewalk side.'
  }
];

export const PRESET_ROUTES = [
  {
    id: 'preset_1',
    title: 'BKC Office Hub ➔ Dadar Railway Station',
    originId: 'bkc',
    destId: 'dadar_stn',
    commuterType: 'Solo Female',
    travelMode: 'Auto/Cab'
  },
  {
    id: 'preset_2',
    title: 'Lower Parel Nightlife ➔ Andheri West',
    originId: 'lower_parel',
    destId: 'andheri_west',
    commuterType: 'Late Shift Worker',
    travelMode: 'Public Transit'
  },
  {
    id: 'preset_3',
    title: 'T2 International Airport ➔ Powai Hiranandani',
    originId: 'airport_t2',
    destId: 'powai',
    commuterType: 'Night Commuter',
    travelMode: 'Auto/Cab'
  },
  {
    id: 'preset_4',
    title: 'Colaba Causeway ➔ CST Station',
    originId: 'colaba',
    destId: 'cst_fort',
    commuterType: 'Tourist / Commuter',
    travelMode: 'Walking'
  },
  {
    id: 'preset_5',
    title: 'Bandra Bandstand ➔ Juhu Beach',
    originId: 'bandra_bandstand',
    destId: 'juhu_beach',
    commuterType: 'Late Evening Commuter',
    travelMode: 'Two-Wheeler'
  },
  {
    id: 'preset_6',
    title: 'Malad Mindspace ➔ Andheri Lokhandwala',
    originId: 'malad_mindspace',
    destId: 'andheri_west',
    commuterType: 'BPO Night Shift',
    travelMode: 'Two-Wheeler'
  }
];

export const INITIAL_COMMUNITY_REPORTS = [
  {
    id: 'rep_101',
    user: 'Priya S.',
    badge: 'Verified Commuter',
    time: '25 mins ago',
    location: 'BKC Connector Flyover',
    category: 'Streetlight Restored',
    lightingRating: 5,
    status: 'Positive Alert',
    comment: 'Mumbai Municipal Corp just replaced 12 LED streetlamps on the connector. Very bright now!',
    upvotes: 28
  },
  {
    id: 'rep_102',
    user: 'Rohan M.',
    badge: 'Night Shift Commuter',
    time: '45 mins ago',
    location: 'Senapati Bapat Marg, Lower Parel',
    category: 'Police Patrol Active',
    lightingRating: 4,
    status: 'Safe Presence',
    comment: 'Pink police chowki & 2 beat marshals active near station exit. Felt very safe walking.',
    upvotes: 42
  },
  {
    id: 'rep_103',
    user: 'Ananya D.',
    badge: 'Daily Commuter',
    time: '1 hour ago',
    location: 'Dadar TT Circle Service Road',
    category: 'Low Visibility',
    lightingRating: 2,
    status: 'Caution Alert',
    comment: 'Tree branch blocking streetlamp near bus stop. Stick to the main road side.',
    upvotes: 19
  }
];
