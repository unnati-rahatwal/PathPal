import React, { useState } from 'react';

export default function Dashboard({ onLaunchPlanner, onSelectSavedRoute, onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');

  // SOS countdown modal simulation
  const [isSOSCountdownOpen, setIsSOSCountdownOpen] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(5);

  // Settings preferences
  const [prefSliders, setPrefSliders] = useState({
    light: 9,
    crowd: 7,
    shops: 6,
    speed: 4
  });

  // Ghost sentry & auto-share toggles
  const [toggles, setToggles] = useState({
    ghostSentry: true,
    shareLive: false,
    vibrateWarning: true
  });

  const triggerSOSCountdown = () => {
    setIsSOSCountdownOpen(true);
    setSosCountdown(5);
  };

  const savedRoutes = [
    {
      id: 'sr1',
      name: 'Bandra West → BKC North Gate',
      meta: 'Via Linking Rd & Turner Rd · 8.4 km · Auto',
      score: '9.2',
      origin: { name: 'Bandra West (Linking Road)', lat: 19.0596, lng: 72.8295 },
      dest: { name: 'Bandra Kurla Complex (BKC)', lat: 19.0688, lng: 72.8703 }
    },
    {
      id: 'sr2',
      name: 'Lower Parel Station → Dadar TT',
      meta: 'Via Senapati Bapat Marg · 4.8 km · Cab',
      score: '8.9',
      origin: { name: 'Lower Parel Station', lat: 19.0016, lng: 72.8306 },
      dest: { name: 'Dadar TT Circle', lat: 19.0178, lng: 72.8478 }
    },
    {
      id: 'sr3',
      name: 'Andheri West → Powai Hiranandani',
      meta: 'Via JVLR Arterial Corridor · 11.2 km · Cab',
      score: '8.7',
      origin: { name: 'Andheri West Station', lat: 19.1197, lng: 72.8464 },
      dest: { name: 'Powai Hiranandani', lat: 19.1176, lng: 72.906 }
    },
    {
      id: 'sr4',
      name: 'Airoli Mindspace → Vashi Plaza',
      meta: 'Via Thane-Belapur Highway · 14.5 km · Cab',
      score: '9.0',
      origin: { name: 'Airoli Mindspace', lat: 19.1551, lng: 72.9986 },
      dest: { name: 'Vashi Plaza', lat: 19.0771, lng: 72.9986 }
    }
  ];

  return (
    <div className="dash-root text-[#e6f9af] min-h-screen bg-[#0d0630]">
      <style>{`
        .dash-root {
          --deep: #0d0630;
          --navy: #18314f;
          --slate: #384e77;
          --teal: #8bbeb2;
          --lime: #e6f9af;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        .dash-header {
          padding: 6.5rem 2.5rem 0;
          background: var(--navy);
          border-bottom: 1px solid rgba(139,190,178,0.1);
        }
        .dh-inner {
          max-width: 1150px;
          margin: 0 auto;
        }
        .user-row {
          display: flex;
          align-items: center;
          gap: 1.4rem;
          margin-bottom: 1.8rem;
        }
        .dash-avatar {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: var(--slate);
          border: 2px solid rgba(139,190,178,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        .dash-user-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--lime);
        }
        .dash-user-sub {
          font-size: 0.8rem;
          color: rgba(139,190,178,0.5);
        }
        .dash-user-actions {
          margin-left: auto;
          display: flex;
          gap: 0.7rem;
        }
        .dash-btn-sm {
          background: var(--lime);
          color: var(--deep);
          border: none;
          border-radius: 100px;
          padding: 0.5rem 1.2rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s;
        }
        .dash-btn-sm:hover {
          background: var(--teal);
        }
        .dash-btn-ghost {
          background: transparent;
          color: var(--teal);
          border: 1px solid rgba(139,190,178,0.25);
          border-radius: 100px;
          padding: 0.5rem 1.2rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }
        .dash-btn-ghost:hover {
          border-color: var(--teal);
          background: rgba(139,190,178,0.06);
        }

        .dash-tabs {
          display: flex;
          gap: 0;
          border-top: 1px solid rgba(139,190,178,0.08);
          overflow-x: auto;
        }
        .dtab {
          padding: 0.95rem 1.4rem;
          font-size: 0.84rem;
          font-weight: 500;
          color: rgba(139,190,178,0.5);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
        }
        .dtab:hover {
          color: var(--teal);
        }
        .dtab.on {
          color: var(--lime);
          border-bottom-color: var(--lime);
        }
        .dtab-badge {
          background: rgba(139,190,178,0.15);
          color: var(--teal);
          font-size: 0.62rem;
          padding: 0.15rem 0.5rem;
          border-radius: 100px;
          font-weight: 600;
        }
        .dtab-badge.red {
          background: rgba(200,60,60,0.2);
          color: rgba(255,130,130,0.9);
        }

        .dash-main {
          max-width: 1150px;
          margin: 0 auto;
          padding: 2.5rem;
        }

        /* STATS */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.1rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.1);
          border-radius: 16px;
          padding: 1.3rem 1.5rem;
          position: relative;
          overflow: hidden;
        }
        .stat-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
        }
        .sc-a::after { background: linear-gradient(90deg, var(--lime), transparent); }
        .sc-b::after { background: linear-gradient(90deg, var(--teal), transparent); }
        .sc-c::after { background: linear-gradient(90deg, rgba(139,190,178,0.5), transparent); }
        .sc-d::after { background: linear-gradient(90deg, rgba(56,78,119,0.9), transparent); }
        .sc-num {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 900;
          color: var(--lime);
          line-height: 1;
          margin-bottom: 0.3rem;
        }
        .sc-label {
          font-size: 0.72rem;
          color: rgba(139,190,178,0.45);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .sc-trend {
          font-size: 0.72rem;
          color: var(--teal);
          margin-top: 0.4rem;
        }

        .two-col {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        /* SAVED ROUTES */
        .route-list {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .saved-route {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.1);
          border-radius: 16px;
          padding: 1.1rem 1.4rem;
          display: flex;
          align-items: center;
          gap: 1.2rem;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .saved-route:hover {
          border-color: rgba(139,190,178,0.3);
        }
        .sr-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(56,78,119,0.35);
          border: 1px solid rgba(139,190,178,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }
        .sr-info {
          flex: 1;
        }
        .sr-name {
          font-size: 0.92rem;
          font-weight: 500;
          color: var(--lime);
          margin-bottom: 0.25rem;
        }
        .sr-meta {
          font-size: 0.75rem;
          color: rgba(139,190,178,0.45);
          display: flex;
          gap: 0.9rem;
          flex-wrap: wrap;
        }
        .sr-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.35rem;
        }
        .sr-score {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 900;
          color: var(--lime);
        }
        .sr-go {
          font-size: 0.7rem;
          color: var(--teal);
        }

        /* KARMA */
        .karma-card {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.12);
          border-radius: 20px;
          padding: 1.6rem;
          margin-bottom: 1.5rem;
        }
        .karma-top {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          margin-bottom: 1.3rem;
        }
        .karma-ring {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: conic-gradient(var(--lime) 0% 68%, rgba(56,78,119,0.4) 68% 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
        }
        .karma-ring::before {
          content: '';
          position: absolute;
          inset: 6px;
          border-radius: 50%;
          background: var(--navy);
        }
        .karma-ring span {
          position: relative;
          z-index: 1;
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 900;
          color: var(--lime);
        }
        .karma-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--lime);
          margin-bottom: 0.2rem;
        }
        .karma-sub {
          font-size: 0.78rem;
          color: rgba(139,190,178,0.5);
          line-height: 1.5;
        }
        .kp-track {
          height: 6px;
          background: rgba(13,6,48,0.5);
          border-radius: 100px;
          overflow: hidden;
        }
        .kp-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--teal), var(--lime));
          border-radius: 100px;
          width: 68%;
        }
        .badge-row {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 1rem;
        }
        .karma-badge {
          font-size: 0.68rem;
          padding: 0.25rem 0.7rem;
          border-radius: 100px;
          background: rgba(56,78,119,0.35);
          border: 1px solid rgba(139,190,178,0.14);
          color: rgba(139,190,178,0.7);
        }
        .karma-badge.earned {
          background: rgba(230,249,175,0.08);
          border-color: rgba(230,249,175,0.2);
          color: var(--lime);
        }

        /* SOS SECTION */
        .sos-hero {
          background: linear-gradient(135deg, rgba(150,30,30,0.16), rgba(24,49,79,0.9));
          border: 1px solid rgba(200,80,80,0.28);
          border-radius: 26px;
          padding: 2.2rem;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }
        .sos-hero-inner {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 2rem;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        .sos-big-btn {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(210,55,55,0.95), rgba(150,20,20,1));
          border: 3px solid rgba(255,110,110,0.45);
          box-shadow: 0 0 40px rgba(200,50,50,0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .sos-big-btn:hover {
          transform: scale(1.06);
        }
        .sos-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.2rem;
          margin-bottom: 2rem;
        }
        .sos-card {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.12);
          border-radius: 20px;
          padding: 1.5rem;
        }
        .helpline {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          padding: 0.75rem 0.9rem;
          background: rgba(13,6,48,0.4);
          border: 1px solid rgba(139,190,178,0.1);
          border-radius: 12px;
          margin-bottom: 0.6rem;
          text-decoration: none;
        }

        /* TOGGLES */
        .dash-toggle {
          width: 38px;
          height: 20px;
          background: rgba(56,78,119,0.5);
          border-radius: 100px;
          cursor: pointer;
          position: relative;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .dash-toggle.on {
          background: var(--teal);
        }
        .dash-toggle::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 14px;
          height: 14px;
          background: #fff;
          border-radius: 50%;
          transition: transform 0.2s;
          opacity: 0.92;
        }
        .dash-toggle.on::after {
          transform: translateX(18px);
        }

        @media(max-width: 950px) {
          .stats-row { grid-template-columns: repeat(2, 1fr); }
          .two-col, .sos-grid { grid-template-columns: 1fr; }
          .sos-hero-inner { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <div className="dash-header">
        <div className="dh-inner">
          <div className="user-row">
            <div className="dash-avatar">🌙</div>
            <div>
              <div className="dash-user-name">Ananya Shah</div>
              <div className="dash-user-sub">Commuter Pro · Mumbai NightSafe Member · Bandra Hub</div>
            </div>
            <div className="dash-user-actions">
              <button
                onClick={() => onNavigate && onNavigate('report')}
                className="dash-btn-ghost"
              >
                ⚠️ Report Hazard
              </button>
              <button
                onClick={() => onLaunchPlanner ? onLaunchPlanner() : onNavigate && onNavigate('planner')}
                className="dash-btn-sm"
              >
                + Plan Route
              </button>
            </div>
          </div>

          <div className="dash-tabs">
            <div
              className={`dtab ${activeTab === 'overview' ? 'on' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </div>
            <div
              className={`dtab ${activeTab === 'routes' ? 'on' : ''}`}
              onClick={() => setActiveTab('routes')}
            >
              Saved Routes <span className="dtab-badge">4</span>
            </div>
            <div
              className={`dtab ${activeTab === 'history' ? 'on' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              Journey History
            </div>
            <div
              className={`dtab ${activeTab === 'sos' ? 'on' : ''}`}
              onClick={() => setActiveTab('sos')}
            >
              🆘 SOS &amp; Safety <span className="dtab-badge red">Ready</span>
            </div>
            <div
              className={`dtab ${activeTab === 'settings' ? 'on' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN BODY ── */}
      <div className="dash-main">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div className="stats-row">
              <div className="stat-card sc-a">
                <div className="sc-num">48</div>
                <div className="sc-label">Safe Trips Taken</div>
                <div className="sc-trend">↑ 100% on lit corridors</div>
              </div>
              <div className="stat-card sc-b">
                <div className="sc-num">9.1</div>
                <div className="sc-label">Avg Corridor Score</div>
                <div className="sc-trend">Out of 10.0 scale</div>
              </div>
              <div className="stat-card sc-c">
                <div className="sc-num">184 km</div>
                <div className="sc-label">Lit Distance Traversed</div>
                <div className="sc-trend">Across Mumbai Network</div>
              </div>
              <div className="stat-card sc-d">
                <div className="sc-num">12</div>
                <div className="sc-label">Dark Spots Avoided</div>
                <div className="sc-trend">Rerouted proactively</div>
              </div>
            </div>

            <div className="two-col">
              {/* Left Column: Favorite Corridors */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-lg font-bold text-[#e6f9af]">Pinned Night Corridors</h3>
                  <button
                    onClick={() => setActiveTab('routes')}
                    className="text-xs text-[#8bbeb2] hover:underline"
                  >
                    View all (4) →
                  </button>
                </div>

                <div className="route-list">
                  {savedRoutes.slice(0, 2).map((r) => (
                    <div
                      key={r.id}
                      className="saved-route"
                      onClick={() => onSelectSavedRoute && onSelectSavedRoute(r)}
                    >
                      <div className="sr-icon">🌙</div>
                      <div className="sr-info">
                        <div className="sr-name">{r.name}</div>
                        <div className="sr-meta">{r.meta}</div>
                      </div>
                      <div className="sr-right">
                        <div className="sr-score">{r.score}</div>
                        <div className="sr-go">Navigate →</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Community Guardian Karma */}
              <div>
                <div className="karma-card">
                  <div className="karma-top">
                    <div className="karma-ring">
                      <span>68%</span>
                    </div>
                    <div>
                      <div className="karma-title">Community Guardian</div>
                      <div className="karma-sub">Level 3 · 340 pts · 12 verified reports</div>
                    </div>
                  </div>
                  <div className="kp-track">
                    <div className="kp-fill" />
                  </div>
                  <div className="badge-row">
                    <span className="karma-badge earned">🔦 Night Owl</span>
                    <span className="karma-badge earned">🛡️ Safe Scout</span>
                    <span className="karma-badge earned">💡 Lamp Validator</span>
                    <span className="karma-badge">🌧️ Monsoon Sentinel</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SAVED ROUTES */}
        {activeTab === 'routes' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-bold text-[#e6f9af]">Your Saved Corridors</h3>
              <button
                onClick={() => onLaunchPlanner ? onLaunchPlanner() : onNavigate && onNavigate('planner')}
                className="dash-btn-sm"
              >
                + Add New Corridor
              </button>
            </div>

            <div className="route-list">
              {savedRoutes.map((r) => (
                <div
                  key={r.id}
                  className="saved-route"
                  onClick={() => onSelectSavedRoute && onSelectSavedRoute(r)}
                >
                  <div className="sr-icon">📍</div>
                  <div className="sr-info">
                    <div className="sr-name">{r.name}</div>
                    <div className="sr-meta">{r.meta}</div>
                  </div>
                  <div className="sr-right">
                    <div className="sr-score">{r.score}</div>
                    <div className="sr-go">Launch Live Route →</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: JOURNEY HISTORY */}
        {activeTab === 'history' && (
          <div className="p-6 rounded-2xl bg-[#18314f] border border-[#8bbeb2]/15 space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#e6f9af]">Recent Trip Audits</h3>
            <div className="divide-y divide-[#8bbeb2]/10 text-xs">
              <div className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-[#e6f9af] text-sm">Bandra West → BKC North Gate</div>
                  <div className="text-[#8bbeb2]/60 mt-0.5">Yesterday · 11:42 PM · 22 min · Auto</div>
                </div>
                <span className="text-[#e6f9af] font-bold text-base">9.2 / 10</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-[#e6f9af] text-sm">Lower Parel Station → Dadar TT</div>
                  <div className="text-[#8bbeb2]/60 mt-0.5">3 days ago · 1:15 AM · 14 min · Cab</div>
                </div>
                <span className="text-[#e6f9af] font-bold text-base">8.9 / 10</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-[#e6f9af] text-sm">Andheri West → Powai Hiranandani</div>
                  <div className="text-[#8bbeb2]/60 mt-0.5">Sep 24 · 10:20 PM · 32 min · Cab</div>
                </div>
                <span className="text-[#e6f9af] font-bold text-base">8.7 / 10</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SOS & SAFETY */}
        {activeTab === 'sos' && (
          <div>
            <div className="sos-hero">
              <div className="sos-hero-inner">
                <div>
                  <h2>Emergency SOS <em>Active Lifeline</em></h2>
                  <p>
                    Trigger immediate alerts to your trusted contacts with your live GPS location, route departure status,
                    and instant one-tap connection to Mumbai Police Beat 112.
                  </p>
                  <div className="sos-hero-tags">
                    <span className="sos-tag">Police 112 Ready</span>
                    <span className="sos-tag">WhatsApp Live Link</span>
                    <span className="sos-tag">Ghost Sentry Active</span>
                  </div>
                </div>
                <button onClick={triggerSOSCountdown} className="sos-big-btn">
                  <span className="b-icon">🚨</span>
                  <span className="b-text">SOS</span>
                  <span className="b-hint">PRESS &amp; HOLD</span>
                </button>
              </div>
            </div>

            <div className="sos-grid">
              <div className="sos-card">
                <div className="sos-card-title">📞 Quick Helplines</div>
                <div className="sos-card-sub">Direct official emergency lines</div>
                <a href="tel:112" className="helpline">
                  <span className="hl-icon">🚨</span>
                  <div className="hl-info"><div className="hl-name">National Emergency</div><div className="hl-sub">Police · Fire · Medical</div></div>
                  <div className="hl-num">112</div>
                </a>
                <a href="tel:103" className="helpline">
                  <span className="hl-icon">🛡️</span>
                  <div className="hl-info"><div className="hl-name">Mumbai Women Helpline</div><div className="hl-sub">Dedicated Women Safety</div></div>
                  <div className="hl-num">103</div>
                </a>
              </div>

              <div className="sos-card">
                <div className="sos-card-title">👥 Guard Contacts</div>
                <div className="sos-card-sub">Will receive alert pings on SOS</div>
                <div className="p-3 rounded-xl bg-[#0d0630]/60 border border-[#8bbeb2]/10 space-y-1 mb-3">
                  <div className="text-xs font-bold text-[#e6f9af]">Sneha Shah (Sister)</div>
                  <div className="text-[11px] text-[#8bbeb2]/60">+91 98201 44510 · Verified</div>
                </div>
                <div className="p-3 rounded-xl bg-[#0d0630]/60 border border-[#8bbeb2]/10 space-y-1">
                  <div className="text-xs font-bold text-[#e6f9af]">Rohan Verma (Colleague)</div>
                  <div className="text-[11px] text-[#8bbeb2]/60">+91 98190 22319 · Verified</div>
                </div>
              </div>

              <div className="sos-card">
                <div className="sos-card-title">👻 Ghost Sentry Settings</div>
                <div className="sos-card-sub">Silent waypoint deviation monitor</div>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span>Silent Halt Ping (&gt;4 min)</span>
                    <div
                      className={`dash-toggle ${toggles.ghostSentry ? 'on' : ''}`}
                      onClick={() => setToggles({ ...toggles, ghostSentry: !toggles.ghostSentry })}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Auto-Share Route Departure</span>
                    <div
                      className={`dash-toggle ${toggles.shareLive ? 'on' : ''}`}
                      onClick={() => setToggles({ ...toggles, shareLive: !toggles.shareLive })}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Haptic Vibration Warnings</span>
                    <div
                      className={`dash-toggle ${toggles.vibrateWarning ? 'on' : ''}`}
                      onClick={() => setToggles({ ...toggles, vibrateWarning: !toggles.vibrateWarning })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="p-6 rounded-2xl bg-[#18314f] border border-[#8bbeb2]/15 space-y-6 max-w-xl">
            <h3 className="font-serif text-xl font-bold text-[#e6f9af]">Algorithm Weight Preferences</h3>
            <p className="text-xs text-[#8bbeb2]/70">
              Customize how NightPath calculates your optimal routes across lighting, footfall, and speed.
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>💡 Street Lighting Priority</span>
                  <span className="text-[#8bbeb2]">{prefSliders.light} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={prefSliders.light}
                  onChange={(e) => setPrefSliders({ ...prefSliders, light: +e.target.value })}
                  className="w-full accent-[#8bbeb2]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>👥 Pedestrian Footfall Density</span>
                  <span className="text-[#8bbeb2]">{prefSliders.crowd} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={prefSliders.crowd}
                  onChange={(e) => setPrefSliders({ ...prefSliders, crowd: +e.target.value })}
                  className="w-full accent-[#8bbeb2]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>🏪 Open 24/7 Shops / Pharmacies</span>
                  <span className="text-[#8bbeb2]">{prefSliders.shops} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={prefSliders.shops}
                  onChange={(e) => setPrefSliders({ ...prefSliders, shops: +e.target.value })}
                  className="w-full accent-[#8bbeb2]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SOS Countdown Simulator Modal */}
      {isSOSCountdownOpen && (
        <div className="fixed inset-0 z-50 bg-[#0d0630]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="p-8 rounded-3xl bg-[#18314f] border border-red-500/40 text-center max-w-sm w-full space-y-4 shadow-2xl">
            <span className="text-5xl animate-bounce">🚨</span>
            <h3 className="font-serif text-2xl font-bold text-[#e6f9af]">Emergency SOS Active</h3>
            <p className="text-xs text-[#8bbeb2]/80">
              Broadcasting GPS coordinates to Police (112) and your emergency contacts.
            </p>
            <div className="font-serif text-6xl font-black text-red-400 py-2">{sosCountdown}</div>
            <button
              onClick={() => setIsSOSCountdownOpen(false)}
              className="w-full py-3 rounded-full bg-[#e6f9af] text-[#0d0630] font-bold text-sm cursor-pointer hover:bg-[#8bbeb2]"
            >
              Cancel Alert
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
