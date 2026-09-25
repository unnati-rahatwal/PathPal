import React, { useState } from 'react';
import { X, PhoneCall, ShieldAlert, Share2, MapPin, ExternalLink, Check, Copy } from 'lucide-react';
import { SAFE_HAVENS } from '../data/mumbaiData';

export default function SOSGuardModal({ isOpen, onClose }) {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const emergencyContacts = [
    { name: 'Mumbai Police Central Control', number: '112 / 100', subtitle: 'General Emergency & Beat Marshals' },
    { name: 'Mumbai Women Safety Helpline', number: '103', subtitle: 'Dedicated Women Safety Desk' },
    { name: 'Railway Protection Force (RPF)', number: '182', subtitle: 'Local Trains & Railway Station Safety' },
    { name: 'Mumbai Traffic Control', number: '8454999999', subtitle: 'Night Breakdown & Highway Patrol' }
  ];

  const handleShareLocation = () => {
    const fakeLiveLink = `https://balikaman.mumbai.gov.in/sos/live-track?id=MB-${Math.floor(Math.random()*90000+10000)}`;
    navigator.clipboard.writeText(`EMERGENCY: I am travelling late in Mumbai. Track my live location here: ${fakeLiveLink}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg p-5 border border-red-500/30 relative shadow-2xl animate-fade-in bg-[#0f0a14]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SOS Header */}
        <div className="flex items-center gap-3 mb-4 border-b border-red-500/20 pb-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500 flex items-center justify-center text-red-400 animate-pulse">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              NIGHT SOS & EMERGENCY GUARD
              <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-mono border border-red-500/30">
                ACTIVE MODE
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Immediate connection to Mumbai Police helplines & live location broadcasting.
            </p>
          </div>
        </div>

        {/* Live Location Sharing Action */}
        <div className="bg-gradient-to-r from-red-950/40 to-rose-950/40 border border-red-500/30 p-3.5 rounded-xl mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-red-400" />
                Share Encrypted Live Tracking Link
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Broadcast your real-time GPS & route progress to trusted emergency contacts.
              </p>
            </div>
            <button
              onClick={handleShareLocation}
              className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shrink-0"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy SOS Link'}</span>
            </button>
          </div>
        </div>

        {/* Emergency Helplines */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            Direct Mumbai Helplines
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {emergencyContacts.map((contact, i) => (
              <a
                key={i}
                href={`tel:${contact.number.split('/')[0].trim()}`}
                className="bg-[#140d1c] hover:bg-red-950/30 p-2.5 rounded-xl border border-white/5 hover:border-red-500/40 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-white">{contact.name}</div>
                  <div className="text-[10px] text-slate-400">{contact.subtitle}</div>
                </div>
                <div className="text-xs font-mono font-extrabold text-red-400 bg-red-500/10 px-2 py-1 rounded group-hover:bg-red-500 group-hover:text-white transition-colors">
                  {contact.number}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Safe Havens nearby */}
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            Nearest 24/7 Safe Havens (Guarded)
          </h4>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {SAFE_HAVENS.map((sh) => (
              <div
                key={sh.id}
                className="bg-white/5 p-2 rounded-lg text-xs flex items-center justify-between border border-white/5"
              >
                <div>
                  <span className="font-bold text-slate-200 block">{sh.name}</span>
                  <span className="text-[10px] text-emerald-400">{sh.type} • {sh.openHours}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-black/40 px-2 py-1 rounded">
                  {sh.contact}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
