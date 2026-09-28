import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  PhoneCall,
  Shield,
  Sun,
  Camera,
  CheckCircle2,
  Users,
  Globe,
  ArrowRight
} from 'lucide-react';

export default function TouristMode({ onLaunchPlanner, onOpenSOS }) {
  const [arrivalHub, setArrivalHub] = useState('airport_t2');
  const [hotelDestination, setHotelDestination] = useState('');
  const [companionType, setCompanionType] = useState('solo_female');

  const itineraries = [
    {
      title: 'Marine Drive & Queen’s Necklace',
      time: '9:00 PM – 1:00 AM',
      safetyScore: 98,
      desc: 'High-footfall seaside boulevard with continuous street lighting, active police vans, and open cafes.',
      highlights: ['Wide lighted promenade', 'Tourist Police Beat', 'NCPA to Chowpatty']
    },
    {
      title: 'Bandra Bandstand & Coastal Fort',
      time: '8:30 PM – 11:30 PM',
      safetyScore: 92,
      desc: 'Vibrant seafront strip near Taj Lands End with regular security patrols and hotel-adjacent lighting.',
      highlights: ['Open QSRs & coffee shops', 'Private hotel security', 'Well-patrolled link roads']
    },
    {
      title: 'Colaba Heritage & Gateway of India',
      time: '8:00 PM – 11:00 PM',
      safetyScore: 94,
      desc: 'Colaba Causeway shopping avenue and iconic waterfront illuminated by Taj Mahal Palace security.',
      highlights: ['CISF & Mumbai Police Presence', 'Active restaurants', 'Taxi stands']
    }
  ];

  return (
    <div className="min-h-screen text-[#e6f9af] pt-20 pb-20 bg-[#0d0630]">
      {/* ── HERO & ARRIVAL CARD ── */}
      <section className="bg-[#18314f] border-b border-[#8bbeb2]/15 px-6 lg:px-16 py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d0630]/60 border border-[#8bbeb2]/25 text-xs font-semibold text-[#8bbeb2] uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-[#e6f9af]" />
              Tourist Safe Navigator
            </div>

            <h1
              className="text-3xl sm:text-5xl font-bold text-[#e6f9af] leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Discover the City After Dark, <em className="text-[#8bbeb2] italic font-normal">Confidently</em>.
            </h1>

            <p className="text-sm sm:text-base text-[#8bbeb2]/80 font-light leading-relaxed max-w-xl">
              Visiting Mumbai? NightPath filters out quiet, unlit lanes and keeps you on high-visibility tourist
              thoroughfares with direct access to tourist police chowkis and English-speaking emergency helplines.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[11px] px-3 py-1 rounded-full bg-[#0d0630]/50 border border-[#8bbeb2]/15 text-[#8bbeb2]">
                ✓ Pre-Paid Airport Taxi Sync
              </span>
              <span className="text-[11px] px-3 py-1 rounded-full bg-[#0d0630]/50 border border-[#8bbeb2]/15 text-[#8bbeb2]">
                ✓ Hotel Drop-off Inspection
              </span>
              <span className="text-[11px] px-3 py-1 rounded-full bg-[#0d0630]/50 border border-[#8bbeb2]/15 text-[#8bbeb2]">
                ✓ Multi-lingual Emergency Desk
              </span>
            </div>
          </div>

          {/* Registration Card */}
          <div className="lg:col-span-5 bg-[#0d0630]/80 backdrop-blur-xl border border-[#8bbeb2]/25 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#e6f9af]">Arrival Corridor Registration</h3>
            <p className="text-xs text-[#8bbeb2]/70 font-light">
              Select your transit arrival point to calculate a verified lighted route to your hotel.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8bbeb2]/70 block mb-1">Arrival Hub</label>
                <select
                  value={arrivalHub}
                  onChange={(e) => setArrivalHub(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#18314f] border border-[#8bbeb2]/20 text-xs font-bold text-[#e6f9af] focus:outline-none"
                >
                  <option value="airport_t2">Mumbai Airport (T2 International / Domestic)</option>
                  <option value="cst_stn">Chhatrapati Shivaji Maharaj Terminus (CSMT)</option>
                  <option value="mumbai_central">Mumbai Central Railway Station</option>
                  <option value="cruise_terminal">Mumbai International Cruise Terminal</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8bbeb2]/70 block mb-1">Hotel / Stay Address</label>
                <input
                  type="text"
                  value={hotelDestination}
                  onChange={(e) => setHotelDestination(e.target.value)}
                  placeholder="e.g. Taj Lands End, Trident Nariman Point, Hyatt..."
                  className="w-full p-2.5 rounded-xl bg-[#18314f] border border-[#8bbeb2]/20 text-xs font-bold text-white placeholder:text-[#8bbeb2]/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8bbeb2]/70 block mb-1">Companion Type</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setCompanionType('solo_female')}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                      companionType === 'solo_female'
                        ? 'bg-[#8bbeb2]/20 border-[#e6f9af] text-[#e6f9af] font-bold'
                        : 'bg-[#18314f]/50 border-white/5 text-[#8bbeb2]/70'
                    }`}
                  >
                    👩 Solo Traveler
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompanionType('group')}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                      companionType === 'group'
                        ? 'bg-[#8bbeb2]/20 border-[#e6f9af] text-[#e6f9af] font-bold'
                        : 'bg-[#18314f]/50 border-white/5 text-[#8bbeb2]/70'
                    }`}
                  >
                    👨‍👩‍👧 Family / Couple
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={onLaunchPlanner}
                className="w-full py-3 rounded-xl bg-[#e6f9af] hover:bg-[#8bbeb2] text-[#0d0630] font-black text-xs uppercase tracking-wider transition-all shadow-md mt-2 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Generate Verified Tourist Route</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CURATED ITINERARIES ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-16 space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#8bbeb2] uppercase tracking-widest">
            Verified Night Safe Corridors
          </span>
          <h2
            className="text-3xl font-bold text-[#e6f9af]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Recommended Night Walks & Excursions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {itineraries.map((it, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#18314f]/70 border border-[#8bbeb2]/20 hover:border-[#8bbeb2]/50 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#8bbeb2] font-bold">⏱️ {it.time}</span>
                <span className="text-xs font-serif font-black text-[#e6f9af] bg-[#0d0630] px-2 py-0.5 rounded-full border border-[#8bbeb2]/30">
                  {it.safetyScore}/100
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#e6f9af]">{it.title}</h3>
              <p className="text-xs text-[#8bbeb2]/75 font-light leading-relaxed">{it.desc}</p>
              <div className="pt-2 border-t border-[#8bbeb2]/10 space-y-1">
                {it.highlights.map((h, i) => (
                  <div key={i} className="text-[11px] text-[#8bbeb2] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#e6f9af] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EMERGENCY DIRECTORY ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 pb-8">
        <div className="p-6 rounded-3xl bg-[#18314f]/50 border border-red-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-red-300 flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-red-400" />
              Direct Tourist Police & Embassy Contacts
            </h3>
            <p className="text-xs text-[#8bbeb2]/80">
              Toll-free 24/7 dedicated Tourist Assistance Desk: Dial <strong>112</strong> or <strong>103</strong>.
            </p>
          </div>
          <button
            onClick={onOpenSOS}
            className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0"
          >
            Open Tourist SOS Guard
          </button>
        </div>
      </section>
    </div>
  );
}
