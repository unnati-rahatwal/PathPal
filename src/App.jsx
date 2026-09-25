import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import RouteSelector from './components/RouteSelector';
import MapView from './components/MapView';
import RouteCardList from './components/RouteCardList';
import SafetyInspectorPanel from './components/SafetyInspectorPanel';
import CommunityAlertFeed from './components/CommunityAlertFeed';
import ReportModal from './components/ReportModal';
import SOSGuardModal from './components/SOSGuardModal';
import { computeRoutes } from './services/routingEngine';
import { fetchLiveMumbaiOSMData } from './services/overpassService';
import { MUMBAI_LOCATIONS } from './data/mumbaiData';

export default function App() {
  // Active Tab state ('planner', 'inspector', 'community')
  const [activeTab, setActiveTab] = useState('planner');

  // Navigation & Location state
  const [originId, setOriginId] = useState('bkc');
  const [destId, setDestId] = useState('dadar_stn');
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

  // Selected route state
  const [selectedRouteId, setSelectedRouteId] = useState('safest');

  // Live OpenStreetMap Nodes state
  const [liveOSMNodes, setLiveOSMNodes] = useState([]);

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  // Live Mumbai Time state
  const [mumbaiTime, setMumbaiTime] = useState('');

  // Fetch Live OpenStreetMap nodes for Mumbai on mount
  useEffect(() => {
    fetchLiveMumbaiOSMData().then((nodes) => {
      if (nodes && nodes.length > 0) {
        setLiveOSMNodes(nodes);
      }
    });
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setMumbaiTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update preferences when profile preset changes
  useEffect(() => {
    if (activeProfile === 'solo_female') {
      setPreferences((prev) => ({ ...prev, safetyPriority: 88, avoidIsolated: true, lightPreference: true }));
    } else if (activeProfile === 'late_shift') {
      setPreferences((prev) => ({ ...prev, safetyPriority: 75, preferPoliceChowkis: true }));
    } else if (activeProfile === 'two_wheeler') {
      setPreferences((prev) => ({ ...prev, safetyPriority: 65, lightPreference: true }));
    } else {
      setPreferences((prev) => ({ ...prev, safetyPriority: 70 }));
    }
  }, [activeProfile]);

  // Keep travelMode synced with preferences
  useEffect(() => {
    setPreferences((prev) => ({ ...prev, travelMode }));
  }, [travelMode]);

  // Compute 3 routes whenever inputs change
  const routes = useMemo(() => {
    return computeRoutes(originId, destId, preferences);
  }, [originId, destId, preferences]);

  const selectedRoute = useMemo(() => {
    return routes.find((r) => r.id === selectedRouteId) || routes[0];
  }, [routes, selectedRouteId]);

  const originObj = MUMBAI_LOCATIONS.find((l) => l.id === originId);
  const destObj = MUMBAI_LOCATIONS.find((l) => l.id === destId);

  const handleSelectPreset = (preset) => {
    setOriginId(preset.originId);
    setDestId(preset.destId);
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
                  originId={originId}
                  setOriginId={setOriginId}
                  destId={destId}
                  setDestId={setDestId}
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
                  originId={originId}
                  destId={destId}
                  liveOSMNodes={liveOSMNodes}
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
