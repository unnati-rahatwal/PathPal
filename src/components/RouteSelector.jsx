import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Car,
  Bike,
  Footprints,
  Bus,
  Zap,
  ArrowUpDown,
  Sliders,
  ChevronDown,
  ChevronUp,
  Sun,
  ShieldAlert,
  AlertOctagon,
  Clock,
  Plus,
  X,
  Search,
  CheckCircle2,
  Sparkles,
  Locate,
  Loader2
} from 'lucide-react';
import { MUMBAI_LOCATIONS, PRESET_ROUTES } from '../data/mumbaiData';
import { searchPlaces } from '../services/geocodingService';
import { getCurrentUserLocation } from '../services/locationService';

import { isSupabaseConfigured, supabase } from '../services/supabaseClient';

export default function RouteSelector({
  originId,
  setOriginId,
  destId,
  setDestId,
  viaId,
  setViaId,
  travelMode,
  setTravelMode,
  activeProfile,
  setActiveProfile,
  preferences,
  setPreferences,
  onSelectPreset,
  onRecalculate,
  customOrigin,
  setCustomOrigin,
  customDest,
  setCustomDest
}) {
  const [showPreferences, setShowPreferences] = useState(false);
  const [nightTime, setNightTime] = useState('12:00 AM');
  const [showViaStop, setShowViaStop] = useState(Boolean(viaId));
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');

  // Dynamic Popular Corridors State
  const [popularCorridors, setPopularCorridors] = useState(PRESET_ROUTES);

  // Fetch live popular routes from Supabase if table exists
  React.useEffect(() => {
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

  // Search autocomplete states
  const [originSearchText, setOriginSearchText] = useState('');
  const [destSearchText, setDestSearchText] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [isSearchingOrigin, setIsSearchingOrigin] = useState(false);
  const [isSearchingDest, setIsSearchingDest] = useState(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

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

  const CATEGORIES = ['All', 'Commercial Hub', 'Transit Hub', 'Nightlife & Tech', 'Waterfront', 'Airport'];

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

  const handleSwap = () => {
    const tempOrigin = customOrigin || MUMBAI_LOCATIONS.find((l) => l.id === originId);
    const tempDest = customDest || MUMBAI_LOCATIONS.find((l) => l.id === destId);

    if (setCustomOrigin && setCustomDest) {
      setCustomOrigin(tempDest);
      setCustomDest(tempOrigin);
    }
    const tempId = originId;
    setOriginId(destId);
    setDestId(tempId);
  };

  const handlePrefChange = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleOriginSearch = async (val) => {
    setOriginSearchText(val);
    if (val.trim().length >= 2) {
      setIsSearchingOrigin(true);
      const results = await searchPlaces(val);
      setOriginSuggestions(results);
      setIsSearchingOrigin(false);
    } else {
      setOriginSuggestions([]);
    }
  };

  const handleDestSearch = async (val) => {
    setDestSearchText(val);
    if (val.trim().length >= 2) {
      setIsSearchingDest(true);
      const results = await searchPlaces(val);
      setDestSuggestions(results);
      setIsSearchingDest(false);
    } else {
      setDestSuggestions([]);
    }
  };

  const handleSelectGPSLocation = async () => {
    setIsLocatingGPS(true);
    try {
      const loc = await getCurrentUserLocation();
      const gpsObj = {
        id: 'user_gps',
        name: 'My Current Location (GPS)',
        fullName: 'Current GPS Coordinates',
        lat: loc.lat,
        lng: loc.lng,
        lightingIndex: 90,
        crowdIndex: 85,
        policeDensity: 88
      };
      if (setCustomOrigin) setCustomOrigin(gpsObj);
      setOriginId('user_gps');
      setOriginSearchText('My Current Location (GPS)');
    } catch (err) {
      alert('Could not retrieve GPS location. Please ensure location permissions are granted.');
    } finally {
      setIsLocatingGPS(false);
    }
  };

  const filteredLocations = MUMBAI_LOCATIONS.filter((loc) => {
    if (activeCategoryFilter === 'All') return true;
    return loc.category.toLowerCase().includes(activeCategoryFilter.toLowerCase());
  });

  return (
    <div className="glass-panel p-5 lg:p-6 border border-white/10 shadow-2xl rounded-2xl space-y-5">
      {/* Header & Commuter Profile Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wide">
            <Navigation className="w-4 h-4 text-cyan-400" />
            Night Journey Input & Parameters
          </h2>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            Select origin, destination & personal safety priorities
          </p>
        </div>

        {/* Category filter pills */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all whitespace-nowrap ${activeCategoryFilter === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                  : 'text-slate-400 hover:text-slate-200 bg-white/5'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Commuter Profile Selector Bar */}
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
                onClick={() => setActiveProfile(p.id)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${isSelected
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

      {/* Start Location, Optional Via Stop, and Destination Search Inputs */}
      <div className="space-y-3 relative bg-[#060a14] p-4 rounded-xl border border-white/5">
        {/* Start Location (Origin) */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_#10B981]" />
              Start Location (Origin)
            </label>
            <button
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

          <div className="relative">
            <MapPin className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Search address worldwide (e.g. Bandra, Dadar)..."
              value={originSearchText}
              onChange={(e) => handleOriginSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 mb-1.5 bg-[#080d1b] border border-slate-700/60 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-cyan-400 shadow-inner"
            />

            {/* Nominatim Search Suggestions Dropdown */}
            {originSuggestions.length > 0 && (
              <div className="absolute z-50 left-0 right-0 bg-[#090e1d] border border-cyan-500/30 rounded-xl shadow-2xl max-h-48 overflow-y-auto mt-1 p-1">
                {originSuggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (setCustomOrigin) setCustomOrigin(item);
                      setOriginId(item.id);
                      setOriginSearchText(item.name);
                      setOriginSuggestions([]);
                    }}
                    className="w-full text-left p-2 hover:bg-cyan-500/20 rounded-lg text-xs text-slate-200 font-medium flex items-start gap-2 border-b border-white/5 last:border-none"
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{item.fullName}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <select
              value={originId}
              onChange={(e) => {
                setOriginId(e.target.value);
                if (setCustomOrigin) setCustomOrigin(null);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-[#080d1b] border border-slate-700/60 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-cyan-400 transition-all cursor-pointer shadow-inner"
            >
              {customOrigin && <option value={customOrigin.id}>📍 {customOrigin.name}</option>}
              {filteredLocations.map((loc) => (
                <option key={loc.id} value={loc.id} disabled={loc.id === destId || loc.id === viaId}>
                  {loc.name} — {loc.category} (Lighting: {loc.lightingIndex}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button Floating Center */}
        <div className="flex justify-between items-center -my-1 z-10 relative px-2">
          {!showViaStop ? (
            <button
              onClick={() => setShowViaStop(true)}
              className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 py-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Via Stop (Safe Haven / Interchange)
            </button>
          ) : (
            <span />
          )}

          <button
            onClick={handleSwap}
            className="w-8 h-8 rounded-full bg-[#0d1527] border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
            title="Swap Origin & Destination"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Destination (Target) */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_#00F0FF]" />
              Destination (Target)
            </label>
            <span className="text-[10px] text-cyan-400 font-bold">Pick Point B</span>
          </div>

          <div className="relative">
            <MapPin className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3.5 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Search destination worldwide (e.g. Airport, CST)..."
              value={destSearchText}
              onChange={(e) => handleDestSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 mb-1.5 bg-[#080d1b] border border-slate-700/60 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-cyan-400 shadow-inner"
            />

            {/* Nominatim Search Suggestions Dropdown */}
            {destSuggestions.length > 0 && (
              <div className="absolute z-50 left-0 right-0 bg-[#090e1d] border border-cyan-500/30 rounded-xl shadow-2xl max-h-48 overflow-y-auto mt-1 p-1">
                {destSuggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (setCustomDest) setCustomDest(item);
                      setDestId(item.id);
                      setDestSearchText(item.name);
                      setDestSuggestions([]);
                    }}
                    className="w-full text-left p-2 hover:bg-cyan-500/20 rounded-lg text-xs text-slate-200 font-medium flex items-start gap-2 border-b border-white/5 last:border-none"
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-white">{item.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{item.fullName}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <select
              value={destId}
              onChange={(e) => {
                setDestId(e.target.value);
                if (setCustomDest) setCustomDest(null);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-[#080d1b] border border-slate-700/60 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-cyan-400 transition-all cursor-pointer shadow-inner"
            >
              {customDest && <option value={customDest.id}>📍 {customDest.name}</option>}
              {filteredLocations.map((loc) => (
                <option key={loc.id} value={loc.id} disabled={loc.id === originId || loc.id === viaId}>
                  {loc.name} — {loc.category} (Lighting: {loc.lightingIndex}%)
                </option>
              ))}
            </select>
          </div>
        </div>
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
                  onClick={() => setTravelMode(mode.id)}
                  className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all ${isSelected
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
              onClick={() => onSelectPreset(preset)}
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
                onClick={() => handlePrefChange('lightPreference', !preferences.lightPreference)}
                className={`p-2.5 rounded-xl border text-[11px] font-semibold flex items-center justify-between transition-all cursor-pointer ${preferences.lightPreference
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
                onClick={() => handlePrefChange('preferPoliceChowkis', !preferences.preferPoliceChowkis)}
                className={`p-2.5 rounded-xl border text-[11px] font-semibold flex items-center justify-between transition-all cursor-pointer ${preferences.preferPoliceChowkis
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
                onClick={() => handlePrefChange('avoidIsolated', !preferences.avoidIsolated)}
                className={`p-2.5 rounded-xl border text-[11px] font-semibold flex items-center justify-between transition-all cursor-pointer ${preferences.avoidIsolated
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
