import React, { useState, useEffect } from 'react';

export default function LandingPage({ onLaunchPlanner, onNavigate }) {
  const [activeFactorWidths, setActiveFactorWidths] = useState({
    light: '87%',
    crowd: '91%',
    shops: '74%',
    time: '78%',
    reports: '95%'
  });

  return (
    <div className="landing-page-root text-[#e6f9af] min-h-screen bg-[#0d0630]">
      <style>{`
        .landing-page-root {
          --deep: #0d0630;
          --navy: #18314f;
          --slate: #384e77;
          --teal: #8bbeb2;
          --lime: #e6f9af;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .lp-hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 8rem 3rem 4rem;
          position: relative;
          overflow: hidden;
        }
        .lp-hero-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(139,190,178,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,190,178,0.05) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }
        .lp-hero-skyline {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 220px;
          pointer-events: none;
          z-index: 1;
        }
        .lp-hero-glow {
          position: absolute;
          top: 5%;
          right: -5%;
          width: 650px;
          height: 650px;
          background: radial-gradient(ellipse, rgba(56,78,119,0.55) 0%, transparent 60%);
          pointer-events: none;
          animation: lpPulse 7s ease-in-out infinite alternate;
        }
        .lp-hero-glow2 {
          position: absolute;
          bottom: -15%;
          left: -5%;
          width: 450px;
          height: 450px;
          background: radial-gradient(ellipse, rgba(139,190,178,0.1) 0%, transparent 60%);
          pointer-events: none;
          animation: lpPulse 9s ease-in-out infinite alternate-reverse;
        }
        @keyframes lpPulse {
          from { transform: scale(1); opacity: 0.7; }
          to { transform: scale(1.1); opacity: 1; }
        }
        .lp-hero-inner {
          position: relative;
          z-index: 2;
          max-width: 660px;
        }
        .lp-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(56,78,119,0.5);
          border: 1px solid rgba(139,190,178,0.25);
          color: var(--teal);
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.4rem 1rem;
          border-radius: 100px;
          margin-bottom: 2rem;
        }
        .lp-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--lime);
          animation: lpBlink 2s ease infinite;
        }
        @keyframes lpBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .lp-h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3rem, 5.8vw, 5.2rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.025em;
          color: var(--lime);
          margin-bottom: 1.6rem;
        }
        .lp-h1 em {
          font-style: italic;
          color: var(--teal);
        }
        .lp-hero-sub {
          font-size: 1.1rem;
          font-weight: 300;
          line-height: 1.75;
          color: rgba(230,249,175,0.68);
          max-width: 500px;
          margin-bottom: 2.8rem;
        }
        .lp-hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .lp-btn-primary {
          background: var(--lime);
          color: var(--deep);
          padding: 0.9rem 2.2rem;
          border: none;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .lp-btn-primary:hover {
          background: var(--teal);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(139,190,178,0.25);
        }
        .lp-btn-secondary {
          background: transparent;
          color: var(--teal);
          padding: 0.9rem 2.2rem;
          border: 1px solid rgba(139,190,178,0.35);
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 400;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        .lp-btn-secondary:hover {
          border-color: var(--teal);
          background: rgba(139,190,178,0.08);
        }

        /* ── HERO FLOAT CARDS ── */
        .lp-hero-float {
          position: absolute;
          right: 4%;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          z-index: 2;
          width: 320px;
        }
        .lp-route-card {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.18);
          border-radius: 20px;
          padding: 1.3rem 1.4rem;
          backdrop-filter: blur(16px);
          box-shadow: 0 20px 60px rgba(13,6,48,0.7);
          transition: transform 0.25s, border-color 0.25s;
        }
        .lp-route-card:hover {
          transform: translateY(-3px);
          border-color: rgba(139,190,178,0.35);
        }
        .rc-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.8rem;
        }
        .rc-label {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
        }
        .label-best {
          background: rgba(230,249,175,0.15);
          color: var(--lime);
          border: 1px solid rgba(230,249,175,0.3);
        }
        .label-fastest {
          background: rgba(56,78,119,0.5);
          color: rgba(139,190,178,0.7);
          border: 1px solid rgba(139,190,178,0.15);
        }
        .label-lit {
          background: rgba(139,190,178,0.15);
          color: var(--teal);
          border: 1px solid rgba(139,190,178,0.3);
        }
        .rc-score {
          font-family: 'Playfair Display', serif;
          font-size: 1.7rem;
          font-weight: 900;
          line-height: 1;
        }
        .score-green { color: var(--lime); }
        .score-muted { color: rgba(139,190,178,0.4); }
        .score-teal { color: var(--teal); }
        .rc-bar-wrap {
          height: 4px;
          background: rgba(13,6,48,0.5);
          border-radius: 100px;
          margin-bottom: 0.9rem;
          overflow: hidden;
        }
        .rc-bar {
          height: 100%;
          border-radius: 100px;
        }
        .bar-lime { background: linear-gradient(90deg, var(--teal), var(--lime)); }
        .bar-slate { background: rgba(56,78,119,0.8); }
        .bar-teal { background: var(--teal); }
        .rc-pills {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .rc-pill {
          font-size: 0.65rem;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          background: rgba(13,6,48,0.4);
          border: 1px solid rgba(139,190,178,0.12);
          color: rgba(139,190,178,0.7);
        }
        .pill-lit { border-color: rgba(230,249,175,0.25); color: var(--lime); }
        .pill-crowd { border-color: rgba(139,190,178,0.25); color: var(--teal); }
        .rc-time {
          font-size: 0.72rem;
          color: rgba(139,190,178,0.45);
          margin-top: 0.6rem;
        }

        /* ── SECTIONS ── */
        .lp-section-wide {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .lp-section-label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--teal);
          margin-bottom: 0.7rem;
        }
        .lp-h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 3.8vw, 3rem);
          font-weight: 700;
          color: var(--lime);
          line-height: 1.15;
          margin-bottom: 0.9rem;
        }
        .lp-h2 em {
          font-style: italic;
          color: var(--teal);
        }

        /* ── ROUTE COMPARE ── */
        .route-section {
          padding: 6rem 3rem;
          background: var(--navy);
          border-top: 1px solid rgba(139,190,178,0.08);
          border-bottom: 1px solid rgba(139,190,178,0.08);
        }
        .compare-wrap {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 3rem;
        }
        .compare-card {
          background: rgba(13,6,48,0.5);
          border: 1px solid rgba(139,190,178,0.12);
          border-radius: 22px;
          padding: 2rem;
          position: relative;
          transition: transform 0.25s, border-color 0.25s;
        }
        .compare-card:hover {
          transform: translateY(-4px);
          border-color: rgba(139,190,178,0.3);
        }
        .compare-card.best {
          background: rgba(24,49,79,0.7);
          border-color: rgba(139,190,178,0.35);
          box-shadow: 0 16px 50px rgba(13,6,48,0.5);
        }
        .best-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--lime);
          color: var(--deep);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.25rem 0.9rem;
          border-radius: 100px;
        }
        .cc-type {
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(139,190,178,0.5);
          margin-bottom: 0.4rem;
        }
        .cc-time {
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem;
          font-weight: 900;
          color: var(--lime);
          line-height: 1;
        }
        .cc-longer {
          font-size: 0.75rem;
          color: rgba(139,190,178,0.45);
          margin-top: 0.3rem;
          margin-bottom: 1.5rem;
        }
        .cc-metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.55rem 0;
          border-bottom: 1px solid rgba(139,190,178,0.06);
          font-size: 0.8rem;
        }
        .cc-metric:last-of-type { border-bottom: none; }
        .cc-metric-key { color: rgba(139,190,178,0.6); }
        .cc-metric-val { font-weight: 500; }
        .val-good { color: var(--lime); }
        .val-mid { color: var(--teal); }
        .val-bad { color: rgba(139,190,178,0.45); }
        .cc-bars {
          margin-top: 1.3rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .cc-bar-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.7rem;
          color: rgba(139,190,178,0.45);
        }
        .cc-bar-track {
          flex: 1;
          height: 4px;
          background: rgba(13,6,48,0.7);
          border-radius: 100px;
          overflow: hidden;
        }
        .cc-bar-fill {
          height: 100%;
          border-radius: 100px;
        }
        .fill-lime { background: var(--lime); }
        .fill-teal { background: var(--teal); }
        .fill-low { background: rgba(56,78,119,0.8); }

        /* ── HOW IT WORKS STEPS ── */
        .how-section {
          padding: 6rem 3rem;
          background: var(--deep);
        }
        .how-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-top: 3.5rem;
          position: relative;
        }
        .step {
          background: rgba(24,49,79,0.35);
          border: 1px solid rgba(139,190,178,0.12);
          border-radius: 20px;
          padding: 1.8rem;
          position: relative;
          transition: transform 0.25s, border-color 0.25s;
        }
        .step:hover {
          transform: translateY(-4px);
          border-color: rgba(139,190,178,0.3);
        }
        .step-num {
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem;
          font-weight: 900;
          color: rgba(139,190,178,0.12);
          line-height: 1;
          margin-bottom: 0.8rem;
        }
        .step-icon {
          font-size: 1.8rem;
          margin-bottom: 0.9rem;
          display: block;
        }
        .step h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--lime);
          margin-bottom: 0.6rem;
        }
        .step p {
          font-size: 0.82rem;
          color: rgba(230,249,175,0.55);
          line-height: 1.7;
          font-weight: 300;
        }

        /* ── LIVE SCORE DEMO ── */
        .demo-section {
          padding: 6rem 3rem;
          background: var(--slate);
          position: relative;
          overflow: hidden;
        }
        .demo-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(139,190,178,0.06) 1.5px, transparent 1.5px);
          background-size: 30px 30px;
        }
        .demo-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3.5rem;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        .demo-map {
          background: var(--deep);
          border: 1px solid rgba(139,190,178,0.2);
          border-radius: 24px;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 24px 70px rgba(13,6,48,0.6);
        }
        .map-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(139,190,178,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,190,178,0.05) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .map-inner {
          position: relative;
          height: 300px;
          z-index: 2;
        }
        .route-line {
          position: absolute;
          height: 3px;
          border-radius: 100px;
        }
        .rl-fast {
          top: 45%;
          left: 10%;
          width: 80%;
          background: rgba(139,190,178,0.25);
          border-style: dashed;
        }
        .rl-best {
          top: 50%;
          left: 10%;
          width: 80%;
          background: linear-gradient(90deg, var(--teal), var(--lime));
          height: 4px;
          box-shadow: 0 0 14px rgba(230,249,175,0.4);
        }
        .rl-dark {
          top: 62%;
          left: 10%;
          width: 80%;
          background: rgba(56,78,119,0.5);
        }
        .poi {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .poi-lit {
          background: var(--lime);
          box-shadow: 0 0 10px rgba(230,249,175,0.7);
        }
        .poi-shop {
          background: var(--teal);
          box-shadow: 0 0 8px rgba(139,190,178,0.7);
        }
        .poi-dark {
          background: rgba(56,78,119,0.9);
          border: 1px solid rgba(139,190,178,0.2);
        }
        .pin {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.9rem;
        }
        .pin-label {
          font-size: 0.65rem;
          background: rgba(13,6,48,0.85);
          border: 1px solid rgba(139,190,178,0.3);
          border-radius: 6px;
          padding: 0.15rem 0.5rem;
          color: var(--lime);
          font-weight: 500;
        }
        .map-legend {
          display: flex;
          gap: 1.2rem;
          margin-top: 1.2rem;
          flex-wrap: wrap;
          font-size: 0.72rem;
          color: rgba(139,190,178,0.6);
        }
        .leg-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .leg-line {
          width: 16px;
          height: 3px;
          border-radius: 2px;
        }
        .leg-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        /* ── SCORE BREAKDOWN ── */
        .score-panel {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .score-panel p {
          font-size: 0.94rem;
          font-weight: 300;
          color: rgba(230,249,175,0.6);
          line-height: 1.75;
        }
        .factor-list {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          margin-top: 0.5rem;
        }
        .factor {
          background: rgba(13,6,48,0.45);
          border: 1px solid rgba(139,190,178,0.12);
          border-radius: 14px;
          padding: 0.9rem 1.1rem;
        }
        .factor-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.45rem;
        }
        .factor-name {
          font-size: 0.82rem;
          color: var(--lime);
          font-weight: 500;
        }
        .factor-score {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 700;
        }
        .fs-high { color: var(--lime); }
        .fs-mid { color: var(--teal); }
        .factor-bar {
          height: 4px;
          background: rgba(13,6,48,0.6);
          border-radius: 100px;
          overflow: hidden;
          margin-bottom: 0.35rem;
        }
        .factor-fill {
          height: 100%;
          border-radius: 100px;
          transition: width 0.8s ease;
        }
        .factor-note {
          font-size: 0.68rem;
          color: rgba(139,190,178,0.45);
        }

        /* ── FEATURES GRID ── */
        .features-section {
          padding: 6rem 3rem;
          background: var(--navy);
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 3rem;
        }
        .feat-card {
          background: rgba(13,6,48,0.45);
          border: 1px solid rgba(139,190,178,0.12);
          border-radius: 20px;
          padding: 1.8rem;
          position: relative;
          transition: transform 0.25s, border-color 0.25s;
        }
        .feat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(139,190,178,0.3);
        }
        .feat-icon {
          font-size: 1.9rem;
          display: block;
          margin-bottom: 0.9rem;
        }
        .feat-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--lime);
          margin-bottom: 0.5rem;
        }
        .feat-desc {
          font-size: 0.82rem;
          color: rgba(139,190,178,0.6);
          line-height: 1.7;
          font-weight: 300;
          margin-bottom: 1rem;
        }
        .feat-tag {
          display: inline-block;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.2rem 0.65rem;
          border-radius: 100px;
          background: rgba(139,190,178,0.1);
          color: var(--teal);
          border: 1px solid rgba(139,190,178,0.2);
        }

        /* ── WHO IS IT FOR ── */
        .audience-section {
          padding: 6rem 3rem;
          background: var(--deep);
        }
        .audience-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.6rem;
          margin-top: 3.5rem;
        }
        .aud-card {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.14);
          border-radius: 22px;
          padding: 2.2rem;
          transition: transform 0.25s, border-color 0.25s;
          display: flex;
          flex-direction: column;
        }
        .aud-card:hover {
          transform: translateY(-4px);
          border-color: rgba(139,190,178,0.35);
        }
        .aud-icon {
          font-size: 2.2rem;
          margin-bottom: 1.2rem;
          display: block;
        }
        .aud-sub {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--teal);
          margin-bottom: 0.4rem;
        }
        .aud-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--lime);
          margin-bottom: 0.8rem;
          line-height: 1.25;
        }
        .aud-desc {
          font-size: 0.84rem;
          color: rgba(230,249,175,0.6);
          line-height: 1.75;
          font-weight: 300;
          margin-bottom: 1.6rem;
        }
        .aud-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-top: auto;
        }
        .aud-item {
          font-size: 0.78rem;
          color: rgba(139,190,178,0.7);
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .aud-item::before {
          content: '✓';
          color: var(--teal);
          font-weight: 700;
        }

        /* ── STATS ── */
        .stats-section {
          padding: 4.5rem 3rem;
          background: var(--slate);
          border-top: 1px solid rgba(139,190,178,0.1);
          border-bottom: 1px solid rgba(139,190,178,0.1);
        }
        .stats-grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          text-align: center;
        }
        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 3.2rem;
          font-weight: 900;
          color: var(--lime);
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .stat-label {
          font-size: 0.78rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(139,190,178,0.6);
        }

        /* ── PRICING ── */
        .pricing-section {
          padding: 6rem 3rem;
          background: var(--deep);
        }
        .pricing-grid {
          max-width: 1100px;
          margin: 3rem auto 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.6rem;
          align-items: center;
        }
        .price-card {
          background: var(--navy);
          border: 1px solid rgba(139,190,178,0.14);
          border-radius: 24px;
          padding: 2.2rem;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: transform 0.25s, border-color 0.25s;
        }
        .price-card:hover {
          transform: translateY(-4px);
          border-color: rgba(139,190,178,0.35);
        }
        .price-card.featured {
          border-color: var(--teal);
          background: linear-gradient(180deg, rgba(56,78,119,0.35), var(--navy));
          transform: scale(1.04);
          box-shadow: 0 20px 60px rgba(13,6,48,0.6);
        }
        .price-card.featured:hover {
          transform: scale(1.04) translateY(-4px);
        }
        .price-popular {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--lime);
          color: var(--deep);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.25rem 0.9rem;
          border-radius: 100px;
        }
        .price-tier {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--teal);
          margin-bottom: 0.3rem;
        }
        .price-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--lime);
          margin-bottom: 1.1rem;
        }
        .price-amount {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          font-weight: 900;
          color: var(--lime);
          line-height: 1;
        }
        .price-amount span {
          font-size: 1rem;
          font-weight: 400;
          color: rgba(139,190,178,0.5);
          font-family: 'DM Sans', sans-serif;
        }
        .price-period {
          font-size: 0.74rem;
          color: rgba(139,190,178,0.5);
          margin-top: 0.3rem;
          margin-bottom: 1.6rem;
        }
        .price-divider {
          border: none;
          border-top: 1px solid rgba(139,190,178,0.1);
          margin-bottom: 1.6rem;
        }
        .price-features {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-bottom: 2rem;
        }
        .pf-item {
          font-size: 0.78rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .pf-yes { color: rgba(230,249,175,0.85); }
        .pf-yes::before { content: '✓'; color: var(--teal); font-weight: 700; }
        .pf-no { color: rgba(139,190,178,0.3); }
        .pf-no::before { content: '✕'; color: rgba(139,190,178,0.25); }

        /* ── CTA ── */
        .cta-section {
          padding: 6rem 3rem;
          background: linear-gradient(135deg, rgba(56,78,119,0.3), var(--navy));
          border-top: 1px solid rgba(139,190,178,0.1);
        }
        .cta-inner {
          max-width: 660px;
          margin: 0 auto;
          text-align: center;
        }
        .cta-inner p {
          font-size: 1.05rem;
          font-weight: 300;
          color: rgba(230,249,175,0.68);
          line-height: 1.75;
          margin: 1.2rem auto 2.4rem;
        }
        .cta-btns {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .cta-note {
          font-size: 0.72rem;
          color: rgba(139,190,178,0.4);
          margin-top: 1.2rem;
        }

        /* ── FOOTER ── */
        .lp-footer {
          background: var(--deep);
          border-top: 1px solid rgba(139,190,178,0.1);
          padding: 3rem 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .footer-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 900;
          font-style: italic;
          color: var(--lime);
        }
        .footer-logo span { color: var(--teal); }
        .footer-links {
          display: flex;
          gap: 2rem;
          list-style: none;
        }
        .footer-links button {
          background: none;
          border: none;
          color: rgba(139,190,178,0.55);
          font-size: 0.82rem;
          cursor: pointer;
          transition: color 0.2s;
        }
        .footer-links button:hover { color: var(--lime); }
        .footer-copy {
          font-size: 0.75rem;
          color: rgba(139,190,178,0.3);
        }

        @media(max-width: 1024px) {
          .lp-hero-float { display: none; }
          .compare-wrap, .how-steps, .features-grid, .audience-grid, .pricing-grid, .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .demo-inner { grid-template-columns: 1fr; }
          .price-card.featured { transform: none; }
        }
        @media(max-width: 640px) {
          .compare-wrap, .how-steps, .features-grid, .audience-grid, .pricing-grid, .stats-grid {
            grid-template-columns: 1fr;
          }
          .lp-footer { flex-direction: column; text-align: center; }
          .footer-links { flex-direction: column; gap: 0.8rem; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className="lp-hero-bg-grid" />
        <div className="lp-hero-glow" />
        <div className="lp-hero-glow2" />

        {/* Minimal SVG skyline silhouette */}
        <svg
          className="lp-hero-skyline"
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,220 L0,160 L60,160 L60,120 L80,120 L80,100 L100,100 L100,120 L130,120 L130,80 L150,80 L150,60 L170,60 L170,80 L200,80 L200,140 L230,140 L230,100 L250,100 L250,70 L270,70 L270,100 L300,100 L300,130 L340,130 L340,90 L360,90 L360,60 L380,60 L380,90 L420,90 L420,150 L460,150 L460,110 L480,110 L480,80 L500,80 L500,110 L540,110 L540,130 L580,130 L580,70 L600,70 L600,50 L620,50 L620,70 L660,70 L660,140 L700,140 L700,100 L720,100 L720,75 L740,75 L740,100 L780,100 L780,120 L820,120 L820,85 L840,85 L840,65 L860,65 L860,85 L900,85 L900,150 L940,150 L940,110 L960,110 L960,80 L980,80 L980,110 L1020,110 L1020,130 L1060,130 L1060,90 L1080,90 L1080,70 L1100,70 L1100,90 L1140,90 L1140,145 L1180,145 L1180,105 L1200,105 L1200,80 L1220,80 L1220,105 L1260,105 L1260,125 L1300,125 L1300,95 L1340,95 L1340,145 L1380,145 L1380,160 L1440,160 L1440,220 Z"
            fill="rgba(24,49,79,0.5)"
          />
          {/* Window lights */}
          <rect x="155" y="65" width="8" height="6" fill="rgba(230,249,175,0.25)" rx="1" />
          <rect x="165" y="65" width="8" height="6" fill="rgba(139,190,178,0.3)" rx="1" />
          <rect x="362" y="65" width="7" height="5" fill="rgba(230,249,175,0.2)" rx="1" />
          <rect x="372" y="65" width="7" height="5" fill="rgba(230,249,175,0.2)" rx="1" />
          <rect x="603" y="56" width="8" height="6" fill="rgba(139,190,178,0.35)" rx="1" />
          <rect x="613" y="56" width="8" height="6" fill="rgba(230,249,175,0.25)" rx="1" />
          <rect x="843" y="70" width="8" height="6" fill="rgba(139,190,178,0.3)" rx="1" />
          <rect x="1083" y="74" width="7" height="5" fill="rgba(230,249,175,0.2)" rx="1" />
        </svg>

        <div className="lp-hero-inner">
          <div className="lp-hero-badge">
            <span className="lp-badge-dot" />
            Mumbai · Live Night Routing
          </div>
          <h1 className="lp-h1">
            The fastest route<br />
            isn&apos;t always the<br />
            <em>right route.</em>
          </h1>
          <p className="lp-hero-sub">
            NightPath re-scores every route using street lighting, crowd presence, open shops, and real-time community
            data — so you get home safely, not just quickly.
          </p>
          <div className="lp-hero-actions">
            <button
              onClick={() => onLaunchPlanner ? onLaunchPlanner() : onNavigate && onNavigate('planner')}
              className="lp-btn-primary"
            >
              🌙 Plan a Safe Route
            </button>
            <button
              onClick={() => onNavigate && onNavigate('howItWorks')}
              className="lp-btn-secondary"
            >
              See How It Works
            </button>
          </div>
        </div>

        {/* HERO ROUTE SCORE FLOATING CARDS */}
        <div className="lp-hero-float">
          {/* Card 1: Best Route */}
          <div className="lp-route-card">
            <div className="rc-top">
              <span className="rc-label label-best">✦ Best Route</span>
              <span className="rc-score score-green">
                9.2<span style={{ fontSize: '0.9rem', opacity: 0.5 }}>/10</span>
              </span>
            </div>
            <div className="rc-bar-wrap">
              <div className="rc-bar bar-lime" style={{ width: '92%' }} />
            </div>
            <div className="rc-pills">
              <span className="rc-pill pill-lit">3× Lighting</span>
              <span className="rc-pill pill-crowd">High Footfall</span>
              <span className="rc-pill pill-shop">4 Open Shops</span>
            </div>
            <div className="rc-time">🕙 10:47 PM · +6 min vs fastest</div>
          </div>

          {/* Card 2: Fastest */}
          <div className="lp-route-card">
            <div className="rc-top">
              <span className="rc-label label-fastest">⚡ Fastest</span>
              <span className="rc-score score-muted">
                4.1<span style={{ fontSize: '0.9rem', opacity: 0.5 }}>/10</span>
              </span>
            </div>
            <div className="rc-bar-wrap">
              <div className="rc-bar bar-slate" style={{ width: '41%' }} />
            </div>
            <div className="rc-pills">
              <span className="rc-pill" style={{ opacity: 0.5 }}>No Lighting</span>
              <span className="rc-pill" style={{ opacity: 0.5 }}>Low Footfall</span>
            </div>
            <div className="rc-time">🕙 10:47 PM · Saves 6 min</div>
          </div>

          {/* Card 3: Via Main Road */}
          <div className="lp-route-card">
            <div className="rc-top">
              <span className="rc-label label-lit">🏙️ Via Main Road</span>
              <span className="rc-score score-teal">
                7.4<span style={{ fontSize: '0.9rem', opacity: 0.5 }}>/10</span>
              </span>
            </div>
            <div className="rc-bar-wrap">
              <div className="rc-bar bar-teal" style={{ width: '74%' }} />
            </div>
            <div className="rc-pills">
              <span className="rc-pill pill-lit">Good Lighting</span>
              <span className="rc-pill pill-shop">2 Open Shops</span>
            </div>
            <div className="rc-time">🕙 10:47 PM · +2 min vs fastest</div>
          </div>
        </div>
      </section>

      {/* ── ROUTE COMPARE ── */}
      <section className="route-section" id="features">
        <div className="lp-section-wide">
          <div style={{ marginBottom: '1rem' }}>
            <p className="lp-section-label">Route Intelligence</p>
            <h2 className="lp-h2">
              Same start. Same destination.<br />
              <em>Very different journeys.</em>
            </h2>
            <p style={{ fontSize: '0.92rem', fontWeight: 300, color: 'rgba(139,190,178,0.55)', maxWidth: '520px', marginTop: '0.5rem' }}>
              A 6-minute time difference could mean passing through an unlit service lane versus a route past three 24-hour shops and two bus stops. NightPath shows you both — with full transparency.
            </p>
          </div>

          <div className="compare-wrap">
            {/* Fastest Route */}
            <div className="compare-card">
              <div className="cc-type">⚡ Fastest Route</div>
              <div className="cc-time">18 min</div>
              <div className="cc-longer">Baseline</div>
              <div className="cc-metric">
                <span className="cc-metric-key">Safety Score</span>
                <span className="cc-metric-val val-bad">4.1 / 10</span>
              </div>
              <div className="cc-metric">
                <span className="cc-metric-key">Street Lighting</span>
                <span className="cc-metric-val val-bad">12%</span>
              </div>
              <div className="cc-metric">
                <span className="cc-metric-key">Footfall</span>
                <span className="cc-metric-val val-bad">Low</span>
              </div>
              <div className="cc-metric">
                <span className="cc-metric-key">Open Shops</span>
                <span className="cc-metric-val val-bad">0</span>
              </div>
              <div className="cc-metric">
                <span className="cc-metric-key">Isolated Stretches</span>
                <span className="cc-metric-val val-bad">2 sections</span>
              </div>
              <div className="cc-bars">
                <div className="cc-bar-row">
                  💡 Lit
                  <div className="cc-bar-track">
                    <div className="cc-bar-fill fill-low" style={{ width: '12%' }} />
                  </div>
                </div>
                <div className="cc-bar-row">
                  👥 Crowd
                  <div className="cc-bar-track">
                    <div className="cc-bar-fill fill-low" style={{ width: '18%' }} />
                  </div>
                </div>
                <div className="cc-bar-row">
                  🏪 Shops
                  <div className="cc-bar-track">
                    <div className="cc-bar-fill fill-low" style={{ width: '5%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* NightPath Pick (Best) */}
            <div className="compare-card best">
              <span className="best-badge">NightPath Pick</span>
              <div className="cc-type" style={{ color: 'var(--teal)' }}>✦ Best Route</div>
              <div className="cc-time">24 min</div>
              <div className="cc-longer">+6 min · Worth it.</div>
              <div className="cc-metric">
                <span className="cc-metric-key">Safety Score</span>
                <span className="cc-metric-val val-good">9.2 / 10</span>
              </div>
              <div className="cc-metric">
                <span className="cc-metric-key">Street Lighting</span>
                <span className="cc-metric-val val-good">87%</span>
              </div>
              <div className="cc-metric">
                <span className="cc-metric-key">Footfall</span>
                <span className="cc-metric-val val-good">High</span>
              </div>
              <div className="cc-metric">
                <span className="cc-metric-key">Open Shops</span>
                <span className="cc-metric-val val-good">4 shops</span>
              </div>
              <div className="cc-metric">
                <span className="cc-metric-key">Isolated Stretches</span>
                <span className="cc-metric-val val-good">None</span>
              </div>
              <div className="cc-bars">
                <div className="cc-bar-row">
                  💡 Lit
                  <div className="cc-bar-track">
                    <div className="cc-bar-fill fill-lime" style={{ width: '87%' }} />
                  </div>
                </div>
                <div className="cc-bar-row">
                  👥 Crowd
                  <div className="cc-bar-track">
                    <div className="cc-bar-fill fill-lime" style={{ width: '82%' }} />
                  </div>
                </div>
                <div className="cc-bar-row">
                  🏪 Shops
                  <div className="cc-bar-track">
                    <div className="cc-bar-fill fill-teal" style={{ width: '74%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Via Main Road */}
            <div className="compare-card">
              <div className="cc-type">🏙️ Via Main Road</div>
              <div className="cc-time">20 min</div>
              <div className="cc-longer">+2 min</div>
              <div className="cc-metric">
                <span className="cc-metric-key">Safety Score</span>
                <span className="cc-metric-val val-mid">7.4 / 10</span>
              </div>
              <div className="cc-metric">
                <span className="cc-metric-key">Street Lighting</span>
                <span className="cc-metric-val val-mid">62%</span>
              </div>
              <div className="cc-metric">
                <span className="cc-metric-key">Footfall</span>
                <span className="cc-metric-val val-mid">Medium</span>
              </div>
              <div className="cc-metric">
                <span className="cc-metric-key">Open Shops</span>
                <span className="cc-metric-val val-mid">2 shops</span>
              </div>
              <div className="cc-metric">
                <span className="cc-metric-key">Isolated Stretches</span>
                <span className="cc-metric-val val-mid">1 section</span>
              </div>
              <div className="cc-bars">
                <div className="cc-bar-row">
                  💡 Lit
                  <div className="cc-bar-track">
                    <div className="cc-bar-fill fill-teal" style={{ width: '62%' }} />
                  </div>
                </div>
                <div className="cc-bar-row">
                  👥 Crowd
                  <div className="cc-bar-track">
                    <div className="cc-bar-fill fill-teal" style={{ width: '55%' }} />
                  </div>
                </div>
                <div className="cc-bar-row">
                  🏪 Shops
                  <div className="cc-bar-track">
                    <div className="cc-bar-fill fill-teal" style={{ width: '40%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS STEPS ── */}
      <section className="how-section" id="how">
        <div className="lp-section-wide">
          <div style={{ textAlign: 'center' }}>
            <p className="lp-section-label">Under the Hood</p>
            <h2 className="lp-h2">
              How NightPath <em>scores</em> your route
            </h2>
            <p style={{ color: 'rgba(230,249,175,0.5)', fontSize: '0.92rem', fontWeight: 300, marginTop: '0.5rem', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
              Four data layers, fused in real time — so your score changes as conditions change.
            </p>
          </div>

          <div className="how-steps">
            <div className="step">
              <div className="step-num">01</div>
              <span className="step-icon">🗺️</span>
              <h3>Road Graph</h3>
              <p>
                We pull Mumbai&apos;s full street network from OpenStreetMap and BMC&apos;s GIS API — every lane, footpath, and junction mapped as a weighted graph.
              </p>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <span className="step-icon">💡</span>
              <h3>Safety Scoring</h3>
              <p>
                Each road segment is scored across lighting density, crowd presence, POI activity, and time-of-day risk weighting using VIIRS satellite data + OSM tags.
              </p>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <span className="step-icon">📍</span>
              <h3>Community Layer</h3>
              <p>
                Real-time hazard pins from users decay exponentially over hours — a flooded underpass reported at 9pm matters less by midnight. Living data, not stale flags.
              </p>
            </div>
            <div className="step">
              <div className="step-num">04</div>
              <span className="step-icon">🎯</span>
              <h3>Your Optimal Path</h3>
              <p>
                A modified Dijkstra algorithm finds the path that best balances your personal weights — you choose how much safety vs. speed matters to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE SCORE DEMO ── */}
      <section className="demo-section">
        <div className="demo-inner">
          {/* MAP VISUAL */}
          <div className="demo-map">
            <div className="map-grid" />
            <div className="map-inner">
              {/* Route lines */}
              <div className="route-line rl-fast" />
              <div className="route-line rl-best" />
              <div className="route-line rl-dark" />

              {/* POI dots — lit streetlights */}
              <div className="poi poi-lit" style={{ top: '20%', left: '18%' }} />
              <div className="poi poi-lit" style={{ top: '35%', left: '32%' }} />
              <div className="poi poi-lit" style={{ top: '50%', left: '46%' }} />
              <div className="poi poi-lit" style={{ top: '50%', left: '62%' }} />
              <div className="poi poi-lit" style={{ top: '50%', left: '76%' }} />

              {/* Shops */}
              <div className="poi poi-shop" style={{ top: '46%', left: '36%' }} />
              <div className="poi poi-shop" style={{ top: '46%', left: '55%' }} />
              <div className="poi poi-shop" style={{ top: '46%', left: '70%' }} />

              {/* Dark spots */}
              <div className="poi poi-dark" style={{ top: '40%', left: '20%' }} />
              <div className="poi poi-dark" style={{ top: '40%', left: '40%' }} />
              <div className="poi poi-dark" style={{ top: '60%', left: '30%' }} />

              {/* Labels */}
              <div style={{ position: 'absolute', top: '44%', left: '6%', fontSize: '0.62rem', color: 'rgba(139,190,178,0.35)', letterSpacing: '0.06em' }}>
                FASTEST
              </div>
              <div style={{ position: 'absolute', top: '49%', left: '6%', fontSize: '0.62rem', color: 'var(--lime)', letterSpacing: '0.06em', fontWeight: 600 }}>
                NIGHTPATH
              </div>
              <div style={{ position: 'absolute', top: '61%', left: '6%', fontSize: '0.62rem', color: 'rgba(139,190,178,0.25)', letterSpacing: '0.06em' }}>
                ALT
              </div>

              {/* Pins */}
              <div className="pin" style={{ top: '42%', left: '5%' }}>
                📍<span className="pin-label">Dadar</span>
              </div>
              <div className="pin" style={{ top: '42%', right: '5%' }}>
                🏠<span className="pin-label">Home</span>
              </div>

              {/* Hazard pin */}
              <div style={{ position: 'absolute', top: '28%', left: '42%', fontSize: '1rem' }} title="User-reported: poor lighting">
                ⚠️
              </div>
              <div style={{ position: 'absolute', top: '22%', left: '41%', background: 'rgba(13,6,48,0.8)', border: '1px solid rgba(139,190,178,0.2)', borderRadius: '8px', padding: '0.3rem 0.6rem', fontSize: '0.6rem', color: 'rgba(230,249,175,0.7)', whiteSpace: 'nowrap' }}>
                Poor lighting · 2h ago
              </div>
            </div>

            <div className="map-legend">
              <div className="leg-item">
                <div className="leg-line" style={{ background: 'var(--lime)', boxShadow: '0 0 8px rgba(230,249,175,0.3)' }} />
                NightPath Route
              </div>
              <div className="leg-item">
                <div className="leg-line" style={{ background: 'rgba(139,190,178,0.25)' }} />
                Fastest Route
              </div>
              <div className="leg-item">
                <div className="leg-dot" style={{ background: 'rgba(230,249,175,0.7)' }} />
                Streetlight
              </div>
              <div className="leg-item">
                <div className="leg-dot" style={{ background: 'var(--teal)' }} />
                Open Shop
              </div>
              <div className="leg-item">
                <div className="leg-dot" style={{ background: 'rgba(56,78,119,0.6)' }} />
                Dark Zone
              </div>
            </div>
          </div>

          {/* SCORE BREAKDOWN */}
          <div className="score-panel">
            <p className="lp-section-label">Live Score Breakdown</p>
            <h2 className="lp-h2">
              Why this route<br />
              scored <em>9.2 / 10</em>
            </h2>
            <p>
              Each factor is weighted and combined into a single route score. We show every component — because you deserve to understand the recommendation, not just receive it.
            </p>

            <div className="factor-list">
              <div className="factor">
                <div className="factor-top">
                  <span className="factor-name">💡 Street Lighting</span>
                  <span className="factor-score fs-high">8.7</span>
                </div>
                <div className="factor-bar">
                  <div className="factor-fill fill-lime" style={{ width: activeFactorWidths.light }} />
                </div>
                <div className="factor-note">87% of route segments lit · Source: OSM + VIIRS satellite</div>
              </div>

              <div className="factor">
                <div className="factor-top">
                  <span className="factor-name">👥 Footfall Density</span>
                  <span className="factor-score fs-high">9.1</span>
                </div>
                <div className="factor-bar">
                  <div className="factor-fill fill-lime" style={{ width: activeFactorWidths.crowd }} />
                </div>
                <div className="factor-note">High pedestrian + vehicle activity · 10:47 PM Thursday</div>
              </div>

              <div className="factor">
                <div className="factor-top">
                  <span className="factor-name">🏪 Open Shops / POIs</span>
                  <span className="factor-score fs-mid">7.4</span>
                </div>
                <div className="factor-bar">
                  <div className="factor-fill fill-teal" style={{ width: activeFactorWidths.shops }} />
                </div>
                <div className="factor-note">4 open establishments along route · 2 pharmacies</div>
              </div>

              <div className="factor">
                <div className="factor-top">
                  <span className="factor-name">⏰ Time-of-Day Risk</span>
                  <span className="factor-score fs-mid">7.8</span>
                </div>
                <div className="factor-bar">
                  <div className="factor-fill fill-teal" style={{ width: activeFactorWidths.time }} />
                </div>
                <div className="factor-note">Late evening — adjusted from day score of 9.4</div>
              </div>

              <div className="factor">
                <div className="factor-top">
                  <span className="factor-name">📍 Community Reports</span>
                  <span className="factor-score fs-high">9.5</span>
                </div>
                <div className="factor-bar">
                  <div className="factor-fill fill-lime" style={{ width: activeFactorWidths.reports }} />
                </div>
                <div className="factor-note">No recent hazard flags · Last report: 48h ago (resolved)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="features-section">
        <div className="lp-section-wide">
          <div style={{ marginBottom: '0.5rem' }}>
            <p className="lp-section-label">What&apos;s Inside</p>
            <h2 className="lp-h2">
              Every feature built for <em>real commuters</em>
            </h2>
          </div>
          <div className="features-grid">
            <div className="feat-card">
              <span className="feat-icon">🌧️</span>
              <div className="feat-title">Monsoon Radar</div>
              <div className="feat-desc">
                Crowd-verified waterlogging maps that update in real time during Mumbai&apos;s monsoon season — avoid flooded footpaths before you step into them.
              </div>
              <span className="feat-tag">Mumbai Exclusive</span>
            </div>
            <div className="feat-card">
              <span className="feat-icon">👻</span>
              <div className="feat-title">Ghost Sentry</div>
              <div className="feat-desc">
                Battery-efficient deviation detection that silently pings your trusted contact only if you halt in an unlit area or stray from your planned route — not constant surveillance.
              </div>
              <span className="feat-tag">Pro Feature</span>
            </div>
            <div className="feat-card">
              <span className="feat-icon">🚉</span>
              <div className="feat-title">Station Egress Optimizer</div>
              <div className="feat-desc">
                Step-by-step pathing from specific local train platforms to the best-lit, security-guarded exit gate — because Dadar at 11pm isn&apos;t all exits equal.
              </div>
              <span className="feat-tag">Pro Feature</span>
            </div>
            <div className="feat-card">
              <span className="feat-icon">📡</span>
              <div className="feat-title">Time-Decayed Hazard Map</div>
              <div className="feat-desc">
                Community-reported hazards lose weight exponentially over hours. A broken streetlight reported 6 hours ago counts less than one reported 20 minutes ago.
              </div>
              <span className="feat-tag">Always Free</span>
            </div>
            <div className="feat-card">
              <span className="feat-icon">🏙️</span>
              <div className="feat-title">Trusted Point Radar</div>
              <div className="feat-desc">
                Nearest 24-hour pharmacies, police chowkis, lit metro stations, and hotel lobbies shown within 500m of your live position — real refuge, not just pins.
              </div>
              <span className="feat-tag">Always Free</span>
            </div>
            <div className="feat-card">
              <span className="feat-icon">🎛️</span>
              <div className="feat-title">Personalised Weights</div>
              <div className="feat-desc">
                Prioritise lighting over speed? Prefer routes past open shops? Set your own safety-vs-time tradeoff and NightPath optimises exactly for what matters to you.
              </div>
              <span className="feat-tag">Pro Feature</span>
            </div>
            <div className="feat-card">
              <span className="feat-icon">🛺</span>
              <div className="feat-title">Fare Tamper Alert</div>
              <div className="feat-desc">
                Enter your meter reading and our GPS-odometer computes the legal RTA fare in real time — if the meter ticks faster than distance allows, you&apos;re alerted instantly.
              </div>
              <span className="feat-tag">Tourist Shield</span>
            </div>
            <div className="feat-card">
              <span className="feat-icon">🌐</span>
              <div className="feat-title">Offline Mode</div>
              <div className="feat-desc">
                Full route maps, emergency audio cards, and trusted-point data cached locally — because signal drops in Mumbai&apos;s dense station corridors at exactly the wrong moment.
              </div>
              <span className="feat-tag">Pro Feature</span>
            </div>
            <div className="feat-card">
              <span className="feat-icon">🏛️</span>
              <div className="feat-title">Civic Feedback Loop</div>
              <div className="feat-desc">
                Anonymised &quot;routes avoided at night&quot; data is packaged into infrastructure-gap reports for BMC — turning every avoided lane into an argument for a new streetlight.
              </div>
              <span className="feat-tag">Built In</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO IS IT FOR ── */}
      <section className="audience-section">
        <div className="lp-section-wide">
          <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <p className="lp-section-label">Who It&apos;s For</p>
            <h2 className="lp-h2">
              Built for everyone who<br />
              <em>commutes after dark</em>
            </h2>
          </div>
          <div className="audience-grid">
            <div
              className="aud-card cursor-pointer"
              onClick={() => onLaunchPlanner ? onLaunchPlanner() : onNavigate && onNavigate('planner')}
            >
              <span className="aud-icon">🎓</span>
              <div className="aud-sub">Daily Commuters</div>
              <div className="aud-title">College students &amp; night-shift workers</div>
              <div className="aud-desc">
                For the 10 PM local train home, the last auto from Andheri station, and every walk between a dark bus stop and your building gate.
              </div>
              <div className="aud-list">
                <div className="aud-item">Free tier covers daily route comparisons</div>
                <div className="aud-item">Student pricing at ₹99/month</div>
                <div className="aud-item">Station egress guides for Dadar, Kurla, Andheri, Thane</div>
                <div className="aud-item">Monsoon waterlogging alerts during season</div>
              </div>
            </div>

            <div
              className="aud-card cursor-pointer"
              onClick={() => onNavigate && onNavigate('corporate')}
            >
              <span className="aud-icon">🏢</span>
              <div className="aud-sub">Corporates &amp; Teams</div>
              <div className="aud-title">BPOs, IT hubs &amp; late-shift employers</div>
              <div className="aud-desc">
                Companies operating late shifts in Powai, Airoli, and Lower Parel have a duty-of-care obligation. NightPath turns that obligation into a dashboard.
              </div>
              <div className="aud-list">
                <div className="aud-item">Route-auditing dashboard for fleet managers</div>
                <div className="aud-item">Drop-off optimisation along lit corridors</div>
                <div className="aud-item">₹50–₹100 per covered employee / month</div>
                <div className="aud-item">Annual SaaS contract, compliance-ready reporting</div>
              </div>
            </div>

            <div
              className="aud-card cursor-pointer"
              onClick={() => onNavigate && onNavigate('tourist')}
            >
              <span className="aud-icon">✈️</span>
              <div className="aud-sub">Tourists &amp; Visitors</div>
              <div className="aud-title">International and domestic visitors to Mumbai</div>
              <div className="aud-desc">
                Zero local knowledge to compensate for an unfamiliar city at night. NightPath layers safety info and scam protection on top of standard navigation.
              </div>
              <div className="aud-list">
                <div className="aud-item">Airport &amp; railway scam alerts at arrival points</div>
                <div className="aud-item">Live meter tamper detection in auto-rickshaws &amp; taxis</div>
                <div className="aud-item">Embassy &amp; consulate contact auto-detection</div>
                <div className="aud-item">Bilingual driver communication cards</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-section">
        <div className="stats-grid">
          <div>
            <div className="stat-num">4</div>
            <div className="stat-label">Data Layers Fused</div>
          </div>
          <div>
            <div className="stat-num">95k+</div>
            <div className="stat-label">OSM Nodes Cached</div>
          </div>
          <div>
            <div className="stat-num">&lt;2s</div>
            <div className="stat-label">Route Recalc Time</div>
          </div>
          <div>
            <div className="stat-num">Mumbai</div>
            <div className="stat-label">Live Active Network</div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="pricing-section" id="pricing">
        <div style={{ textAlign: 'center', marginBottom: 0 }}>
          <p className="lp-section-label">Simple Pricing</p>
          <h2 className="lp-h2">
            Start free. <em>Upgrade when it matters.</em>
          </h2>
          <p style={{ fontSize: '0.9rem', fontWeight: 300, color: 'rgba(139,190,178,0.5)', marginTop: '0.5rem' }}>
            Core route comparisons are always free. Premium features unlock when the stakes are highest.
          </p>
        </div>

        <div className="pricing-grid">
          {/* Free Forever */}
          <div className="price-card">
            <div className="price-tier">Free Forever</div>
            <div className="price-name">NightPath Free</div>
            <div className="price-amount">₹0<span>/mo</span></div>
            <div className="price-period">No credit card needed</div>
            <hr className="price-divider" />
            <div className="price-features">
              <div className="pf-item pf-yes">Fastest vs. Lit route comparison</div>
              <div className="pf-item pf-yes">Time-decayed hazard map</div>
              <div className="pf-item pf-yes">1-tap community hazard reporting</div>
              <div className="pf-item pf-yes">Trusted points radar (500m)</div>
              <div className="pf-item pf-no">Ghost Sentry deviation alerts</div>
              <div className="pf-item pf-no">Station egress optimizer</div>
              <div className="pf-item pf-no">Offline mode</div>
              <div className="pf-item pf-no">Personalised safety weights</div>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('onboarding')}
              className="lp-btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Get Started Free
            </button>
          </div>

          {/* Commuter Pro */}
          <div className="price-card featured">
            <span className="price-popular">Most Popular</span>
            <div className="price-tier">Students &amp; Workers</div>
            <div className="price-name">Commuter Pro</div>
            <div className="price-amount">₹99<span>/mo</span></div>
            <div className="price-period">₹79/mo billed annually · cancel anytime</div>
            <hr className="price-divider" />
            <div className="price-features">
              <div className="pf-item pf-yes">Everything in Free</div>
              <div className="pf-item pf-yes">Ghost Sentry deviation alerts</div>
              <div className="pf-item pf-yes">Station egress optimizer</div>
              <div className="pf-item pf-yes">Offline maps &amp; emergency cards</div>
              <div className="pf-item pf-yes">Personalised safety weights</div>
              <div className="pf-item pf-yes">Monsoon waterlogging radar</div>
              <div className="pf-item pf-yes">Priority hazard reporting</div>
              <div className="pf-item pf-no">Fare tamper verifier</div>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('onboarding')}
              className="lp-btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Start 14-Day Trial →
            </button>
          </div>

          {/* SafePass */}
          <div className="price-card">
            <div className="price-tier">Tourists &amp; Visitors</div>
            <div className="price-name">SafePass</div>
            <div className="price-amount">₹249</div>
            <div className="price-period">48-hour pass · ₹499 for 7 days</div>
            <hr className="price-divider" />
            <div className="price-features">
              <div className="pf-item pf-yes">Everything in Commuter Pro</div>
              <div className="pf-item pf-yes">Live fare tamper verifier</div>
              <div className="pf-item pf-yes">Airport &amp; station scam alerts</div>
              <div className="pf-item pf-yes">Embassy contact auto-detection</div>
              <div className="pf-item pf-yes">Bilingual driver cards (EN / मराठी)</div>
              <div className="pf-item pf-yes">Auto-SOS dispatch with contacts</div>
              <div className="pf-item pf-yes">Offline mode pre-cached on install</div>
              <div className="pf-item pf-yes">Mumbai transit mode guide</div>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('tourist')}
              className="lp-btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Buy SafePass
            </button>
          </div>
        </div>
      </section>

      {/* ── BETA CTA ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <p className="lp-section-label">Beta Access</p>
          <h2 className="lp-h2">
            Be first in<br />
            <em>Mumbai.</em>
          </h2>
          <p>
            We&apos;re opening early access to 500 beta users across Mumbai. Join the waitlist and get Commuter Pro free for 3 months when we launch.
          </p>
          <div className="cta-btns">
            <button
              onClick={() => onNavigate && onNavigate('onboarding')}
              className="lp-btn-primary"
            >
              🌙 Join the Waitlist
            </button>
            <button
              onClick={() => onNavigate && onNavigate('corporate')}
              className="lp-btn-secondary"
            >
              For Businesses →
            </button>
          </div>
          <div className="cta-note">No spam. Launch notification only. Unsubscribe any time.</div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="footer-logo">
          Night<span>Path</span>
        </div>
        <ul className="footer-links">
          <li>
            <button onClick={() => onNavigate && onNavigate('howItWorks')}>How It Works</button>
          </li>
          <li>
            <button onClick={() => onNavigate && onNavigate('corporate')}>For Business</button>
          </li>
          <li>
            <button onClick={() => onNavigate && onNavigate('tourist')}>Tourist Mode</button>
          </li>
          <li>
            <button onClick={() => onNavigate && onNavigate('dashboard')}>Dashboard</button>
          </li>
          <li>
            <button onClick={() => onNavigate && onNavigate('report')}>Report Hazard</button>
          </li>
        </ul>
        <p className="footer-copy">© 2025 NightPath · Mumbai Safe Night Transport</p>
      </footer>
    </div>
  );
}
