import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, MapPin, AlertCircle, PlusCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { fetchCommunityReports } from '../services/apiService';

export default function CommunityAlertFeed({ onOpenReportModal }) {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchCommunityReports()
      .then((data) => {
        if (data && data.length > 0) {
          setReports(data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const handleUpvote = (id) => {
    setReports((prev) =>
      prev.map((rep) =>
        rep.id === id ? { ...rep, upvotes: rep.upvotes + 1 } : rep
      )
    );
  };

  return (
    <div className="glass-panel p-4 mb-4">
      <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Live Community Night Feed (Mumbai Commuters)
          </h3>
        </div>
        <button
          onClick={onOpenReportModal}
          className="text-xs text-cyan-400 font-semibold hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Post Live Update</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="bg-[#0b101c] p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all"
          >
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-200">{rep.user}</span>
                <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/20">
                  {rep.badge}
                </span>
              </div>
              <span className="text-slate-500 text-[10px]">{rep.time}</span>
            </div>

            <div className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">{rep.location}</span>
            </div>

            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">{rep.comment}</p>

            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-white/5">
              <span className="text-slate-400">
                Lighting:{' '}
                <span className="text-amber-400 font-bold">
                  {'★'.repeat(rep.lightingRating)}{'☆'.repeat(5 - rep.lightingRating)}
                </span>
              </span>
              <button
                onClick={() => handleUpvote(rep.id)}
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 flex items-center gap-1 transition-colors"
              >
                <ThumbsUp className="w-3 h-3 text-cyan-400" />
                <span>{rep.upvotes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
