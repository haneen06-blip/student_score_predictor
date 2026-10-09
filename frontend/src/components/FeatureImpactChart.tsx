'use client';

import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, HelpCircle } from 'lucide-react';
import { FeatureContribution } from '../types';

interface FeatureImpactChartProps {
  contributions: FeatureContribution[];
}

export default function FeatureImpactChart({ contributions }: FeatureImpactChartProps) {
  const positiveDrivers = contributions.filter(c => c.impact_points > 0.05);
  const negativeDrivers = contributions.filter(c => c.impact_points < -0.05);
  const neutralFactors = contributions.filter(c => Math.abs(c.impact_points) <= 0.05);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-elevated space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            What Factors Are Helping or Hurting This Score?
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Every point gained (+) or lost (-) compared to the class baseline (67.2 pts)
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Positive Boosters
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            Areas Dragging Score
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Column 1: Positive Boosters */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <ArrowUpRight className="w-4 h-4" />
            Top Positive Factors (Adding Points)
          </h4>
          
          {positiveDrivers.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-900/40 rounded-xl">
              No strong positive factors detected yet.
            </p>
          ) : (
            positiveDrivers.map((c) => (
              <div
                key={c.feature}
                className="bg-slate-900/70 p-3.5 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-200">{c.label}</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    +{c.impact_points.toFixed(2)} pts
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{c.description}</p>
              </div>
            ))
          )}
        </div>

        {/* Column 2: Negative Drags */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <ArrowDownRight className="w-4 h-4" />
            Key Factors Holding the Student Back
          </h4>
          
          {negativeDrivers.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-900/40 rounded-xl">
              Great job! No significant negative factors holding this student back.
            </p>
          ) : (
            negativeDrivers.map((c) => (
              <div
                key={c.feature}
                className="bg-slate-900/70 p-3.5 rounded-xl border border-rose-500/20 hover:border-rose-500/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-200">{c.label}</span>
                  <span className="font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    {c.impact_points.toFixed(2)} pts
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{c.description}</p>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
