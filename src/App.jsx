import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/views/LandingPage';
import RoutePlanner from './components/views/RoutePlanner';
import RouteDetail from './components/views/RouteDetail';
import HowItWorks from './components/views/HowItWorks';
import TouristMode from './components/views/TouristMode';
import CorporateMode from './components/views/CorporateMode';
import Dashboard from './components/views/Dashboard';
import ReportHazard from './components/views/ReportHazard';
import Onboarding from './components/views/Onboarding';
import SOSGuardModal from './components/SOSGuardModal';
import { fetchRoutes, fetchSafeHavens, fetchGraphHealth, fetchCommunityReports } from './services/apiService';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import { PhoneCall } from 'lucide-react';

export default function App() {
  // Navigation active tab: 'home' | 'planner' | 'detail' | 'howItWorks' | 'tourist' | 'corporate' | 'dashboard' | 'report' | 'onboarding'
  const [activeTab, setActiveTab] = useState('home');

  // Commuter locations (dynamically chosen via Google Places / OSM Nominatim search)
  const [originLocation, setOriginLocation] = useState({
    name: 'Bandra West (Linking Road)',
    category: 'Commercial & Retail Corridor',
    lat: 19.0596,
    lng: 72.8295
  });
  const [destLocation, setDestLocation] = useState({
    name: 'Bandra Kurla Complex (BKC)',
    category: 'Corporate Finance Center',
    lat: 19.0688,
    lng: 72.8703
  });

  const [travelMode, setTravelMode] = useState('Auto/Cab');
  const [activeProfile, setActiveProfile] = useState('solo_female');

  // Commuter preferences
  const [preferences, setPreferences] = useState({
    safetyPriority: 88,
    lightPreference: true,
    avoidIsolated: true,
    preferPoliceChowkis: true,
    travelMode: 'Auto/Cab'
  });

  // Keep travelMode synced
  useEffect(() => {
    setPreferences((prev) => ({ ...prev, travelMode }));
  }, [travelMode]);

  // Real backend computed routes (OSMnx Dijkstra multi-corridors)
  const [routes, setRoutes] = useState([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState('safest');
  const [backendStatus, setBackendStatus] = useState({ connected: false, nodes: 0, edges: 0 });

  // Safe havens (from live OSM Overpass and Google Places)
  const [liveOSMNodes, setLiveOSMNodes] = useState([]);

  // Community safety reports
  const [reports, setReports] = useState([]);

  // Modals
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  // 1. Health check & Graph status
  useEffect(() => {
    fetchGraphHealth()
      .then((res) => {
        if (res?.graph?.status === 'ready') {
          setBackendStatus({
            connected: true,
            nodes: res.graph.nodes || 94817,
            edges: res.graph.edges || 224673
          });
        }
      })
      .catch(() => {
        setBackendStatus({ connected: false, nodes: 0, edges: 0 });
      });
  }, []);

  // 2. Fetch live Safe Havens from backend
  useEffect(() => {
    fetchSafeHavens()
      .then((havens) => {
        if (havens && havens.length > 0) {
          setLiveOSMNodes(havens);
        }
      })
      .catch((err) => {
        console.warn('Safe havens query failed:', err);
      });
  }, []);

  // 3. Fetch community reports (backend + Supabase sync)
  useEffect(() => {
    fetchCommunityReports()
      .then((reps) => {
        if (reps && reps.length > 0) setReports(reps);
      })
      .catch(() => {});

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
    }
  }, []);

  // 4. Compute routes via real OSMnx backend whenever origin, destination, or preferences change
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
        console.warn('Backend routing query failed:', err);
        if (isMounted) setIsLoadingRoutes(false);
      });

    return () => {
      isMounted = false;
    };
  }, [originLocation, destLocation, preferences]);

  const selectedRoute = useMemo(() => {
    return routes.find((r) => r.id === selectedRouteId) || routes[0];
  }, [routes, selectedRouteId]);

  const handleInspectRoute = (route) => {
    if (route?.id) setSelectedRouteId(route.id);
    setActiveTab('detail');
  };

  const handleSelectSavedRoute = (sr) => {
    if (sr.origin) setOriginLocation(sr.origin);
    if (sr.dest) setDestLocation(sr.dest);
    setActiveTab('planner');
  };

  const handleOnboardingComplete = (data) => {
    if (data.activeProfile) setActiveProfile(data.activeProfile);
    if (data.preferences) setPreferences(data.preferences);
    setActiveTab('planner');
  };

  const handleReportSubmitted = (newRep) => {
    setReports((prev) => [newRep, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0d0630] text-[#e6f9af] flex flex-col font-sans selection:bg-[#8bbeb2]/30 selection:text-[#e6f9af]">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSOS={() => setIsSOSOpen(true)}
        backendStatus={backendStatus}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <LandingPage
            onLaunchPlanner={() => setActiveTab('planner')}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'planner' && (
          <RoutePlanner
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
            routes={routes}
            selectedRouteId={selectedRouteId}
            setSelectedRouteId={setSelectedRouteId}
            isLoadingRoutes={isLoadingRoutes}
            liveOSMNodes={liveOSMNodes}
            reports={reports}
            onInspectRoute={handleInspectRoute}
          />
        )}

        {activeTab === 'detail' && (
          <RouteDetail
            selectedRoute={selectedRoute}
            originLocation={originLocation}
            destLocation={destLocation}
            liveOSMNodes={liveOSMNodes}
            onBack={() => setActiveTab('planner')}
            onOpenSOS={() => setIsSOSOpen(true)}
          />
        )}

        {activeTab === 'howItWorks' && (
          <HowItWorks
            onLaunchPlanner={() => setActiveTab('planner')}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'tourist' && (
          <TouristMode
            onLaunchPlanner={() => setActiveTab('planner')}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenSOS={() => setIsSOSOpen(true)}
          />
        )}

        {activeTab === 'corporate' && (
          <CorporateMode
            onLaunchPlanner={() => setActiveTab('planner')}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            onLaunchPlanner={() => setActiveTab('planner')}
            onSelectSavedRoute={handleSelectSavedRoute}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'report' && (
          <ReportHazard
            onReportSubmitted={handleReportSubmitted}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'onboarding' && (
          <Onboarding
            onComplete={handleOnboardingComplete}
            onSkip={() => setActiveTab('planner')}
          />
        )}
      </main>

      {/* Persistent Floating SOS Lifeline Button */}
      <button
        onClick={() => setIsSOSOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xl shadow-red-600/50 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-red-400"
        title="Trigger Emergency SOS"
      >
        <PhoneCall className="w-4 h-4 animate-bounce" />
        <span className="hidden sm:inline">NIGHT SOS</span>
      </button>

      {/* Emergency SOS Modal */}
      <SOSGuardModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        liveOSMNodes={liveOSMNodes}
      />
    </div>
  );
}
