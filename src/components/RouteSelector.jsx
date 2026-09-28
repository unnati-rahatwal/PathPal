import React, { useState, useEffect } from 'react';
import {
  Navigation,
  Car,
  Bike,
  Footprints,
  Bus,
  ArrowUpDown,
  Sliders,
  ChevronDown,
  ChevronUp,
  Sun,
  ShieldAlert,
  AlertOctagon,
  Clock,
  Sparkles,
  Zap,
  Locate,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import LocationSearchInput from './LocationSearchInput';
import { MUMBAI_LOCATIONS, PRESET_ROUTES } from '../data/mumbaiData';
import { getCurrentUserLocation } from '../services/locationService';
import { isSupabaseConfigured, supabase } from '../services/supabaseClient';

export default function RouteSelector({
  originLocation,
  setOriginLocation,
  destLocation,
  setDestLocation,
  travelMode,
  setTravelMode,
  activeProfile,
  setActiveProfile,
  preferences,
  setPreferences,
  onRecalculate
}) {
  const [showPreferences, setShowPreferences] = useState(false);
  const [nightTime, setNightTime] = useState('12:00 AM');
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Dynamic Popular Corridors State
  const [popularCorridors, setPopularCorridors] = useState(PRESET_ROUTES);

  // Fetch live popular routes from Supabase if configured
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase
        .from('popular_routes')
        .select('*')
        .limit(6)
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setPopularCorridors(data);
          }
        });
    }
  }, []);

  const TRAVEL_MODES = [
    { id: 'Auto/Cab', label: 'Cab / Auto', icon: Car, etaBadge: 'Fastest' },
    { id: 'Two-Wheeler', label: 'Two-Wheeler', icon: Bike, etaBadge: 'Agile' },
    { id: 'Walking', label: 'Pedestrian', icon: Footprints, etaBadge: 'Lit Lanes' },
    { id: 'Public Transit', label: 'Metro / Train', icon: Bus, etaBadge: 'High Footfall' }
  ];

  const PROFILES = [
    { id: 'solo_female', label: 'Solo Female', icon: '👩', desc: 'Max streetlight & safe havens' },
    { id: 'late_shift', label: 'Late Shift', icon: '💼', desc: 'Police chowki corridor sync' },
    { id: 'two_wheeler', label: 'Two-Wheeler', icon: '🛵', desc: 'Arterial lit avenues' },
    { id: 'general', label: 'General', icon: '🌙', desc: 'Balanced night routing' }
  ];

  const NIGHT_TIMES = [
    '10:00 PM (Evening Peak)',
    '12:00 AM (Midnight)',
    '02:00 AM (Late Night)',
    '04:00 AM (Dawn)'
  ];

  const handleProfileSelect = (profileId) => {
    setActiveProfile(profileId);
    if (profileId === 'solo_female') {
      setPreferences((prev) => ({
        ...prev,
        safetyPriority: 88,
        lightPreference: true,
        preferPoliceChowkis: true,
        avoidIsolated: true
      }));
    } else if (profileId === 'late_shift') {
      setPreferences((prev) => ({
        ...prev,
        safetyPriority: 75,
        preferPoliceChowkis: true
      }));
    } else if (profileId === 'two_wheeler') {
      setPreferences((prev) => ({
        ...prev,
        safetyPriority: 65,
        lightPreference: true
      }));
    } else {
      setPreferences((prev) => ({
        ...prev,
        safetyPriority: 70
      }));
    }
  };

  const handleSwap = () => {
    const temp = originLocation;
    setOriginLocation(destLocation);
    setDestLocation(temp);
  };

  const handlePrefChange = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSelectGPSLocation = async () => {
    setIsLocatingGPS(true);
    try {
      const loc = await getCurrentUserLocation();
      const gpsObj = {
        id: 'user_gps',
        name: 'My Current Location (GPS)',
        category: `Current GPS (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})`,
        lat: loc.lat,
        lng: loc.lng,
        lightingIndex: 90
      };
      setOriginLocation(gpsObj);
    } catch (err) {
      alert('Could not retrieve GPS location. Please ensure location permissions are granted.');
    } finally {
      setIsLocatingGPS(false);
    }
  };

  const handleSelectPresetRoute = (preset) => {
    const orig = MUMBAI_LOCATIONS.find((l) => l.id === preset.originId) || {
      id: preset.originId,
      name: preset.title?.split('➔')[0]?.trim() || 'Origin',
      category: 'Mumbai Landmark',
      lat: 19.0657,
      lng: 72.8687,
      lightingIndex: 90
    };
    const dst = MUMBAI_LOCATIONS.find((l) => l.id === preset.destId) || {
      id: preset.destId,
      name: preset.title?.split('➔')[1]?.trim() || 'Destination',
      category: 'Mumbai Landmark',
      lat: 19.0178,
      lng: 72.8478,
      lightingIndex: 88
    };

    setOriginLocation(orig);
    setDestLocation(dst);
    if (preset.travelMode) setTravelMode(preset.travelMode);
    if (preset.commuterType?.includes('Female')) {
      handleProfileSelect('solo_female');
    }
    if (onRecalculate) onRecalculate();
  };

  const handleCalculateClick = () => {
    setIsCalculating(true);
    if (onRecalculate) onRecalculate();

    setTimeout(() => {
      setIsCalculating(false);
      const mapElem = document.getElementById('map-view-container');
      if (mapElem) {
        mapElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 500);
  };

  return (
    <div className="glass-panel p-5 lg:p-6 border border-white/10 shadow-2xl rounded-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wide">
            <Navigation className="w-4 h-4 text-cyan-400" />
            Night Journey Input & Parameters
          </h2>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            Search origin, destination & personal safety priorities
          </p>
        </div>
      </div>

      {/* Commuter Profile Preset Bar */}
      <div>
        <label className="text-[11px] font-bold text-slate-300 mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Commuter Profile Preset
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PROFILES.map((p) => {
            const isSelected = activeProfile === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleProfileSelect(p.id)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/15 border-cyan-400/50 text-cyan-200 shadow-md shadow-cyan-500/10'
                    : 'bg-[#060a14] border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">{p.icon}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <div className="text-[11px] font-bold text-white">{p.label}</div>
                <div className="text-[9px] text-slate-400 truncate">{p.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start Location, Swap Button, and Destination Search Inputs */}
      <div className="space-y-3 mb-4 relative bg-[#060a14] p-4 rounded-xl border border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Route Endpoints</span>
          <button
            type="button"
            onClick={handleSelectGPSLocation}
            disabled={isLocatingGPS}
            className="text-[10px] text-emerald-400 font-bold hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 cursor-pointer"
          >
            {isLocatingGPS ? (
              <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
            ) : (
              <Locate className="w-3 h-3 text-emerald-400" />
            )}
            <span>{isLocatingGPS ? 'Getting GPS...' : 'Use My GPS'}</span>
          </button>
        </div>

        {/* Start Location */}
        <LocationSearchInput
          label="Start Location (Origin)"
          value={originLocation}
          onChange={setOriginLocation}
          color="emerald"
          placeholder="Search any Mumbai street, building, station, or landmark..."
          excludeId={destLocation?.id}
        />

        {/* Swap Button */}
        <div className="flex justify-end -my-1 z-10 relative px-2">
          <button
            type="button"
            onClick={handleSwap}
            className="w-8 h-8 rounded-full bg-[#0d1527] border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
            title="Swap Origin & Destination"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Destination */}
        <LocationSearchInput
          label="Destination (Target)"
          value={destLocation}
          onChange={setDestLocation}
          color="cyan"
          placeholder="Search destination building, mall, or neighborhood..."
          excludeId={originLocation?.id}
        />
      </div>

      {/* Travel Mode & Time Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Travel Mode Selection */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 mb-1.5 block uppercase tracking-wider">
            Travel Mode
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {TRAVEL_MODES.map((mode) => {
              const Icon = mode.icon;
              const isSelected = travelMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setTravelMode(mode.id)}
                  className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                      : 'bg-[#060a14] border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="truncate">{mode.label}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-normal">{mode.etaBadge}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time of Night Selector */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Time of Night
          </label>
          <select
            value={nightTime}
            onChange={(e) => setNightTime(e.target.value)}
            className="w-full px-3 py-3 bg-[#060a14] border border-slate-700/60 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {NIGHT_TIMES.map((time, idx) => (
              <option key={idx} value={time}>
                {time}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">
            Streetlight illumination metrics dynamically update based on time.
          </p>
        </div>
      </div>

      {/* Preset Quick Corridors */}
      <div>
        <label className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center gap-1 uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Popular Commuter Corridors (Live)
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {popularCorridors.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPresetRoute(preset)}
              className="px-3 py-1.5 rounded-xl bg-[#060a14] hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 hover:border-cyan-400/40 cursor-pointer"
            >
              <span className="text-cyan-400 font-bold">➔</span>
              <span>{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Toggle for Fine-Tuning Preferences */}
      <div className="border-t border-white/10 pt-3">
        <button
          type="button"
          onClick={() => setShowPreferences(!showPreferences)}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white transition-colors py-1 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Fine-Tune Personal Safety Parameters
          </span>
          {showPreferences ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showPreferences && (
          <div className="mt-3 space-y-3 bg-[#060a14] p-4 rounded-xl border border-white/10 animate-fade-in">
            {/* Safety Weight Slider */}
            <div>
              <div className="flex justify-between text-[11px] font-bold mb-1.5">
                <span className="text-amber-400">⚡ Speed Priority</span>
                <span className="text-emerald-400">🛡️ Safety Weight: {preferences.safetyPriority}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={preferences.safetyPriority}
                onChange={(e) => handlePrefChange('safetyPriority', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Toggle Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handlePrefChange('lightPreference', !preferences.lightPreference)}
                className={`p-2.5 rounded-xl border text-[11px] font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  preferences.lightPreference
                    ? 'bg-amber-500/15 border-amber-400/50 text-amber-300'
                    : 'bg-[#080d1a] border-white/5 text-slate-400'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Lit Roads
                </span>
                <span className="font-bold">{preferences.lightPreference ? 'ON' : 'OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => handlePrefChange('preferPoliceChowkis', !preferences.preferPoliceChowkis)}
                className={`p-2.5 rounded-xl border text-[11px] font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  preferences.preferPoliceChowkis
                    ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300'
                    : 'bg-[#080d1a] border-white/5 text-slate-400'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" /> Police Beats
                </span>
                <span className="font-bold">{preferences.preferPoliceChowkis ? 'ON' : 'OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => handlePrefChange('avoidIsolated', !preferences.avoidIsolated)}
                className={`p-2.5 rounded-xl border text-[11px] font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  preferences.avoidIsolated
                    ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-300'
                    : 'bg-[#080d1a] border-white/5 text-slate-400'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5 text-cyan-400" /> Bypass Alleys
                </span>
                <span className="font-bold">{preferences.avoidIsolated ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recalculate Button */}
      <button
        type="button"
        onClick={handleCalculateClick}
        disabled={isCalculating}
        className="w-full py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-400/30 hover:brightness-110 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-75"
      >
        {isCalculating ? (
          <Loader2 className="w-4 h-4 text-slate-950 animate-spin" />
        ) : (
          <Navigation className="w-4 h-4 text-slate-950 fill-current" />
        )}
        <span>{isCalculating ? 'Computing Dijkstra Corridors...' : 'Calculate Optimal Safe Corridors'}</span>
      </button>
    </div>
  );
}
