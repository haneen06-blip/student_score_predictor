'use client';

import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';
import { Recommendation } from '../types';

interface RecommendationsCardProps {
  recommendations: Recommendation[];
}

export default function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-elevated">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 mb-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-400" />
          Recommended Actions to Raise This Score
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          High-impact adjustments that yield the largest immediate score increases
        </p>
      </div>

      {/* Recommendations List */}
      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200">{rec.factor}</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ({rec.current_value} ➔ <span className="text-emerald-400 font-bold">{rec.suggested_target}</span>)
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {rec.action}
                </p>
              </div>
            </div>

            <div className="shrink-0 sm:text-right w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Estimated Gain
              </span>
              <span className="font-mono text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                +{rec.potential_gain.toFixed(1)} pts
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
