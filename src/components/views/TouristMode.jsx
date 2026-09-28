import React, { useState } from 'react';

export default function TouristMode({ onLaunchPlanner, onNavigate, onOpenSOS }) {
  // Registration form
  const [arrType, setArrType] = useState('flight');
  const [flightNo, setFlightNo] = useState('');
  const [country, setCountry] = useState('United States');
  const [hotel, setHotel] = useState('');
  const [phone, setPhone] = useState('');
  const [contact, setContact] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  // Gateway scam tab selector
  const [gwTab, setGwTab] = useState('airport');

  // Interactive Fare Calculator state
  const [calcMode, setCalcMode] = useState('auto'); // 'auto' | 'taxi' | 'ac'
  const [distanceKm, setDistanceKm] = useState(12);
  const [isNightSurcharge, setIsNightSurcharge] = useState(true);

  // Active driver card phrase index
  const [activePhrase, setActivePhrase] = useState(0);

  // Embassy country selector
  const [selectedEmbassy, setSelectedEmbassy] = useState('usa');

  // Compute calculated fare
  const fareRates = {
    auto: { base: 23, baseKm: 1.5, perKm: 15.33, nightMult: 1.25 },
    taxi: { base: 28, baseKm: 1.5, perKm: 18.66, nightMult: 1.25 },
    ac: { base: 33, baseKm: 1.5, perKm: 22.0, nightMult: 1.25 }
  };
  const rate = fareRates[calcMode];
  let calculatedFare = rate.base;
  if (distanceKm > rate.baseKm) {
    calculatedFare += (distanceKm - rate.baseKm) * rate.perKm;
  }
  if (isNightSurcharge) {
    calculatedFare *= rate.nightMult;
  }
  const displayFare = Math.round(calculatedFare);

  const driverPhrases = [
    {
      en: 'Please turn on the meter. I will pay strictly by meter reading.',
      mr: 'कृपया मीटर चालू करा. मी फक्त मीटरनुसार पैसे देईन.',
      pron: 'Krupaya meter chalu kara. Mee phakta meter-nusar paise dein.'
    },
    {
      en: 'My friend is tracking my route live on GPS right now.',
      mr: 'माझा मित्र आता थेट जीपीएसवर माझा मार्ग ट्रॅक करत आहे.',
      pron: 'Majha mitra aata thet GPS var majha marga track karat aahe.'
    },
    {
      en: 'Please take the main well-lit road, not the shortcut.',
      mr: 'कृपया मुख्य उजळलेल्या रस्त्याने जा, शॉर्टकट नको.',
      pron: 'Krupaya mukhya ujallelya rastyane ja, shortcut nako.'
    },
    {
      en: 'Please drop me right outside the main hotel lobby gate.',
      mr: 'कृपया मला थेट हॉटेलच्या मुख्य प्रवेशद्वाराजवळ सोडा.',
      pron: 'Krupaya mala thet hotelchya mukhya praveshadwarajaval soda.'
    }
  ];

  const embassyData = {
    usa: {
      flag: '🇺🇸',
      country: 'United States',
      name: 'U.S. Consulate General Mumbai',
      loc: 'C-49, G-Block, Bandra Kurla Complex (BKC)',
      phone: '+91 (022) 2672-4000',
      emergency: '+91 (022) 2672-4000 (Press 0 after hours)',
      hours: '8:00 AM – 4:30 PM (M–F)'
    },
    uk: {
      flag: '🇬🇧',
      country: 'United Kingdom',
      name: 'British Deputy High Commission',
      loc: 'Naman Chambers, C-32, G Block, BKC',
      phone: '+91 (022) 6650-2222',
      emergency: '+91 (022) 6650-2222 (24/7 Citizen Line)',
      hours: '8:30 AM – 4:30 PM (M–F)'
    },
    australia: {
      flag: '🇦🇺',
      country: 'Australia',
      name: 'Australian Consulate-General Mumbai',
      loc: 'Crescenzo, 10th Floor, G Block, BKC',
      phone: '+91 (022) 6757-4900',
      emergency: '+61 2 6261 3305 (Canberra 24/7 Consular)',
      hours: '8:30 AM – 5:00 PM (M–F)'
    },
    germany: {
      flag: '🇩🇪',
      country: 'Germany',
      name: 'Consulate General of the Federal Republic of Germany',
      loc: 'Hoechst House, 10th Floor, Nariman Point',
      phone: '+91 (022) 6940-1444',
      emergency: '+91 98200 48666 (Emergency Cell)',
      hours: '8:00 AM – 3:30 PM (M–F)'
    },
    japan: {
      flag: '🇯🇵',
      country: 'Japan',
      name: 'Consulate-General of Japan in Mumbai',
      loc: 'No.1, M.L. Dahanukar Marg, Cumballa Hill',
      phone: '+91 (022) 2351-7101',
      emergency: '+91 (022) 2351-7101 (Night Guard Transfer)',
      hours: '9:00 AM – 5:30 PM (M–F)'
    },
    france: {
      flag: '🇫🇷',
      country: 'France',
      name: 'Consulate General of France in Bombay',
      loc: 'Wockhardt Towers, East Wing, 5th Floor, BKC',
      phone: '+91 (022) 6669-4000',
      emergency: '+91 98209 41300 (Emergency Hotline)',
      hours: '8:30 AM – 5:00 PM (M–F)'
    }
  };

  const currentEmb = embassyData[selectedEmbassy];

  return (
    <div className="tourist-mode-root text-[#e6f9af] min-h-screen bg-[#0d0630]">
      <style>{`
        .tourist-mode-root {
          --deep: #0d0630;
          --navy: #18314f;
          --slate: #384e77;
          --teal: #8bbeb2;
          --lime: #e6f9af;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        .tm-hero {
          padding: 8rem 2.5rem 4rem;
          background: var(--slate);
          position: relative;
          overflow: hidden;
        }
        .tm-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(139,190,178,0.07) 1.5px, transparent 1.5px);
          background-size: 28px 28px;
          pointer-events: none;
        }
        .tm-hero-glow {
          position: absolute;
          top: -20%;
          right: -5%;
          width: 520px;
          height: 520px;
          background: radial-gradient(ellipse, rgba(13,6,48,0.5) 0%, transparent 60%);
          pointer-events: none;
        }
        .tm-hero-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 440px;
          gap: 3.5rem;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        .tm-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(13,6,48,0.4);
          border: 1px solid rgba(139,190,178,0.25);
          color: var(--teal);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.35rem 0.9rem;
          border-radius: 100px;
          margin-bottom: 1.5rem;
        }
        .tm-h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.2rem, 4.5vw, 3.6rem);
          font-weight: 900;
          line-height: 1.08;
          color: var(--lime);
          margin-bottom: 1.2rem;
        }
        .tm-h1 em {
          font-style: italic;
          color: var(--teal);
        }
        .tm-hero p {
          font-size: 1rem;
          font-weight: 300;
          color: rgba(230,249,175,0.65);
          line-height: 1.75;
          max-width: 480px;
          margin-bottom: 1.8rem;
        }
        .tm-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .tm-tag {
          font-size: 0.72rem;
          padding: 0.3rem 0.85rem;
          border-radius: 100px;
          background: rgba(13,6,48,0.4);
          border: 1px solid rgba(139,190,178,0.16);
          color: rgba(139,190,178,0.75);
        }

        /* REGISTRATION CARD */
        .reg-card {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.2);
          border-radius: 24px;
          padding: 1.8rem;
          box-shadow: 0 20px 60px rgba(13,6,48,0.5);
        }
        .reg-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--lime);
          margin-bottom: 0.3rem;
        }
        .reg-sub {
          font-size: 0.78rem;
          color: rgba(139,190,178,0.5);
          margin-bottom: 1.3rem;
          font-weight: 300;
        }
        .arr-tabs {
          display: flex;
          background: rgba(13,6,48,0.5);
          border: 1px solid rgba(139,190,178,0.12);
          border-radius: 100px;
          padding: 3px;
          margin-bottom: 1.1rem;
          gap: 3px;
        }
        .arr-tab {
          flex: 1;
          padding: 0.45rem;
          border: none;
          background: transparent;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          color: rgba(139,190,178,0.5);
          cursor: pointer;
          transition: all 0.2s;
        }
        .arr-tab.on {
          background: var(--lime);
          color: var(--deep);
        }
        .tm-fg {
          margin-bottom: 0.9rem;
        }
        .tm-fl {
          display: block;
          font-size: 0.66rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(139,190,178,0.45);
          margin-bottom: 0.4rem;
        }
        .tm-fi {
          width: 100%;
          background: rgba(13,6,48,0.5);
          border: 1px solid rgba(139,190,178,0.18);
          border-radius: 11px;
          padding: 0.7rem 0.95rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.86rem;
          color: var(--lime);
          outline: none;
          transition: border-color 0.2s;
        }
        .tm-fi:focus {
          border-color: rgba(139,190,178,0.5);
        }
        .tm-fi option {
          background: var(--navy);
        }
        .tm-fr {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.7rem;
        }
        .reg-btn {
          width: 100%;
          background: var(--lime);
          color: var(--deep);
          border: none;
          border-radius: 100px;
          padding: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          margin-top: 0.4rem;
          transition: background 0.2s, transform 0.15s;
        }
        .reg-btn:hover {
          background: var(--teal);
          transform: translateY(-1px);
        }

        /* SECTIONS */
        .tm-section {
          padding: 4.5rem 2.5rem;
        }
        .tm-section.alt {
          background: var(--navy);
          border-top: 1px solid rgba(139,190,178,0.08);
          border-bottom: 1px solid rgba(139,190,178,0.08);
        }
        .tm-wrap {
          max-width: 1100px;
          margin: 0 auto;
        }
        .tm-h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.7rem, 3.2vw, 2.5rem);
          font-weight: 700;
          color: var(--lime);
          line-height: 1.15;
          margin-bottom: 0.8rem;
        }
        .tm-h2 em {
          font-style: italic;
          color: var(--teal);
        }

        /* PIPELINE */
        .tm-pipe {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.2rem;
          position: relative;
        }
        .tm-pipe-step {
          background: rgba(13,6,48,0.4);
          border: 1px solid rgba(139,190,178,0.13);
          border-radius: 20px;
          padding: 1.6rem;
          transition: transform 0.25s, border-color 0.25s;
        }
        .tm-pipe-step:hover {
          transform: translateY(-4px);
          border-color: rgba(139,190,178,0.3);
        }
        .tm-pipe-num {
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem;
          font-weight: 900;
          color: rgba(139,190,178,0.1);
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .tm-pipe-icon {
          font-size: 1.7rem;
          display: block;
          margin-bottom: 0.7rem;
        }
        .tm-pipe-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--lime);
          margin-bottom: 0.5rem;
        }
        .tm-pipe-desc {
          font-size: 0.82rem;
          color: rgba(139,190,178,0.55);
          line-height: 1.7;
          font-weight: 300;
        }

        /* GATEWAY TABS */
        .gw-tabs {
          display: flex;
          gap: 0.6rem;
          margin-bottom: 1.6rem;
          flex-wrap: wrap;
        }
        .gw-tab {
          padding: 0.6rem 1.3rem;
          border-radius: 100px;
          border: 1px solid rgba(139,190,178,0.18);
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.84rem;
          font-weight: 500;
          color: rgba(139,190,178,0.6);
          cursor: pointer;
          transition: all 0.2s;
        }
        .gw-tab.on {
          background: var(--lime);
          color: var(--deep);
          border-color: var(--lime);
        }
        .scam-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.2rem;
        }
        .scam-card {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.13);
          border-radius: 20px;
          overflow: hidden;
        }
        .scam-head {
          padding: 1.1rem 1.4rem;
          border-bottom: 1px solid rgba(139,190,178,0.08);
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .scam-pt {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(230,249,175,0.1);
          border: 1px solid rgba(230,249,175,0.22);
          color: var(--lime);
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .scam-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--lime);
        }
        .scam-body {
          padding: 1.3rem 1.4rem;
        }
        .scam-desc {
          font-size: 0.82rem;
          color: rgba(139,190,178,0.6);
          line-height: 1.7;
          margin-bottom: 1rem;
          font-weight: 300;
        }
        .alert-box {
          background: rgba(230,249,175,0.06);
          border: 1px solid rgba(230,249,175,0.18);
          border-radius: 12px;
          padding: 0.9rem 1rem;
          display: flex;
          gap: 0.7rem;
        }
        .alert-text {
          font-size: 0.78rem;
          color: rgba(230,249,175,0.8);
          line-height: 1.6;
        }

        /* FARE TABLE & CALCULATOR */
        .fare-layout {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }
        .fare-table {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.13);
          border-radius: 20px;
          overflow: hidden;
        }
        .ft-row {
          display: grid;
          grid-template-columns: 1.3fr 0.8fr 0.9fr 1fr;
          gap: 0.5rem;
          padding: 0.95rem 1.3rem;
          border-bottom: 1px solid rgba(139,190,178,0.07);
          align-items: center;
          font-size: 0.82rem;
        }
        .ft-row:last-child {
          border-bottom: none;
        }
        .ft-head {
          background: rgba(13,6,48,0.45);
          font-size: 0.62rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(139,190,178,0.45);
        }
        .ft-mode {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: var(--lime);
          font-weight: 500;
        }
        .ft-val {
          color: rgba(230,249,175,0.75);
        }
        .ft-night {
          color: var(--teal);
          font-weight: 500;
        }

        .calc {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.15);
          border-radius: 20px;
          padding: 1.5rem;
        }
        .calc-modes {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .cm {
          padding: 0.55rem 0.3rem;
          border-radius: 10px;
          border: 1px solid rgba(139,190,178,0.15);
          background: rgba(13,6,48,0.4);
          text-align: center;
          font-size: 0.7rem;
          color: rgba(139,190,178,0.6);
          cursor: pointer;
          transition: all 0.2s;
        }
        .cm.on {
          background: rgba(139,190,178,0.12);
          border-color: var(--teal);
          color: var(--teal);
        }
        .calc-row {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 0.9rem;
        }
        .calc-row label {
          font-size: 0.78rem;
          color: rgba(230,249,175,0.7);
          width: 70px;
          flex-shrink: 0;
        }
        .calc-row input[type=range] {
          flex: 1;
          accent-color: var(--teal);
        }
        .calc-row .cv {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--teal);
          width: 52px;
          text-align: right;
        }
        .night-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0;
          margin-bottom: 0.8rem;
        }
        .calc-result {
          background: rgba(230,249,175,0.07);
          border: 1px solid rgba(230,249,175,0.18);
          border-radius: 14px;
          padding: 1rem;
          text-align: center;
        }
        .cr-amt {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--lime);
          line-height: 1;
        }

        /* DRIVER CARD */
        .dcard {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.15);
          border-radius: 20px;
          padding: 1.8rem;
          position: relative;
          overflow: hidden;
        }
        .dc-big {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--lime);
          line-height: 1.45;
          margin-bottom: 0.8rem;
        }
        .dc-mr {
          font-size: 1.15rem;
          color: rgba(230,249,175,0.9);
          line-height: 1.6;
          margin-bottom: 0.5rem;
        }
        .dc-pron {
          font-size: 0.78rem;
          font-style: italic;
          color: var(--teal);
          margin-bottom: 1.2rem;
        }
        .phrase-row {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 1rem;
        }
        .phrase {
          padding: 0.45rem 1rem;
          border-radius: 100px;
          background: rgba(56,78,119,0.35);
          border: 1px solid rgba(139,190,178,0.14);
          font-size: 0.76rem;
          color: rgba(139,190,178,0.75);
          cursor: pointer;
          transition: all 0.2s;
        }
        .phrase.on {
          background: rgba(139,190,178,0.12);
          border-color: var(--teal);
          color: var(--teal);
        }

        /* EMBASSY */
        .emb-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }
        .country-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.6rem;
          margin-top: 0.9rem;
        }
        .ctry {
          padding: 0.7rem 0.4rem;
          border-radius: 12px;
          border: 1px solid rgba(139,190,178,0.13);
          background: rgba(13,6,48,0.4);
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ctry.on {
          background: rgba(139,190,178,0.1);
          border-color: var(--teal);
        }
        .emb-card {
          background: linear-gradient(145deg, rgba(56,78,119,0.4), rgba(24,49,79,0.95));
          border: 1px solid rgba(139,190,178,0.22);
          border-radius: 22px;
          padding: 1.8rem;
          position: relative;
        }

        @media(max-width: 950px) {
          .tm-hero-inner, .fare-layout, .emb-layout, .scam-grid { grid-template-columns: 1fr; }
          .tm-pipe { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── HERO + REGISTRATION ── */}
      <section className="tm-hero">
        <div className="tm-hero-glow" />
        <div className="tm-hero-inner">
          <div>
            <div className="tm-badge">✈️ Tourist Mode · Mumbai</div>
            <h1 className="tm-h1">
              Land in Mumbai.<br />
              Skip the <em>scams.</em>
            </h1>
            <p>
              Pre-load local legal night fares, bilingual Marathi driver cards, and offline verified routes so you step out of
              the airport or station with total local reassurance.
            </p>
            <div className="tm-tags">
              <span className="tm-tag">Airport T2 Shield</span>
              <span className="tm-tag">Legal Meter Rates</span>
              <span className="tm-tag">Embassy Emergency Hotlines</span>
            </div>
          </div>

          {/* Registration Card */}
          <div className="reg-card">
            <div className="reg-title">Activate Arrival Shield</div>
            <div className="reg-sub">Fill before you board your flight or train.</div>

            {isRegistered ? (
              <div className="p-4 rounded-xl bg-[#e6f9af]/10 border border-[#e6f9af]/30 text-center space-y-2">
                <span className="text-3xl">✓</span>
                <h4 className="font-bold text-[#e6f9af] text-sm">Arrival Shield Activated!</h4>
                <p className="text-xs text-[#8bbeb2]/80">
                  Pre-cached offline maps and legal fare tables ready for your stay in Mumbai.
                </p>
                <button
                  onClick={() => setIsRegistered(false)}
                  className="text-[11px] text-[#8bbeb2] underline cursor-pointer mt-2"
                >
                  Edit Information
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsRegistered(true);
                }}
              >
                <div className="arr-tabs">
                  <button
                    type="button"
                    className={`arr-tab ${arrType === 'flight' ? 'on' : ''}`}
                    onClick={() => setArrType('flight')}
                  >
                    ✈️ Flight
                  </button>
                  <button
                    type="button"
                    className={`arr-tab ${arrType === 'train' ? 'on' : ''}`}
                    onClick={() => setArrType('train')}
                  >
                    🚆 Train
                  </button>
                </div>

                <div className="tm-fr">
                  <div className="tm-fg">
                    <label className="tm-fl">{arrType === 'flight' ? 'Flight No.' : 'Train No.'}</label>
                    <input
                      className="tm-fi"
                      placeholder={arrType === 'flight' ? 'AI 191 / EK 500' : '12952 Rajdhani'}
                      value={flightNo}
                      onChange={(e) => setFlightNo(e.target.value)}
                      required
                    />
                  </div>
                  <div className="tm-fg">
                    <label className="tm-fl">Origin Country</label>
                    <select
                      className="tm-fi"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                      <option>Germany</option>
                      <option>Japan</option>
                      <option>France</option>
                      <option>Domestic / India</option>
                    </select>
                  </div>
                </div>

                <div className="tm-fg">
                  <label className="tm-fl">Hotel / Stay Area</label>
                  <input
                    className="tm-fi"
                    placeholder="e.g. Colaba, Bandra West, Powai"
                    value={hotel}
                    onChange={(e) => setHotel(e.target.value)}
                    required
                  />
                </div>

                <div className="tm-fr">
                  <div className="tm-fg">
                    <label className="tm-fl">Phone (WhatsApp)</label>
                    <input
                      className="tm-fi"
                      placeholder="+1 ..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="tm-fg">
                    <label className="tm-fl">Emergency Contact</label>
                    <input
                      className="tm-fi"
                      placeholder="+..."
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="reg-btn">
                  Activate Shield →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── 3-STEP PIPELINE ── */}
      <section className="tm-section">
        <div className="tm-wrap">
          <div className="tm-pipe">
            <div className="tm-pipe-step">
              <div className="tm-pipe-num">01</div>
              <span className="tm-pipe-icon">📋</span>
              <div className="tm-pipe-title">Pre-Trip Briefing</div>
              <div className="tm-pipe-desc">
                Know legal rates, prepaid counter locations, and terminal scam spots before your plane lands.
              </div>
            </div>
            <div className="tm-pipe-step">
              <div className="tm-pipe-num">02</div>
              <span className="tm-pipe-icon">🛡️</span>
              <div className="tm-pipe-title">Arrival Shield</div>
              <div className="tm-pipe-desc">
                One-tap legal fare meter validation and GPS deviation monitor from terminal to hotel.
              </div>
            </div>
            <div className="tm-pipe-step">
              <div className="tm-pipe-num">03</div>
              <span className="tm-pipe-icon">🗣️</span>
              <div className="tm-pipe-title">Bilingual Driver Cards</div>
              <div className="tm-pipe-desc">
                Instantly flash clear, polite Marathi &amp; English driver instructions with loud voice pronunciation.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GATEWAY SCAM RADAR ── */}
      <section className="tm-section alt">
        <div className="tm-wrap">
          <div style={{ marginBottom: '1.6rem' }}>
            <p className="text-xs font-semibold text-[#8bbeb2] uppercase tracking-widest mb-2">Transit Hub Intelligence</p>
            <h2 className="tm-h2">
              Common night scams <em>by arrival gate</em>
            </h2>
          </div>

          <div className="gw-tabs">
            <button
              className={`gw-tab ${gwTab === 'airport' ? 'on' : ''}`}
              onClick={() => setGwTab('airport')}
            >
              ✈️ Airport T2 (International)
            </button>
            <button
              className={`gw-tab ${gwTab === 'csmt' ? 'on' : ''}`}
              onClick={() => setGwTab('csmt')}
            >
              🚆 CSMT / Dadar Station
            </button>
            <button
              className={`gw-tab ${gwTab === 'gateway' ? 'on' : ''}`}
              onClick={() => setGwTab('gateway')}
            >
              🏛️ Gateway of India / Colaba
            </button>
            <button
              className={`gw-tab ${gwTab === 'bkc' ? 'on' : ''}`}
              onClick={() => setGwTab('bkc')}
            >
              🏢 BKC Business District
            </button>
          </div>

          {gwTab === 'airport' && (
            <div className="scam-grid">
              <div className="scam-card">
                <div className="scam-head">
                  <div className="scam-pt">!</div>
                  <div className="scam-name">The &quot;Prepaid Counter Closed&quot; Pitch</div>
                </div>
                <div className="scam-body">
                  <p className="scam-desc">
                    Touts approach before the official exit claiming the Mumbai Traffic Police prepaid taxi counter is closed or out of cars, offering private cabs at ₹3,000+.
                  </p>
                  <div className="alert-box">
                    <div className="alert-text">
                      <strong>NightPath Rule:</strong> The official prepaid counter inside T2 Arrivals is open 24 hours 365 days. Walk directly to Gate 2 pillar 8.
                    </div>
                  </div>
                </div>
              </div>

              <div className="scam-card">
                <div className="scam-head">
                  <div className="scam-pt">!</div>
                  <div className="scam-name">The Rigged Night Multiplier</div>
                </div>
                <div className="scam-body">
                  <p className="scam-desc">
                    Drivers claim nighttime surcharge is 100% or 200% above meter reading after 11 PM.
                  </p>
                  <div className="alert-box">
                    <div className="alert-text">
                      <strong>Legal RTA Rule:</strong> Mumbai RTA legal night surcharge is strictly <strong>+25%</strong> between 12:00 midnight and 5:00 AM only.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {gwTab === 'csmt' && (
            <div className="scam-grid">
              <div className="scam-card">
                <div className="scam-head">
                  <div className="scam-pt">!</div>
                  <div className="scam-name">The &quot;Hotel Burnt Down / Closed&quot; Scam</div>
                </div>
                <div className="scam-body">
                  <p className="scam-desc">
                    Late night cab drivers outside CSMT or Dadar claim your booked hotel in Colaba or Fort has burned down or is under police seal, diverting to an accomplice hotel.
                  </p>
                  <div className="alert-box">
                    <div className="alert-text">
                      <strong>Defense:</strong> Call your hotel directly on mobile. Never let a driver redirect your destination without talking to the front desk.
                    </div>
                  </div>
                </div>
              </div>

              <div className="scam-card">
                <div className="scam-head">
                  <div className="scam-pt">!</div>
                  <div className="scam-name">Fast Meter (Electronic Pulse)</div>
                </div>
                <div className="scam-body">
                  <p className="scam-desc">
                    A hidden steering toggle pulses the mechanical or digital meter faster than physical wheel rotation.
                  </p>
                  <div className="alert-box">
                    <div className="alert-text">
                      <strong>Defense:</strong> Use NightPath GPS Odometer screen to verify distance in real time.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {gwTab === 'gateway' && (
            <div className="scam-grid">
              <div className="scam-card">
                <div className="scam-head">
                  <div className="scam-pt">!</div>
                  <div className="scam-name">Unofficial Guide &amp; Night Heritage Touts</div>
                </div>
                <div className="scam-body">
                  <p className="scam-desc">
                    Persons without MTDC / Ministry of Tourism badges claiming special night entry behind the Gateway or exclusive boat rides.
                  </p>
                  <div className="alert-box">
                    <div className="alert-text">
                      <strong>Rule:</strong> Public access to the promenade is free until midnight. No night boat tours are authorized after 8 PM.
                    </div>
                  </div>
                </div>
              </div>

              <div className="scam-card">
                <div className="scam-head">
                  <div className="scam-pt">!</div>
                  <div className="scam-name">Inflated Midnight Auto Fare</div>
                </div>
                <div className="scam-body">
                  <p className="scam-desc">
                    Auto-rickshaws are strictly prohibited south of Bandra / Mahim. Anyone offering a rickshaw ride around Colaba is running an illegal vehicle.
                  </p>
                  <div className="alert-box">
                    <div className="alert-text">
                      <strong>Notice:</strong> Only Premier Padmini / Santro Black-and-Yellow cabs operate in South Mumbai.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {gwTab === 'bkc' && (
            <div className="scam-grid">
              <div className="scam-card">
                <div className="scam-head">
                  <div className="scam-pt">!</div>
                  <div className="scam-name">Private Executive Shuttles</div>
                </div>
                <div className="scam-body">
                  <p className="scam-desc">
                    Unmarked sedans posing as hotel luxury transport charging ₹1,500 for a 3 km ride to Bandra station.
                  </p>
                  <div className="alert-box">
                    <div className="alert-text">
                      <strong>Rule:</strong> Metred cool-cabs from BKC Diamond Bourse cost under ₹120 to Bandra station.
                    </div>
                  </div>
                </div>
              </div>

              <div className="scam-card">
                <div className="scam-head">
                  <div className="scam-pt">!</div>
                  <div className="scam-name">Toll Surcharge Double-Charging</div>
                </div>
                <div className="scam-body">
                  <p className="scam-desc">
                    Charging tourists both Bandra-Worli Sea Link toll and an imaginary BKC municipal entry tax.
                  </p>
                  <div className="alert-box">
                    <div className="alert-text">
                      <strong>Rule:</strong> There is no municipal entry tax in BKC. Sea link one-way toll is fixed at ₹85.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── LEGAL FARE CALCULATOR ── */}
      <section className="tm-section">
        <div className="tm-wrap">
          <div style={{ marginBottom: '1.6rem' }}>
            <p className="text-xs font-semibold text-[#8bbeb2] uppercase tracking-widest mb-2">Fair Pricing Engine</p>
            <h2 className="tm-h2">
              Mumbai legal <em>night fare verifier</em>
            </h2>
          </div>

          <div className="fare-layout">
            <div className="fare-table">
              <div className="ft-row ft-head">
                <span>Vehicle Mode</span>
                <span>Base (1.5 km)</span>
                <span>Per KM</span>
                <span>Night Rate (+25%)</span>
              </div>
              <div className="ft-row">
                <div className="ft-mode">🛺 Auto-Rickshaw</div>
                <div className="ft-val">₹23</div>
                <div className="ft-val">₹15.33 / km</div>
                <div className="ft-night">₹28.75 base</div>
              </div>
              <div className="ft-row">
                <div className="ft-mode">🚖 Black &amp; Yellow Cab</div>
                <div className="ft-val">₹28</div>
                <div className="ft-val">₹18.66 / km</div>
                <div className="ft-night">₹35.00 base</div>
              </div>
              <div className="ft-row">
                <div className="ft-mode">❄️ Cool Cab (AC)</div>
                <div className="ft-val">₹33</div>
                <div className="ft-val">₹22.00 / km</div>
                <div className="ft-night">₹41.25 base</div>
              </div>
            </div>

            {/* Interactive Calculator */}
            <div className="calc">
              <div className="calc-modes">
                <div
                  className={`cm ${calcMode === 'auto' ? 'on' : ''}`}
                  onClick={() => setCalcMode('auto')}
                >
                  <span>🛺</span>Auto
                </div>
                <div
                  className={`cm ${calcMode === 'taxi' ? 'on' : ''}`}
                  onClick={() => setCalcMode('taxi')}
                >
                  <span>🚖</span>Cab
                </div>
                <div
                  className={`cm ${calcMode === 'ac' ? 'on' : ''}`}
                  onClick={() => setCalcMode('ac')}
                >
                  <span>❄️</span>AC Cab
                </div>
              </div>

              <div className="calc-row">
                <label>Distance</label>
                <input
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(+e.target.value)}
                />
                <span className="cv">{distanceKm} km</span>
              </div>

              <div className="night-row">
                <span className="text-xs text-[#8bbeb2]">Night Surcharge (12 AM – 5 AM)</span>
                <input
                  type="checkbox"
                  checked={isNightSurcharge}
                  onChange={(e) => setIsNightSurcharge(e.target.checked)}
                  className="accent-[#8bbeb2] w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="calc-result">
                <div className="text-[10px] text-[#8bbeb2]/60 uppercase tracking-widest mb-1">Legal Meter Fare</div>
                <div className="cr-amt">₹{displayFare}</div>
                <div className="text-[11px] text-[#8bbeb2]/50 mt-1">Official Mumbai RTA Gazette Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DRIVER FLASH CARDS ── */}
      <section className="tm-section alt">
        <div className="tm-wrap">
          <div style={{ marginBottom: '1.6rem' }}>
            <p className="text-xs font-semibold text-[#8bbeb2] uppercase tracking-widest mb-2">Language Bridge</p>
            <h2 className="tm-h2">
              Show this to <em>your driver</em>
            </h2>
          </div>

          <div className="dcard">
            <div className="text-[11px] font-bold text-[#8bbeb2] uppercase tracking-widest mb-2">English</div>
            <div className="dc-big">&quot;{driverPhrases[activePhrase].en}&quot;</div>

            <div className="text-[11px] font-bold text-[#e6f9af] uppercase tracking-widest mt-4 mb-2">मराठी (Marathi)</div>
            <div className="dc-mr">&quot;{driverPhrases[activePhrase].mr}&quot;</div>
            <div className="dc-pron">Pronunciation: {driverPhrases[activePhrase].pron}</div>

            <div className="phrase-row">
              {driverPhrases.map((_, i) => (
                <button
                  key={i}
                  className={`phrase ${activePhrase === i ? 'on' : ''}`}
                  onClick={() => setActivePhrase(i)}
                >
                  Phrase {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EMBASSY DIRECTORY ── */}
      <section className="tm-section">
        <div className="tm-wrap">
          <div style={{ marginBottom: '1.6rem' }}>
            <p className="text-xs font-semibold text-[#8bbeb2] uppercase tracking-widest mb-2">Diplomatic Assistance</p>
            <h2 className="tm-h2">
              Consulate <em>emergency directory</em>
            </h2>
          </div>

          <div className="emb-layout">
            <div className="p-6 rounded-2xl bg-[#18314f] border border-[#8bbeb2]/15">
              <div className="text-xs font-bold text-[#e6f9af]">Select Your Home Country</div>
              <div className="country-grid">
                {Object.keys(embassyData).map((k) => (
                  <div
                    key={k}
                    className={`ctry ${selectedEmbassy === k ? 'on' : ''}`}
                    onClick={() => setSelectedEmbassy(k)}
                  >
                    <span>{embassyData[k].flag}</span>
                    <div>{embassyData[k].country}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="emb-card">
              <div className="text-3xl mb-2">{currentEmb.flag}</div>
              <h3 className="font-serif text-lg font-bold text-[#e6f9af]">{currentEmb.name}</h3>
              <p className="text-xs text-[#8bbeb2]/70 mb-4">{currentEmb.loc}</p>

              <div className="space-y-2 text-xs border-t border-[#8bbeb2]/15 pt-3">
                <div className="flex justify-between">
                  <span className="text-[#8bbeb2]/60">Standard Phone:</span>
                  <span className="text-[#e6f9af] font-mono">{currentEmb.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-400 font-bold">24/7 Citizen Emergency:</span>
                  <span className="text-[#e6f9af] font-mono font-bold">{currentEmb.emergency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8bbeb2]/60">Hours:</span>
                  <span className="text-[#8bbeb2]">{currentEmb.hours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOS BUTTON ── */}
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <button
          onClick={onOpenSOS}
          className="px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
        >
          🚨 Launch Mumbai Emergency SOS Modal
        </button>
      </div>
    </div>
  );
}
