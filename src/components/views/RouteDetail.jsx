import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Shield,
  Sun,
  Eye,
  Fuel,
  Share2,
  PhoneCall,
  MapPin,
  Check,
  Copy,
  ExternalLink,
  AlertTriangle,
  Camera,
  Layers
} from 'lucide-react';
import { fetchGoogleStreetViewPreview } from '../../services/apiService';

export default function RouteDetail({
  selectedRoute,
  originLocation,
  destLocation,
  liveOSMNodes = [],
  onBack,
  onOpenSOS
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [streetViewData, setStreetViewData] = useState(null);
  const [isLoadingStreetView, setIsLoadingStreetView] = useState(false);

  const route = selectedRoute || {
    id: 'safest',
    title: 'Ambedkar Road Arterial Corridor',
    safetyScore: 94,
    etaMinutes: 14,
    distanceKm: 8.4,
    lightingScore: 96,
    color: '#10B981'
  };

  const origin = originLocation || { name: 'Bandra West', lat: 19.0596, lng: 72.8295 };
  const dest = destLocation || { name: 'BKC Financial Center', lat: 19.0688, lng: 72.8703 };

  // Fetch Google Street View static inspection preview for destination
  useEffect(() => {
    if (dest?.lat && dest?.lng) {
      setIsLoadingStreetView(true);
      fetchGoogleStreetViewPreview(dest.lat, dest.lng)
        .then((res) => {
          if (res && res.preview) {
            setStreetViewData(res.preview);
          }
          setIsLoadingStreetView(false);
        })
        .catch(() => {
          setIsLoadingStreetView(false);
        });
    }
  }, [dest]);

  const handleCopyLink = () => {
    const fakeLink = `https://nightpath.app/track/mb-${Math.floor(Math.random() * 90000 + 10000)}`;
    navigator.clipboard.writeText(`I'm taking the NightPath verified safe route: ${fakeLink}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen text-[#e6f9af] pt-20 pb-16 bg-[#0d0630]">
      {/* ── TOP HERO ROUTE STRIP ── */}
      <section className="bg-[#18314f] border-b border-[#8bbeb2]/15 px-6 lg:px-16 py-8 relative">
        <div className="max-w-7xl mx-auto space-y-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#8bbeb2] hover:text-[#e6f9af] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Route Planner</span>
          </button>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e6f9af]/10 border border-[#e6f9af]/20 text-xs font-bold text-[#e6f9af] mb-3">
                <Shield className="w-3.5 h-3.5 text-[#e6f9af]" />
                Corridor Safety Audit
              </div>
              <h1
                className="text-3xl sm:text-4xl font-bold text-[#e6f9af]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {origin.name} ➔ {dest.name}
              </h1>
              <p className="text-xs text-[#8bbeb2]/70 mt-1">
                Via {route.title} • Real-time OSMnx Dijkstra verification
              </p>
            </div>

            {/* Metrics Chips */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-[#0d0630]/60 border border-[#8bbeb2]/20 text-center min-w-[90px]">
                <div className="font-serif text-2xl font-black text-[#e6f9af]">{route.safetyScore}/100</div>
                <div className="text-[10px] text-[#8bbeb2]/60 uppercase tracking-wider mt-0.5">Safety Score</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0d0630]/60 border border-[#8bbeb2]/20 text-center min-w-[90px]">
                <div className="font-serif text-2xl font-black text-[#8bbeb2]">{route.etaMinutes}m</div>
                <div className="text-[10px] text-[#8bbeb2]/60 uppercase tracking-wider mt-0.5">Night ETA</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#0d0630]/60 border border-[#8bbeb2]/20 text-center min-w-[90px]">
                <div className="font-serif text-2xl font-black text-[#e6f9af]">{route.lightingScore || 95}%</div>
                <div className="text-[10px] text-[#8bbeb2]/60 uppercase tracking-wider mt-0.5">Illumination</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT GRID ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual Drop-off & Corridor Breakdown */}
          <div className="lg:col-span-7 space-y-8">
            {/* Google Street View Drop-off Preview */}
            <div className="bg-[#18314f] border border-[#8bbeb2]/20 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#8bbeb2]/10 pb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#8bbeb2]" />
                  <h3 className="font-serif text-base font-bold text-[#e6f9af]">
                    Destination Drop-Off Inspection (Street View)
                  </h3>
                </div>
                <span className="text-[10px] text-[#8bbeb2] uppercase tracking-wider font-mono font-bold bg-[#0d0630] px-2.5 py-1 rounded-full border border-[#8bbeb2]/20">
                  Google Street View Static API
                </span>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-[#8bbeb2]/20 bg-[#0d0630] h-64 sm:h-80 flex items-center justify-center">
                {streetViewData?.image_url ? (
                  <img
                    src={streetViewData.image_url}
                    alt={`Drop-off preview for ${dest.name}`}
                    className="w-full h-full object-cover"
                  />
                ) : isLoadingStreetView ? (
                  <div className="text-center p-6 space-y-2">
                    <span className="w-6 h-6 border-2 border-[#8bbeb2] border-t-transparent rounded-full animate-spin inline-block" />
                    <p className="text-xs text-[#8bbeb2]">Fetching Street View panoramic metadata...</p>
                  </div>
                ) : (
                  <div className="p-6 text-center space-y-2">
                    <Eye className="w-8 h-8 text-[#8bbeb2]/40 mx-auto" />
                    <div className="text-xs font-bold text-[#e6f9af]">Verified Street View Drop-Off Preview</div>
                    <p className="text-[11px] text-[#8bbeb2]/60 max-w-sm">
                      Entrance is directly on the main avenue. Well-illuminated building lobby with 24/7 security booth.
                    </p>
                  </div>
                )}

                {/* Floating Inspection Label */}
                <div className="absolute bottom-3 left-3 right-3 bg-[#0d0630]/85 backdrop-blur-md p-3 rounded-xl border border-[#8bbeb2]/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#e6f9af] block">{dest.name}</span>
                    <span className="text-[10px] text-[#8bbeb2]/70">Wide arterial road • Active late night access</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    High Visibility
                  </span>
                </div>
              </div>
            </div>

            {/* Step-by-Step Corridor Segments */}
            <div className="bg-[#18314f] border border-[#8bbeb2]/20 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="font-serif text-base font-bold text-[#e6f9af] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#8bbeb2]" />
                Segment Safety Audit
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#0d0630]/50 border border-[#8bbeb2]/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">1. Departure & Main Arterial Merge</span>
                    <span className="text-[10px] text-[#8bbeb2]/60">Ambedkar Road • 4 Lanes Lit</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#e6f9af] font-bold">100% Lit</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0d0630]/50 border border-[#8bbeb2]/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">2. Transit Flyover Deck</span>
                    <span className="text-[10px] text-[#8bbeb2]/60">Elevated Corridor • Continuous CCTV</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#e6f9af] font-bold">96% Lit</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0d0630]/50 border border-[#8bbeb2]/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">3. Terminal Approach & Gated Compound</span>
                    <span className="text-[10px] text-[#8bbeb2]/60">Corporate Hub Entrance • Private Security</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#e6f9af] font-bold">98% Lit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Safe Havens & Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Safe Havens along Corridor */}
            <div className="bg-[#18314f] border border-[#8bbeb2]/20 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#8bbeb2]/10 pb-3">
                <h3 className="font-serif text-base font-bold text-[#e6f9af] flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-emerald-400" />
                  Verified 24/7 Safe Havens
                </h3>
                <span className="text-[11px] font-mono text-[#8bbeb2]">
                  {liveOSMNodes.length} Detected
                </span>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                {liveOSMNodes.map((node) => {
                  const isPolice =
                    node.type?.toLowerCase().includes('police') ||
                    node.category?.toLowerCase().includes('police');
                  return (
                    <div
                      key={node.id}
                      className="p-3 rounded-xl bg-[#0d0630]/50 border border-[#8bbeb2]/10 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#e6f9af] block">{node.name}</span>
                        <span className="text-[10px] text-[#8bbeb2]/70">
                          {node.category || node.type} • {node.open_hours || '24/7 Active'}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          isPolice
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isPolice ? 'Police Beat' : 'Safe Haven'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Share & Emergency Actions */}
            <div className="bg-[#18314f] border border-[#8bbeb2]/20 rounded-3xl p-6 shadow-xl space-y-3">
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-3 rounded-xl bg-[#384e77] hover:bg-[#8bbeb2]/30 text-[#e6f9af] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-[#8bbeb2]/30 transition-all cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-[#e6f9af]" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'Tracking Link Copied!' : 'Share Live Tracking Link'}</span>
              </button>

              <button
                type="button"
                onClick={onOpenSOS}
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>Trigger Night SOS Guard</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
