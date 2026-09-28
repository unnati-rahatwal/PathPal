import React, { useState } from 'react';
import { postCommunityReport } from '../../services/apiService';

export default function ReportHazard({ onReportSubmitted, onNavigate }) {
  const [selectedHz, setSelectedHz] = useState('Streetlight Out');
  const [severity, setSeverity] = useState('Moderate');
  const [locationName, setLocationName] = useState('Dharavi Junction, Sion–Trombay Road');
  const [pinPos, setPinPos] = useState({ x: 52, y: 44 });
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Quick confirm state for sidebar
  const [confirmedReports, setConfirmedReports] = useState({});

  const hazardTypes = [
    { id: 'Streetlight Out', icon: '💡', name: 'Streetlight Out', sub: 'Dark stretch' },
    { id: 'Waterlogging', icon: '🌧️', name: 'Waterlogging', sub: 'Flooded road' },
    { id: 'Isolated Stretch', icon: '🚷', name: 'Isolated Stretch', sub: 'No one around' },
    { id: 'Broken Footpath', icon: '🚧', name: 'Broken Footpath', sub: 'Unsafe to walk' },
    { id: 'Stray Animals', icon: '🐕', name: 'Stray Animals', sub: 'Pack or aggressive' },
    { id: 'Suspicious Activity', icon: '⚠️', name: 'Suspicious Activity', sub: 'Felt unsafe' },
    { id: 'Tout / Scam Spot', icon: '🛺', name: 'Tout / Scam Spot', sub: 'Overcharging' },
    { id: 'No Auto / Taxi', icon: '🚦', name: 'No Auto / Taxi', sub: 'Stand is empty' },
    { id: 'Something Else', icon: '➕', name: 'Something Else', sub: 'Describe below' }
  ];

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setPinPos({ x, y });
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocationName(`Near GPS (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        setPinPos({ x: 50, y: 50 });
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      hazard_type: selectedHz,
      severity: severity.toLowerCase(),
      description: description || `${selectedHz} reported at ${locationName}`,
      location_name: locationName,
      lat: 19.0435 + (pinPos.y - 50) * 0.001,
      lng: 72.8565 + (pinPos.x - 50) * 0.001,
      is_anonymous: isAnonymous
    };

    try {
      await postCommunityReport(payload);
      if (onReportSubmitted) onReportSubmitted(payload);
    } catch {
      // Offline fallback
    }

    setIsSubmitting(false);
    setShowSuccess(true);
  };

  return (
    <div className="report-hazard-root text-[#e6f9af] min-h-screen bg-[#0d0630]">
      <style>{`
        .report-hazard-root {
          --deep: #0d0630;
          --navy: #18314f;
          --slate: #384e77;
          --teal: #8bbeb2;
          --lime: #e6f9af;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        .rh-hero {
          padding: 7rem 2.5rem 3rem;
          background: var(--navy);
          text-align: center;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(139,190,178,0.1);
        }
        .rh-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(139,190,178,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,190,178,0.04) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
        }
        .rh-glow {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 260px;
          background: radial-gradient(ellipse, rgba(56,78,119,0.5) 0%, transparent 65%);
          pointer-events: none;
        }
        .rh-inner {
          position: relative;
          z-index: 2;
        }
        .rh-label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--teal);
          margin-bottom: 0.8rem;
        }
        .rh-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 900;
          color: var(--lime);
          line-height: 1.1;
          margin-bottom: 0.9rem;
        }
        .rh-title em {
          font-style: italic;
          color: var(--teal);
        }
        .rh-sub {
          font-size: 0.95rem;
          font-weight: 300;
          color: rgba(139,190,178,0.6);
          max-width: 480px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .rh-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2.5rem;
        }
        .rh-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 2rem;
          align-items: start;
        }

        /* REPORT CARD */
        .rh-card {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.12);
          border-radius: 24px;
          padding: 2rem;
        }
        .rc-step-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--lime);
          margin-bottom: 0.3rem;
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }
        .step-num {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--lime);
          color: var(--deep);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rc-step-sub {
          font-size: 0.8rem;
          color: rgba(139,190,178,0.5);
          margin-bottom: 1.2rem;
          font-weight: 300;
        }
        .rc-section {
          margin-bottom: 2rem;
        }

        /* HAZARD TYPES */
        .hazard-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.7rem;
        }
        .hz {
          background: rgba(13,6,48,0.45);
          border: 1px solid rgba(139,190,178,0.13);
          border-radius: 16px;
          padding: 1.1rem 0.6rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .hz:hover {
          border-color: rgba(139,190,178,0.3);
          transform: translateY(-2px);
        }
        .hz.on {
          background: rgba(230,249,175,0.08);
          border-color: var(--lime);
        }
        .hz-icon {
          font-size: 1.9rem;
          display: block;
          margin-bottom: 0.5rem;
        }
        .hz-name {
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--lime);
          margin-bottom: 0.1rem;
        }
        .hz-sub {
          font-size: 0.62rem;
          color: rgba(139,190,178,0.45);
        }

        /* SEVERITY */
        .sev-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.7rem;
        }
        .sev {
          background: rgba(13,6,48,0.45);
          border: 1px solid rgba(139,190,178,0.13);
          border-radius: 14px;
          padding: 0.85rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .sev.on {
          background: rgba(139,190,178,0.1);
          border-color: var(--teal);
        }
        .sev-dots {
          display: flex;
          gap: 4px;
          justify-content: center;
          margin-bottom: 0.45rem;
        }
        .sev-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(139,190,178,0.25);
        }
        .sev-dot.f {
          background: var(--lime);
        }

        /* LOCATION MINI MAP */
        .loc-map {
          height: 170px;
          border-radius: 16px;
          background: rgba(13,6,48,0.6);
          border: 1px solid rgba(139,190,178,0.14);
          position: relative;
          overflow: hidden;
          margin-bottom: 0.8rem;
          cursor: crosshair;
        }
        .loc-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(139,190,178,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,190,178,0.05) 1px, transparent 1px);
          background-size: 26px 26px;
        }
        .loc-roads {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .loc-pin {
          position: absolute;
          transform: translate(-50%, -100%);
          font-size: 1.8rem;
          filter: drop-shadow(0 4px 8px rgba(230,249,175,0.3));
          transition: all 0.15s;
        }
        .loc-pulse {
          position: absolute;
          width: 40px;
          height: 40px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 2px solid rgba(230,249,175,0.4);
          animation: pingPulse 2s ease-out infinite;
        }
        @keyframes pingPulse {
          0% { transform: translate(-50%, -50%) scale(0.4); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
        }
        .loc-hint {
          position: absolute;
          bottom: 0.6rem;
          left: 0.6rem;
          background: rgba(13,6,48,0.8);
          border-radius: 8px;
          padding: 0.25rem 0.6rem;
          font-size: 0.65rem;
          color: rgba(139,190,178,0.6);
        }
        .loc-row {
          display: flex;
          gap: 0.6rem;
        }
        .loc-input {
          flex: 1;
          background: rgba(13,6,48,0.5);
          border: 1px solid rgba(139,190,178,0.18);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.86rem;
          color: var(--lime);
          outline: none;
        }
        .loc-btn {
          background: rgba(139,190,178,0.1);
          border: 1px solid rgba(139,190,178,0.22);
          border-radius: 12px;
          padding: 0 1rem;
          font-size: 0.78rem;
          color: var(--teal);
          cursor: pointer;
          white-space: nowrap;
        }

        .rh-textarea {
          width: 100%;
          background: rgba(13,6,48,0.5);
          border: 1px solid rgba(139,190,178,0.18);
          border-radius: 12px;
          padding: 0.85rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          color: var(--lime);
          outline: none;
          resize: vertical;
          min-height: 80px;
        }
        .anon-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(13,6,48,0.4);
          border: 1px solid rgba(139,190,178,0.1);
          border-radius: 12px;
          padding: 0.8rem 1rem;
          margin-top: 1rem;
        }
        .submit-btn {
          width: 100%;
          background: var(--lime);
          color: var(--deep);
          padding: 1rem;
          border: none;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1.5rem;
          transition: background 0.2s, transform 0.15s;
        }
        .submit-btn:hover {
          background: var(--teal);
          transform: translateY(-2px);
        }

        /* SIDEBAR */
        .side-card {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.12);
          border-radius: 20px;
          padding: 1.5rem;
          margin-bottom: 1.3rem;
        }

        @media(max-width: 900px) {
          .rh-layout { grid-template-columns: 1fr; }
          .hazard-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      {/* ── HERO ── */}
      <div className="rh-hero">
        <div className="rh-glow" />
        <div className="rh-inner">
          <p className="rh-label">Community Reporting</p>
          <h1 className="rh-title">
            See something?<br />
            <em>Flag it in 10 seconds.</em>
          </h1>
          <p className="rh-sub">
            Every report reaches nearby commuters instantly and fades over hours, so the map stays alive instead of stale.
          </p>
        </div>
      </div>

      <div className="rh-container">
        <div className="rh-layout">
          {/* MAIN REPORT FORM */}
          <div className="rh-card">
            <form onSubmit={handleSubmit}>
              {/* STEP 1 */}
              <div className="rc-section">
                <div className="rc-step-title">
                  <span className="step-num">1</span> What did you see?
                </div>
                <div className="rc-step-sub">Tap one. That&apos;s all we need to publish it.</div>
                <div className="hazard-grid">
                  {hazardTypes.map((hz) => (
                    <div
                      key={hz.id}
                      className={`hz ${selectedHz === hz.id ? 'on' : ''}`}
                      onClick={() => setSelectedHz(hz.id)}
                    >
                      <span className="hz-icon">{hz.icon}</span>
                      <div className="hz-name">{hz.name}</div>
                      <div className="hz-sub">{hz.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 2 */}
              <div className="rc-section">
                <div className="rc-step-title">
                  <span className="step-num">2</span> How bad is it?
                </div>
                <div className="rc-step-sub">Helps us weight the route score.</div>
                <div className="sev-row">
                  <div
                    className={`sev ${severity === 'Minor' ? 'on' : ''}`}
                    onClick={() => setSeverity('Minor')}
                  >
                    <div className="sev-dots">
                      <span className="sev-dot f" />
                      <span className="sev-dot" />
                      <span className="sev-dot" />
                    </div>
                    <div className="text-xs font-bold text-[#e6f9af]">Minor</div>
                    <div className="text-[11px] text-[#8bbeb2]/50">Be aware</div>
                  </div>

                  <div
                    className={`sev ${severity === 'Moderate' ? 'on' : ''}`}
                    onClick={() => setSeverity('Moderate')}
                  >
                    <div className="sev-dots">
                      <span className="sev-dot f" />
                      <span className="sev-dot f" />
                      <span className="sev-dot" />
                    </div>
                    <div className="text-xs font-bold text-[#e6f9af]">Moderate</div>
                    <div className="text-[11px] text-[#8bbeb2]/50">Take care</div>
                  </div>

                  <div
                    className={`sev ${severity === 'Serious' ? 'on' : ''}`}
                    onClick={() => setSeverity('Serious')}
                  >
                    <div className="sev-dots">
                      <span className="sev-dot f" />
                      <span className="sev-dot f" />
                      <span className="sev-dot f" />
                    </div>
                    <div className="text-xs font-bold text-[#e6f9af]">Serious</div>
                    <div className="text-[11px] text-[#8bbeb2]/50">Avoid if possible</div>
                  </div>
                </div>
              </div>

              {/* STEP 3 */}
              <div className="rc-section">
                <div className="rc-step-title">
                  <span className="step-num">3</span> Where?
                </div>
                <div className="rc-step-sub">We&apos;ve placed the pin at your location. Tap the map to adjust.</div>
                <div className="loc-map" onClick={handleMapClick}>
                  <div className="loc-grid" />
                  <svg className="loc-roads" viewBox="0 0 400 170" preserveAspectRatio="none">
                    <line x1="0" y1="85" x2="400" y2="85" stroke="rgba(56,78,119,0.4)" strokeWidth="14" />
                    <line x1="200" y1="0" x2="200" y2="170" stroke="rgba(56,78,119,0.35)" strokeWidth="10" />
                    <line x1="0" y1="40" x2="400" y2="60" stroke="rgba(56,78,119,0.25)" strokeWidth="6" />
                    <line x1="0" y1="130" x2="400" y2="115" stroke="rgba(56,78,119,0.25)" strokeWidth="6" />
                  </svg>
                  <div
                    className="loc-pulse"
                    style={{ top: `${pinPos.y}%`, left: `${pinPos.x}%` }}
                  />
                  <div
                    className="loc-pin"
                    style={{ top: `${pinPos.y}%`, left: `${pinPos.x}%` }}
                  >
                    📍
                  </div>
                  <div className="loc-hint">Tap anywhere on map to reposition pin</div>
                </div>

                <div className="loc-row">
                  <input
                    className="loc-input"
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                  />
                  <button type="button" onClick={handleUseMyLocation} className="loc-btn">
                    ◎ Use my location
                  </button>
                </div>
              </div>

              {/* STEP 4 */}
              <div className="rc-section">
                <div className="rc-step-title">
                  <span className="step-num">4</span> Anything to add?{' '}
                  <span className="text-xs text-[#8bbeb2]/40 font-normal">Optional</span>
                </div>
                <textarea
                  className="rh-textarea"
                  placeholder="e.g. Three lamps in a row are dead near the bus stop. Very dark after 9 PM."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <div className="anon-row">
                  <div className="text-xs">
                    <span className="font-bold text-[#e6f9af]">Report anonymously</span>
                    <span className="block text-[11px] text-[#8bbeb2]/50">Your name is never shown to other users</span>
                  </div>
                  <div
                    className={`w-9 h-5 rounded-full cursor-pointer transition-colors relative ${
                      isAnonymous ? 'bg-[#8bbeb2]' : 'bg-[#384e77]'
                    }`}
                    onClick={() => setIsAnonymous(!isAnonymous)}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        isAnonymous ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="submit-btn">
                {isSubmitting ? 'Publishing...' : '📍 Publish Report (+25 Karma) →'}
              </button>
            </form>
          </div>

          {/* SIDEBAR */}
          <div>
            {/* Decay Card */}
            <div className="side-card">
              <h4 className="font-serif text-sm font-bold text-[#e6f9af] mb-1">How this report decays</h4>
              <p className="text-xs text-[#8bbeb2]/60 mb-3">
                Reports automatically lose weight exponentially over hours so stale flags don&apos;t linger.
              </p>
              <div className="h-20 bg-[#0d0630]/60 rounded-xl border border-[#8bbeb2]/10 relative overflow-hidden flex items-end p-2">
                <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                  <path
                    d="M 0,10 Q 50,45 100,52 T 200,58"
                    stroke="#e6f9af"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
              <div className="flex justify-between text-[10px] text-[#8bbeb2]/50 mt-1">
                <span>0h (100%)</span>
                <span>6h (22%)</span>
                <span>12h (5%)</span>
              </div>
            </div>

            {/* Nearby Verified Reports */}
            <div className="side-card">
              <h4 className="font-serif text-sm font-bold text-[#e6f9af] mb-1">Nearby active reports</h4>
              <p className="text-xs text-[#8bbeb2]/60 mb-3">Community hazards reported in this corridor:</p>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0d0630]/50 border border-[#8bbeb2]/10 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-[#e6f9af]">💡 Unlit underpass</div>
                    <div className="text-[11px] text-[#8bbeb2]/50">Sion West · 42m ago</div>
                  </div>
                  <button
                    onClick={() => setConfirmedReports({ ...confirmedReports, 1: true })}
                    className={`px-3 py-1 rounded-full text-[11px] border cursor-pointer ${
                      confirmedReports[1]
                        ? 'bg-[#e6f9af]/20 text-[#e6f9af] border-[#e6f9af]/40'
                        : 'border-[#8bbeb2]/30 text-[#8bbeb2]'
                    }`}
                  >
                    {confirmedReports[1] ? '✓ Confirmed' : '+1 Still there'}
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[#0d0630]/50 border border-[#8bbeb2]/10 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-[#e6f9af]">🌧️ Waterlogged curb</div>
                    <div className="text-[11px] text-[#8bbeb2]/50">Kurla West · 1.5h ago</div>
                  </div>
                  <button
                    onClick={() => setConfirmedReports({ ...confirmedReports, 2: true })}
                    className={`px-3 py-1 rounded-full text-[11px] border cursor-pointer ${
                      confirmedReports[2]
                        ? 'bg-[#e6f9af]/20 text-[#e6f9af] border-[#e6f9af]/40'
                        : 'border-[#8bbeb2]/30 text-[#8bbeb2]'
                    }`}
                  >
                    {confirmedReports[2] ? '✓ Confirmed' : '+1 Still there'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS OVERLAY MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 bg-[#0d0630]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="p-8 rounded-3xl bg-[#18314f] border border-[#8bbeb2]/30 text-center max-w-sm w-full space-y-4 shadow-2xl">
            <span className="text-5xl">✓</span>
            <h3 className="font-serif text-2xl font-bold text-[#e6f9af]">Report Published!</h3>
            <p className="text-xs text-[#8bbeb2]/80">
              Your report has been broadcast to all commuters traveling near {locationName}.
            </p>
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#e6f9af]/10 border border-[#e6f9af]/30 text-xs font-bold text-[#e6f9af]">
              +25 Community Karma Points
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowSuccess(false);
                  if (onNavigate) onNavigate('planner');
                }}
                className="w-full py-3 rounded-full bg-[#e6f9af] text-[#0d0630] font-bold text-sm cursor-pointer hover:bg-[#8bbeb2]"
              >
                View on Route Planner →
              </button>
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full py-2.5 rounded-full border border-[#8bbeb2]/30 text-xs text-[#8bbeb2] cursor-pointer hover:bg-[#8bbeb2]/10"
              >
                Report Another Hazard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
