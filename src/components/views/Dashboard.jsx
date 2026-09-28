import React, { useState } from 'react';
import {
  User,
  Shield,
  MapPin,
  Clock,
  Navigation,
  CheckCircle2,
  Calendar,
  Share2,
  ArrowRight,
  TrendingUp,
  Star
} from 'lucide-react';

export default function Dashboard({ onLaunchPlanner, onSelectSavedRoute }) {
  const [activeTab, setActiveTab] = useState('overview');

  const savedRoutes = [
    {
      id: 'saved_1',
      title: 'Bandra West ➔ BKC Commercial Hub',
      safetyScore: 94,
      distanceKm: 8.4,
      lighting: '98%',
      origin: { name: 'Bandra West (Linking Road)', lat: 19.0596, lng: 72.8295 },
      dest: { name: 'BKC Financial Center', lat: 19.0688, lng: 72.8703 }
    },
    {
      id: 'saved_2',
      title: 'Dadar Station ➔ Lower Parel Hub',
      safetyScore: 91,
      distanceKm: 4.2,
      lighting: '92%',
      origin: { name: 'Dadar Station West', lat: 19.0178, lng: 72.8478 },
      dest: { name: 'High Street Phoenix Lower Parel', lat: 19.0006, lng: 72.8301 }
    }
  ];

  return (
    <div className="min-h-screen text-[#e6f9af] pt-20 pb-20 bg-[#0d0630]">
      {/* ── HEADER ── */}
      <section className="bg-[#18314f] border-b border-[#8bbeb2]/15 px-6 lg:px-16 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#384e77] border-2 border-[#8bbeb2]/40 flex items-center justify-center text-2xl font-bold text-[#e6f9af]">
              👩
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className="text-2xl font-bold text-[#e6f9af]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Namya Puthran
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e6f9af]/10 text-[#e6f9af] border border-[#e6f9af]/20 font-bold">
                  Verified Night Commuter
                </span>
              </div>
              <p className="text-xs text-[#8bbeb2]/70 mt-0.5">
                Mumbai Western & Central Line Night Traveler • 8 Months Active
              </p>
            </div>
          </div>

          <button
            onClick={onLaunchPlanner}
            className="px-5 py-2.5 rounded-full bg-[#e6f9af] hover:bg-[#8bbeb2] text-[#0d0630] font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>Plan New Route</span>
            <Navigation className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-10 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#18314f]/70 border border-[#8bbeb2]/15 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#8bbeb2]/60">Night Distance Traveled</span>
            <div className="font-serif text-3xl font-black text-[#e6f9af]">184 km</div>
            <span className="text-[11px] text-[#8bbeb2]/80">Across 22 late-night journeys</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#18314f]/70 border border-[#8bbeb2]/15 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#8bbeb2]/60">Average Safety Score</span>
            <div className="font-serif text-3xl font-black text-[#8bbeb2]">93.4</div>
            <span className="text-[11px] text-emerald-400">Top 5% safest routing compliance</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#18314f]/70 border border-[#8bbeb2]/15 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#8bbeb2]/60">24/7 Safe Havens Passed</span>
            <div className="font-serif text-3xl font-black text-[#e6f9af]">48</div>
            <span className="text-[11px] text-[#8bbeb2]/80">Police chowkis & open pharmacies</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#18314f]/70 border border-[#8bbeb2]/15 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#8bbeb2]/60">Dark Alleys Avoided</span>
            <div className="font-serif text-3xl font-black text-[#e6f9af]">19</div>
            <span className="text-[11px] text-[#8bbeb2]/80">Dijkstra algorithm re-routes</span>
          </div>
        </div>

        {/* ── SAVED NIGHT ROUTES ── */}
        <div className="bg-[#18314f]/60 border border-[#8bbeb2]/20 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#8bbeb2]/15 pb-4">
            <div>
              <span className="text-xs font-bold text-[#8bbeb2] uppercase tracking-widest">Personal Bookmarks</span>
              <h2
                className="text-2xl font-bold text-[#e6f9af]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Saved Night Routes
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedRoutes.map((sr) => (
              <div
                key={sr.id}
                className="p-5 rounded-2xl bg-[#0d0630]/70 border border-[#8bbeb2]/20 hover:border-[#8bbeb2]/50 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-black text-[#e6f9af] bg-[#18314f] px-2.5 py-0.5 rounded-full border border-[#8bbeb2]/30">
                    {sr.safetyScore}/100 Safe
                  </span>
                  <span className="text-[11px] text-[#8bbeb2]/70 font-mono">
                    {sr.distanceKm} km • {sr.lighting} Lit
                  </span>
                </div>

                <h3 className="font-serif text-base font-bold text-[#e6f9af]">{sr.title}</h3>
                <div className="text-[11px] text-[#8bbeb2]/70 space-y-0.5">
                  <div>From: {sr.origin.name}</div>
                  <div>To: {sr.dest.name}</div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectSavedRoute && onSelectSavedRoute(sr)}
                  className="w-full py-2.5 rounded-xl bg-[#e6f9af] hover:bg-[#8bbeb2] text-[#0d0630] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                >
                  <span>Launch in Planner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
