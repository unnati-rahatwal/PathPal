import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X, Loader2, Sparkles, Navigation2 } from 'lucide-react';
import { MUMBAI_LOCATIONS } from '../data/mumbaiData';
import { searchAddresses } from '../services/apiService';

export default function LocationSearchInput({
  label,
  value,
  onChange,
  color = 'emerald', // 'emerald' or 'cyan'
  placeholder = 'Search address, locality, or landmark in Mumbai...',
  excludeId = null
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nominatimResults, setNominatimResults] = useState([]);
  const containerRef = useRef(null);

  // Sync input text when value changes from outside (e.g. Preset button or Swap)
  useEffect(() => {
    if (value) {
      if (typeof value === 'object' && value.name) {
        setQuery(value.name);
      } else if (typeof value === 'string') {
        const found = MUMBAI_LOCATIONS.find((l) => l.id === value);
        if (found) setQuery(found.name);
      }
    }
  }, [value]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter local landmarks immediately
  const localMatches = query.trim()
    ? MUMBAI_LOCATIONS.filter(
        (loc) =>
          loc.id !== excludeId &&
          (loc.name.toLowerCase().includes(query.toLowerCase()) ||
            loc.category.toLowerCase().includes(query.toLowerCase()))
      )
    : MUMBAI_LOCATIONS.filter((loc) => loc.id !== excludeId).slice(0, 6);

  // Debounced search for OSM Nominatim geocoding
  useEffect(() => {
    if (!isOpen || query.trim().length < 2) {
      setNominatimResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchAddresses(query);
        // Exclude results identical to excludeId if known
        setNominatimResults(results);
      } catch (err) {
        console.warn('Geocoding error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleSelect = (loc) => {
    onChange(loc);
    setQuery(loc.name);
    setIsOpen(false);
  };

  const isEmerald = color === 'emerald';
  const dotBg = isEmerald ? 'bg-emerald-400' : 'bg-cyan-400';
  const dotShadow = isEmerald ? 'shadow-[0_0_6px_#10B981]' : 'shadow-[0_0_6px_#00F0FF]';
  const iconColor = isEmerald ? 'text-emerald-400' : 'text-cyan-400';
  const focusRing = isEmerald ? 'focus:border-emerald-400 focus:ring-emerald-400/40' : 'focus:border-cyan-400 focus:ring-cyan-400/40';

  return (
    <div className="relative" ref={containerRef}>
      <label className="text-[11px] font-bold text-slate-300 mb-1 flex items-center justify-between uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${dotBg} inline-block ${dotShadow}`} />
          {label}
        </span>
        {isLoading && (
          <span className="text-[10px] text-cyan-400 flex items-center gap-1 font-mono lowercase">
            <Loader2 className="w-2.5 h-2.5 animate-spin" />
            searching OSM...
          </span>
        )}
      </label>

      <div className="relative">
        <MapPin className={`w-4 h-4 ${iconColor} absolute left-3.5 top-3.5 pointer-events-none`} />
        
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className={`w-full pl-10 pr-9 py-2.5 bg-[#060a14] border border-slate-700/60 rounded-xl text-xs font-bold text-white placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:ring-1 ${focusRing} transition-all shadow-inner`}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(true);
            }}
            className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#090e1c] border border-cyan-500/30 rounded-xl shadow-2xl z-[1500] max-h-72 overflow-y-auto divide-y divide-white/5 backdrop-blur-xl">
          {/* Quick curated landmarks */}
          {localMatches.length > 0 && (
            <div className="p-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Curated Night Corridors & Hubs</span>
              </div>
              {localMatches.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelect(loc)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 flex items-center justify-between transition-colors group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                      {loc.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {loc.category} • Safety {loc.lightingIndex}%
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 shrink-0 border border-cyan-500/20">
                    Preset
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* OpenStreetMap Nominatim Live Geocoding Results */}
          {nominatimResults.length > 0 && (
            <div className="p-2 bg-[#060a14]/60">
              <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1">
                <Navigation2 className="w-3 h-3 text-cyan-400" />
                <span>Live OpenStreetMap Matches ({nominatimResults.length})</span>
              </div>
              {nominatimResults.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelect(loc)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-cyan-500/10 flex items-center justify-between transition-colors group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-bold text-cyan-100 group-hover:text-cyan-300 truncate">
                      {loc.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {loc.category}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 shrink-0 font-bold">
                    OSM
                  </span>
                </button>
              ))}
            </div>
          )}

          {localMatches.length === 0 && nominatimResults.length === 0 && !isLoading && (
            <div className="py-4 text-center text-xs text-slate-400">
              No matching address found in Mumbai. Try entering a nearby junction or road name.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
