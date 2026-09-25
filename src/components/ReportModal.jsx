import React, { useState } from 'react';
import { X, Send, MapPin, AlertTriangle, Sun, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitCommunityReport } from '../services/apiService';

export default function ReportModal({ isOpen, onClose, onAddReport }) {
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Streetlight Deficit');
  const [lightingRating, setLightingRating] = useState(3);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location || !comment) return;

    const reportObj = {
      id: `rep_${Date.now()}`,
      user: 'You (Live Commuter)',
      badge: 'Verified Commuter',
      time: 'Just now',
      location,
      category,
      lightingRating: Number(lightingRating),
      status: category.includes('Restored') ? 'Positive Alert' : 'Caution Alert',
      comment,
      upvotes: 1
    };

    try {
      await submitCommunityReport(reportObj);
    } catch (err) {
      console.warn('Backend report submission fallback:', err);
    }

    if (onAddReport) {
      onAddReport(reportObj);
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setLocation('');
      setComment('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-5 border border-white/10 relative shadow-2xl animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          Report Night Safety Condition
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Help fellow Mumbai night commuters by reporting streetlight outages, police presence, or isolated spots.
        </p>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-white">Report Submitted Successfully!</h4>
            <p className="text-xs text-slate-400">Updating live community night feed...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                LOCATION / LANDMARK
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Bandra Turner Road Flyover"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 bg-[#0d1322] border border-slate-700/60 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1322] border border-slate-700/60 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Streetlight Deficit">Streetlight Deficit / Dark Zone</option>
                <option value="Police Patrol Active">Police Patrol / Pink Booth Active</option>
                <option value="Isolated Construction Zone">Isolated Construction Zone</option>
                <option value="Streetlight Restored">Streetlight Restored / Bright</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block flex items-center justify-between">
                <span>LIGHTING QUALITY RATING</span>
                <span className="text-amber-400 font-bold">{lightingRating} / 5</span>
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={lightingRating}
                onChange={(e) => setLightingRating(e.target.value)}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                OBSERVATION & DETAILS
              </label>
              <textarea
                rows="3"
                placeholder="Describe lighting level, footfall, or advice for commuters..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#0d1322] border border-slate-700/60 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 hover:opacity-90"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Live Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
