import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import RouteSelector from './components/RouteSelector';
import MapView from './components/MapView';
import RouteCardList from './components/RouteCardList';
import SafetyInspectorPanel from './components/SafetyInspectorPanel';
import CommunityAlertFeed from './components/CommunityAlertFeed';
import ReportModal from './components/ReportModal';
import SOSGuardModal from './components/SOSGuardModal';
import { fetchRoutes, fetchSafeHavens, fetchGraphHealth } from './services/apiService';
import { computeRoutes } from './services/routingEngine';
import { MUMBAI_LOCATIONS } from './data/mumbaiData';

export default function App() {
  // Active Tab state ('planner', 'inspector', 'community')
  const [activeTab, setActiveTab] = useState('planner');

  // Navigation & Location state (supports curated spots + any arbitrary OSM searched address)
  const [originLocation, setOriginLocation] = useState(MUMBAI_LOCATIONS[0]); // Bandra-Kurla Complex (BKC)
  const [destLocation, setDestLocation] = useState(MUMBAI_LOCATIONS[1]);     // Dadar Station
  const [travelMode, setTravelMode] = useState('Auto/Cab');
  const [activeProfile, setActiveProfile] = useState('solo_female');

  // Commuter preferences state
  const [preferences, setPreferences] = useState({
    safetyPriority: 88,
    lightPreference: true,
    avoidIsolated: true,
    preferPoliceChowkis: true,
    travelMode: 'Auto/Cab'
  });

  // Computed routes state (initialized with offline fallback, updated via OSMnx backend)
  const [routes, setRoutes] = useState(() => computeRoutes(originLocation.id || 'bkc', destLocation.id || 'dadar_stn', preferences));
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ connected: false, nodes: 0, edges: 0 });

  // Selected route state
  const [selectedRouteId, setSelectedRouteId] = useState('safest');

  // Live OpenStreetMap Nodes state
  const [liveOSMNodes, setLiveOSMNodes] = useState([]);

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  // Live Mumbai Time state
  const [mumbaiTime, setMumbaiTime] = useState('');

  // 1. Health check & Graph status
  useEffect(() => {
    fetchGraphHealth()
      .then((res) => {
        if (res?.graph?.status === 'ready') {
          setBackendStatus({
            connected: true,
            nodes: res.graph.nodes || 94658,
            edges: res.graph.edges || 224207
          });
        }
      })
      .catch(() => {
        setBackendStatus({ connected: false, nodes: 0, edges: 0 });
      });
  }, []);

  // 2. Fetch Live Safe Havens from backend Overpass API
  useEffect(() => {
    fetchSafeHavens()
      .then((havens) => {
        if (havens && havens.length > 0) {
          setLiveOSMNodes(havens);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch live OSM safe havens from backend:', err);
      });
  }, []);

  // 3. Recompute routes via OSMnx backend whenever origin, destination, or preferences change
  useEffect(() => {
    if (!originLocation || !destLocation) return;

    let isMounted = true;
    setIsLoadingRoutes(true);

    fetchRoutes(originLocation, destLocation, preferences)
      .then((computed) => {
        if (isMounted && computed && computed.length > 0) {
          setRoutes(computed);
          setIsLoadingRoutes(false);
        }
      })
      .catch((err) => {
        console.warn('Backend routing failed, using fallback engine:', err);
        if (isMounted) {
          setRoutes(computeRoutes(originLocation.id || 'bkc', destLocation.id || 'dadar_stn', preferences));
          setIsLoadingRoutes(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [originLocation, destLocation, preferences]);

  const selectedRoute = useMemo(() => {
    return routes.find((r) => r.id === selectedRouteId) || routes[0];
  }, [routes, selectedRouteId]);

  const originObj = originLocation;
  const destObj = destLocation;

  const handleSelectPreset = (preset) => {
    const o = MUMBAI_LOCATIONS.find((l) => l.id === preset.originId) || MUMBAI_LOCATIONS[0];
    const d = MUMBAI_LOCATIONS.find((l) => l.id === preset.destId) || MUMBAI_LOCATIONS[1];
    setOriginLocation(o);
    setDestLocation(d);
    setTravelMode(preset.travelMode);
    if (preset.commuterType.includes('Female')) setActiveProfile('solo_female');
    setSelectedRouteId('safest');
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        mumbaiTime={mumbaiTime}
        backendStatus={backendStatus}
      />

      {/* Main Content Area with Generous Spacing */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pb-12">
        {/* TAB 1: Route Planner & Map */}
        {activeTab === 'planner' && (
          <div className="space-y-6">
            {/* Top Workspace Grid: Planner Form (5 cols) + Interactive Map (7 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5">
                <RouteSelector
                  originLocation={originLocation}
                  setOriginLocation={setOriginLocation}
                  destLocation={destLocation}
                  setDestLocation={setDestLocation}
                  travelMode={travelMode}
                  setTravelMode={setTravelMode}
                  activeProfile={activeProfile}
                  setActiveProfile={setActiveProfile}
                  preferences={preferences}
                  setPreferences={setPreferences}
                  onSelectPreset={handleSelectPreset}
                  onRecalculate={() => setSelectedRouteId('safest')}
                />
              </div>

              <div className="lg:col-span-7">
                <MapView
                  routes={routes}
                  selectedRouteId={selectedRouteId}
                  setSelectedRouteId={setSelectedRouteId}
                  originLocation={originLocation}
                  destLocation={destLocation}
                  onPickLocation={({ type, loc }) => {
                    if (type === 'origin') setOriginLocation(loc);
                    if (type === 'dest') setDestLocation(loc);
                  }}
                  liveOSMNodes={liveOSMNodes}
                  isLoadingRoutes={isLoadingRoutes}
                />
              </div>
            </div>

            {/* Recommended Corridors (Cards Grid) */}
            <div>
              <RouteCardList
                routes={routes}
                selectedRouteId={selectedRouteId}
                setSelectedRouteId={setSelectedRouteId}
              />
            </div>

            {/* Selected Route Quick Inspector Summary */}
            <div className="pt-2">
              <SafetyInspectorPanel
                selectedRoute={selectedRoute}
                originName={originObj?.name || 'Origin'}
                destName={destObj?.name || 'Destination'}
              />
            </div>
          </div>
        )}

        {/* TAB 2: Safety Inspector Deep Dive */}
        {activeTab === 'inspector' && (
          <div className="space-y-6">
            <div className="bg-[#090d18] p-6 rounded-2xl border border-white/10 shadow-xl">
              <h2 className="text-lg font-black text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_#00F0FF]" />
                Full Safety Analytics & Corridor Breakdown
              </h2>
              <p className="text-xs text-slate-400">
                Evaluating spatial parameters from {originObj?.name} to {destObj?.name} across 12 Mumbai police divisions.
              </p>
            </div>

            <SafetyInspectorPanel
              selectedRoute={selectedRoute}
              originName={originObj?.name || 'Origin'}
              destName={destObj?.name || 'Destination'}
            />
          </div>
        )}

        {/* TAB 3: Community Live Night Feed */}
        {activeTab === 'community' && (
          <div className="space-y-6">
            <div className="bg-[#090d18] p-6 rounded-2xl border border-white/10 shadow-xl flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-wider mb-1">
                  Mumbai Live Night Commuter Feed
                </h2>
                <p className="text-xs text-slate-400">
                  Crowdsourced real-time reports verified by Mumbai night commuters.
                </p>
              </div>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all"
              >
                + Submit Live Update
              </button>
            </div>

            <CommunityAlertFeed onOpenReportModal={() => setIsReportModalOpen(true)} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#040710] border-t border-white/5 py-6 text-center text-xs text-slate-500 mt-auto px-4">
        <p className="max-w-4xl mx-auto">
          Balikaman: Smart Night-Time Route Planning Engine for Mumbai Commuters • Connected live to OpenStreetMap & OpenSpatial APIs.
        </p>
      </footer>

      {/* Modals */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onAddReport={() => {}}
      />

      <SOSGuardModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
      />
    </div>
  );
}
