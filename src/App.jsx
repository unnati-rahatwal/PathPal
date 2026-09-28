import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import LandingHero from './components/LandingHero';
import RouteSelector from './components/RouteSelector';
import MapView from './components/MapView';
import RouteCardList from './components/RouteCardList';
import SafetyInspectorPanel from './components/SafetyInspectorPanel';
import CommunityAlertFeed from './components/CommunityAlertFeed';
import ReportModal from './components/ReportModal';
import SOSGuardModal from './components/SOSGuardModal';
import { fetchRoutes, fetchSafeHavens, fetchGraphHealth } from './services/apiService';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import { MessageSquarePlus } from 'lucide-react';

export default function App() {
  // Active Tab state ('home', 'planner', 'inspector', 'community')
  const [activeTab, setActiveTab] = useState('home');

  // Community Reports state with live Supabase sync
  const [reports, setReports] = useState([]);

  // Navigation & Location state (dynamic search & pin coordinates)
  const [originLocation, setOriginLocation] = useState({
    name: 'Bandra Kurla Complex (BKC)',
    category: 'Commercial Hub, Bandra East',
    lat: 19.0688,
    lng: 72.8703
  });
  const [destLocation, setDestLocation] = useState({
    name: 'Dadar Railway Station',
    category: 'Central Transit Interchange',
    lat: 19.0178,
    lng: 72.8478
  });

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

  // Keep travelMode synced with preferences
  useEffect(() => {
    setPreferences((prev) => ({ ...prev, travelMode }));
  }, [travelMode]);

  // Computed routes state (calculated live by FastAPI + OSMnx backend)
  const [routes, setRoutes] = useState([]);
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

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setMumbaiTime(new Intl.DateTimeFormat('en-IN', options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch live reports from Supabase if configured, subscribe to realtime updates
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setReports(data);
          }
        });

      const channel = supabase
        .channel('public:reports')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'reports' },
          (payload) => {
            if (payload.new) {
              setReports((prev) => [payload.new, ...prev]);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const handleAddReport = async (newReport) => {
    setReports((prev) => [newReport, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('reports').insert([newReport]);
      } catch (err) {
        console.warn('Supabase report save fallback:', err);
      }
    }
  };

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

  // 2. Fetch Live Safe Havens from backend (Overpass + Google Places)
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
    if (!originLocation || !destLocation || !originLocation.lat || !destLocation.lat) return;

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
        console.warn('Backend routing failed:', err);
        if (isMounted) {
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pb-12">
        {/* TAB 0: Home & Landing Hero */}
        {activeTab === 'home' && (
          <LandingHero
            onLaunchPlanner={() => setActiveTab('planner')}
            onOpenSOS={() => setIsSOSOpen(true)}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            mumbaiTime={mumbaiTime}
          />
        )}

        {/* TAB 1: Route Planner & Interactive Map */}
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
                  liveOSMNodes={liveOSMNodes}
                  isLoadingRoutes={isLoadingRoutes}
                  reports={reports}
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
                originName={originLocation?.name || 'Origin'}
                destName={destLocation?.name || 'Destination'}
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
                Evaluating spatial parameters from {originLocation?.name} to {destLocation?.name} across 12 Mumbai police divisions.
              </p>
            </div>

            <SafetyInspectorPanel
              selectedRoute={selectedRoute}
              originName={originLocation?.name || 'Origin'}
              destName={destLocation?.name || 'Destination'}
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
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all cursor-pointer"
              >
                + Submit Live Update
              </button>
            </div>

            <CommunityAlertFeed reports={reports} onOpenReportModal={() => setIsReportModalOpen(true)} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#040710] border-t border-white/5 py-6 text-center text-xs text-slate-500 mt-auto px-4">
        <p className="max-w-4xl mx-auto">
          PathPal: Smart Night-Time Route Planning Engine for Mumbai Commuters • Connected live to OpenStreetMap & OpenSpatial APIs.
        </p>
      </footer>

      {/* Persistent Floating Action Button: + Submit Live Report */}
      <button
        onClick={() => setIsReportModalOpen(true)}
        className="fixed bottom-6 right-6 z-[1200] px-5 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xl shadow-amber-400/50 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-200/80"
      >
        <MessageSquarePlus className="w-4 h-4 text-slate-950 fill-current animate-pulse" />
        <span>+ Submit Live Report</span>
      </button>

      {/* Modals */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onAddReport={handleAddReport}
      />

      <SOSGuardModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        liveOSMNodes={liveOSMNodes}
      />
    </div>
  );
}
