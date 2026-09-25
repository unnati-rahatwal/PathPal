import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X, Loader2, Sparkles, Navigation2, Building2 } from 'lucide-react';
import { searchAddresses } from '../services/apiService';

export default function LocationSearchInput({
  label,
  value,
  onChange,
  color = 'emerald', // 'emerald' or 'cyan'
  placeholder = 'Search any building, society, landmark, or street in Mumbai...',
  excludeId = null
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const containerRef = useRef(null);

  // Sync input text when value changes from outside (e.g. preset or swap)
  useEffect(() => {
    if (value) {
      if (typeof value === 'object' && value.name) {
        setQuery(value.name);
      } else if (typeof value === 'string') {
        setQuery(value);
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

  // Debounced live search (Google Places & OSM Nominatim)
  useEffect(() => {
    if (!isOpen || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await searchAddresses(query);
        setResults(res.filter((r) => r.id !== excludeId));
      } catch (err) {
        console.warn('Location search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query, isOpen, excludeId]);

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
            searching places...
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
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#090e1c] border border-cyan-500/30 rounded-xl shadow-2xl z-[1500] max-h-72 overflow-y-auto divide-y divide-white/5 backdrop-blur-xl animate-fade-in">
          {results.length > 0 ? (
            <div className="p-2 space-y-1">
              {results.map((loc) => {
                const isGoogle = loc.source === 'google_places';
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelect(loc)}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-cyan-500/10 flex items-center justify-between transition-colors group"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 truncate flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{loc.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate pl-5">
                        {loc.category}
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold shrink-0 ${
                        isGoogle
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {isGoogle ? 'Google' : 'OSM'}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : isLoading ? (
            <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Searching Mumbai buildings & addresses...</span>
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-slate-400">
              No matching address found. Try entering a nearby road, station, or landmark.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
