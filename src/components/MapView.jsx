import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Shield, Sun, AlertTriangle, Fuel, Layers, Navigation, Play, Pause, RotateCcw, Map } from 'lucide-react';
import { MUMBAI_LOCATIONS, SAFE_HAVENS, DARK_ZONES_AND_HAZARDS } from '../data/mumbaiData';

// Fix Leaflet default marker icon path issue in Vite React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to smoothly reset bounds on map when selected route changes
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.length === 2 && !isNaN(center[0])) {
      map.flyTo(center, 13, { duration: 1.2 });
    }
  }, [center, map]);
  return null;
}

export default function MapView({
  routes,
  selectedRouteId,
  setSelectedRouteId,
  originId,
  destId,
  liveOSMNodes = []
}) {
  const [showLightingHeatmap, setShowLightingHeatmap] = useState(true);
  const [showPolicePosts, setShowPolicePosts] = useState(true);
  const [showSafeHavens, setShowSafeHavens] = useState(true);
  const [showHazards, setShowHazards] = useState(true);

  // Map Tile Theme selection (defaulting to clean Cyber Inverted OSM without watermarks)
  const [tileTheme, setTileTheme] = useState('osm_cyber');

  // Live Navigation Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStepIndex, setSimStepIndex] = useState(0);

  const origin = MUMBAI_LOCATIONS.find((l) => l.id === originId) || MUMBAI_LOCATIONS[0];
  const dest = MUMBAI_LOCATIONS.find((l) => l.id === destId) || MUMBAI_LOCATIONS[1];

  const mapCenter = [(origin.lat + dest.lat) / 2, (origin.lng + dest.lng) / 2];
  const currentSelectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  // Simulating commuter position along the polyline
  useEffect(() => {
    let timer;
    if (isSimulating && currentSelectedRoute?.waypoints) {
      timer = setInterval(() => {
        setSimStepIndex((prev) => {
          if (prev >= currentSelectedRoute.waypoints.length - 1) {
            setIsSimulating(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isSimulating, currentSelectedRoute]);

  const simPos = currentSelectedRoute?.waypoints?.[simStepIndex] || [origin.lat, origin.lng];

  // Tile provider configurations
  const TILE_PROVIDERS = {
    osm_cyber: {
      name: 'Cyber Midnight Dark (OSM)',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
      className: 'dark-leaflet-tiles'
    },
    carto_dark: {
      name: 'CARTO Basemap Dark',
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
      attribution: '&copy; CARTO &copy; OpenStreetMap'
    },
    esri_dark: {
      name: 'ArcGIS Night Canvas',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Base/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri'
    }
  };

  const activeProvider = TILE_PROVIDERS[tileTheme] || TILE_PROVIDERS.carto_dark;

  // Custom Icons
  const originIcon = new L.DivIcon({
    className: 'custom-map-icon',
    html: `<div style="background:#10B981; color:white; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; border:2.5px solid white; box-shadow:0 0 16px #10B981;">A</div>`
  });

  const destIcon = new L.DivIcon({
    className: 'custom-map-icon',
    html: `<div style="background:#00F0FF; color:#0b0f19; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; border:2.5px solid white; box-shadow:0 0 16px #00F0FF;">B</div>`
  });

  const simCommuterIcon = new L.DivIcon({
    className: 'custom-map-icon',
    html: `<div style="background:#A855F7; color:white; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px; border:2.5px solid white; box-shadow:0 0 18px #A855F7;" class="animate-bounce">🚶‍♀️</div>`
  });

  const policeIcon = new L.DivIcon({
    className: 'custom-map-icon',
    html: `<div style="background:#1E40AF; color:white; width:26px; height:26px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:12px; border:1.5px solid #60A5FA; box-shadow:0 0 10px #3B82F6;">👮</div>`
  });

  const safeHavenIcon = new L.DivIcon({
    className: 'custom-map-icon',
    html: `<div style="background:#047857; color:white; width:26px; height:26px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:12px; border:1.5px solid #34D399; box-shadow:0 0 10px #10B981;">⛽</div>`
  });

  const hazardIcon = new L.DivIcon({
    className: 'custom-map-icon',
    html: `<div style="background:#B91C1C; color:white; width:26px; height:26px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:12px; border:1.5px solid #FCA5A5; box-shadow:0 0 10px #EF4444;">⚠️</div>`
  });

  return (
    <div className="relative w-full h-[550px] rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-2xl flex flex-col">
      {/* Top Left Layer Controls */}
      <div className="absolute top-3 left-3 z-[1000] bg-[#0c1220]/95 backdrop-blur-md p-2 rounded-xl border border-white/10 flex flex-wrap items-center gap-2 text-xs shadow-xl">
        <div className="flex items-center gap-1.5 px-2 py-1 text-slate-400 font-semibold border-r border-white/10">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>NIGHT LAYERS:</span>
        </div>

        <button
          onClick={() => setShowLightingHeatmap(!showLightingHeatmap)}
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 transition-all ${
            showLightingHeatmap
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-white/5 border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sun className="w-3 h-3 text-amber-400" />
          <span>Streetlights</span>
        </button>

        <button
          onClick={() => setShowPolicePosts(!showPolicePosts)}
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 transition-all ${
            showPolicePosts
              ? 'bg-blue-500/20 border-blue-400 text-blue-300'
              : 'bg-white/5 border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-3 h-3 text-blue-400" />
          <span>Police Chowkis</span>
        </button>

        <button
          onClick={() => setShowSafeHavens(!showSafeHavens)}
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 transition-all ${
            showSafeHavens
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
              : 'bg-white/5 border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Fuel className="w-3 h-3 text-emerald-400" />
          <span>24/7 Safe Havens</span>
        </button>

        <button
          onClick={() => setShowHazards(!showHazards)}
          className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1.5 transition-all ${
            showHazards
              ? 'bg-red-500/20 border-red-400 text-red-300'
              : 'bg-white/5 border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-3 h-3 text-red-400" />
          <span>Dark Zones</span>
        </button>
      </div>

      {/* Top Right Map Style Selector */}
      <div className="absolute top-3 right-3 z-[1000] bg-[#0c1220]/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 text-[11px] text-slate-300 flex items-center gap-2 shadow-xl">
        <Map className="w-3.5 h-3.5 text-cyan-400" />
        <select
          value={tileTheme}
          onChange={(e) => setTileTheme(e.target.value)}
          className="bg-transparent text-xs font-semibold text-cyan-300 focus:outline-none cursor-pointer"
        >
          <option value="carto_dark">Midnight Dark (CARTO)</option>
          <option value="osm_cyber">Cyber Inverted (OSM)</option>
          <option value="esri_dark">ArcGIS Night Canvas</option>
        </select>
      </div>

      {/* Navigation Simulation Trigger Toolbar (Bottom Floating) */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-[#0c1220]/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-cyan-500/30 text-xs flex items-center gap-3 shadow-xl">
        <span className="font-bold text-cyan-400 flex items-center gap-1.5">
          <Navigation className="w-4 h-4 text-cyan-400" />
          NIGHT COMMUTE SIMULATOR:
        </span>
        <button
          onClick={() => {
            if (isSimulating) {
              setIsSimulating(false);
            } else {
              setSimStepIndex(0);
              setIsSimulating(true);
            }
          }}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
            isSimulating
              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
              : 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:opacity-90 shadow-lg shadow-cyan-500/20'
          }`}
        >
          {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isSimulating ? 'Pause Journey' : 'Simulate Live Journey'}</span>
        </button>
        {simStepIndex > 0 && (
          <button
            onClick={() => {
              setIsSimulating(false);
              setSimStepIndex(0);
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Leaflet Map Canvas */}
      <MapContainer
        center={mapCenter}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <MapRecenter center={mapCenter} />

        {/* Dynamic Dark Tile Layer */}
        <TileLayer
          key={tileTheme}
          attribution={activeProvider.attribution}
          url={activeProvider.url}
          className={activeProvider.className || ''}
          maxZoom={19}
        />

        {/* Render Routes as Polylines */}
        {routes.map((route) => {
          const isSelected = selectedRouteId === route.id;
          return (
            <Polyline
              key={route.id}
              positions={route.waypoints}
              pathOptions={{
                color: route.color,
                weight: isSelected ? 7 : 3.5,
                opacity: isSelected ? 0.95 : 0.45,
                dashArray: isSelected ? null : '6, 6',
                lineCap: 'round',
                lineJoin: 'round'
              }}
              eventHandlers={{
                click: () => setSelectedRouteId(route.id)
              }}
            >
              <Popup>
                <div className="text-xs p-1">
                  <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: route.color }}
                    />
                    {route.title}
                  </div>
                  <p className="text-slate-300 text-[11px] mb-2">{route.subtitle}</p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/60 p-2 rounded border border-white/10">
                    <div>
                      <span className="text-slate-400 block">Safety Score</span>
                      <span className="font-bold text-emerald-400">{route.safetyScore}/100</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Night ETA</span>
                      <span className="font-bold text-cyan-400">{route.etaMinutes} mins</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* Start (Origin) Marker */}
        <Marker position={[origin.lat, origin.lng]} icon={originIcon}>
          <Popup>
            <div className="text-xs">
              <strong className="text-emerald-400">ORIGIN: {origin.name}</strong>
              <p className="text-slate-300 text-[11px] mt-1">{origin.description}</p>
              <div className="mt-2 text-[10px] text-slate-400">
                Lighting Coverage: <span className="text-amber-300 font-bold">{origin.lightingIndex}%</span>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Destination Marker */}
        <Marker position={[dest.lat, dest.lng]} icon={destIcon}>
          <Popup>
            <div className="text-xs">
              <strong className="text-cyan-400">DESTINATION: {dest.name}</strong>
              <p className="text-slate-300 text-[11px] mt-1">{dest.description}</p>
              <div className="mt-2 text-[10px] text-slate-400">
                Lighting Coverage: <span className="text-amber-300 font-bold">{dest.lightingIndex}%</span>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Live Simulated Commuter Marker */}
        {simStepIndex > 0 && (
          <Marker position={simPos} icon={simCommuterIcon}>
            <Popup defaultOpen>
              <div className="text-xs">
                <strong className="text-purple-400">Live Night Commuter</strong>
                <div className="text-[10px] text-slate-300 mt-1">
                  En Route via {currentSelectedRoute.title} ({Math.round((simStepIndex / (currentSelectedRoute.waypoints.length - 1)) * 100)}% Complete)
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Streetlight density heat halos */}
        {showLightingHeatmap &&
          MUMBAI_LOCATIONS.map((loc) => (
            <Circle
              key={`light_halo_${loc.id}`}
              center={[loc.lat, loc.lng]}
              radius={750}
              pathOptions={{
                fillColor: '#F59E0B',
                fillOpacity: (loc.lightingIndex / 100) * 0.18,
                color: '#F59E0B',
                weight: 0.8,
                opacity: 0.3
              }}
            />
          ))}

        {/* Police Posts & Chowkis */}
        {showPolicePosts &&
          SAFE_HAVENS.filter((sh) => sh.type.includes('Police') || sh.type.includes('Pink'))
            .map((sh) => (
              <Marker key={sh.id} position={[sh.lat, sh.lng]} icon={policeIcon}>
                <Popup>
                  <div className="text-xs">
                    <strong className="text-blue-400">{sh.name}</strong>
                    <div className="text-[11px] text-slate-300 mt-1">Status: {sh.openHours}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">Call: {sh.contact}</div>
                  </div>
                </Popup>
              </Marker>
            ))}

        {/* 24/7 Safe Havens */}
        {showSafeHavens &&
          SAFE_HAVENS.filter((sh) => !sh.type.includes('Police') && !sh.type.includes('Pink'))
            .map((sh) => (
              <Marker key={sh.id} position={[sh.lat, sh.lng]} icon={safeHavenIcon}>
                <Popup>
                  <div className="text-xs">
                    <strong className="text-emerald-400">{sh.name}</strong>
                    <div className="text-[11px] text-slate-300 mt-1">Safe Haven • {sh.openHours}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">Helpline: {sh.contact}</div>
                  </div>
                </Popup>
              </Marker>
            ))}

        {/* Live OSM Fetched Nodes */}
        {liveOSMNodes.map((node) => (
          <Marker
            key={node.id}
            position={[node.lat, node.lng]}
            icon={node.type === 'Police Station' ? policeIcon : safeHavenIcon}
          >
            <Popup>
              <div className="text-xs">
                <strong className="text-emerald-400">{node.name}</strong>
                <div className="text-[11px] text-slate-300 mt-1">{node.type} • Live OSM</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Dark Zones and Hazards */}
        {showHazards &&
          DARK_ZONES_AND_HAZARDS.map((hz) => (
            <Marker key={hz.id} position={[hz.lat, hz.lng]} icon={hazardIcon}>
              <Popup>
                <div className="text-xs">
                  <strong className="text-red-400">⚠️ {hz.title}</strong>
                  <div className="text-[11px] text-slate-200 font-medium mt-1">{hz.locationName}</div>
                  <p className="text-slate-400 text-[10px] mt-1">{hz.advice}</p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
