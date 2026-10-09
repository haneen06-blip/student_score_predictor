'use client';

import React from 'react';
import { Award, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { PredictionResponse } from '../types';
import { GRADE_THEMES } from '../lib/constants';

interface ScoreGaugeProps {
  prediction: PredictionResponse;
  isLoading?: boolean;
}

export default function ScoreGauge({ prediction, isLoading }: ScoreGaugeProps) {
  const {
    predicted_score,
    grade_letter,
    performance_band,
    percentile,
    base_score,
    confidence_range
  } = prediction;

  const theme = GRADE_THEMES[grade_letter] || GRADE_THEMES['C'];
  const diffFromAvg = predicted_score - base_score;
  const isAboveAvg = diffFromAvg >= 0;

  // Percentage for progress ring (0 to 100)
  const scorePercent = Math.max(0, Math.min(100, predicted_score));
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * scorePercent) / 100;

  // Plain-English explanation
  let statusSummary = '';
  if (predicted_score >= 85) {
    statusSummary = 'Outstanding performance! Student is in the top 10% and excelling across all core subjects.';
  } else if (predicted_score >= 70) {
    statusSummary = 'Strong academic standing! Student is comfortably passing and performing above cohort average.';
  } else if (predicted_score >= 60) {
    statusSummary = 'Satisfactory passing grade, but could boost results with extra study hours or attendance.';
  } else {
    statusSummary = 'Academic support recommended. High priority for targeted tutoring and attendance tracking.';
  }

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-elevated relative overflow-hidden">
      
      {/* Glow Effect */}
      <div
        className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-500 ${
          predicted_score >= 75 ? 'bg-emerald-500' : predicted_score >= 60 ? 'bg-indigo-500' : 'bg-rose-500'
        }`}
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Predicted Final Exam Score
          </h2>
        </div>
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          Rank: Top {Math.round(100 - percentile)}%
        </span>
      </div>

      {/* Big Score & Circular Ring */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-4">
        
        {/* Ring */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#1e293b"
              strokeWidth="12"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke={predicted_score >= 75 ? '#10b981' : predicted_score >= 60 ? '#6366f1' : '#f43f5e'}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold font-mono text-white">
              {predicted_score.toFixed(1)}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">/ 100</span>
          </div>
        </div>

        {/* Grade Badge & Band */}
        <div className="text-center sm:text-left space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className={`px-4 py-1.5 rounded-xl text-2xl font-black font-mono border ${theme.bg} ${theme.text} ${theme.border} ${theme.glow}`}>
              {grade_letter}
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Letter Grade</div>
              <div className="text-sm font-bold text-white">{performance_band}</div>
            </div>
          </div>

          <div className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
            <span className="text-slate-400">Class Baseline:</span>
            <span className="font-mono font-bold text-slate-200">67.2 pts</span>
            <span className={`font-mono font-bold ml-1 ${isAboveAvg ? 'text-emerald-400' : 'text-rose-400'}`}>
              ({isAboveAvg ? `+${diffFromAvg.toFixed(1)}` : `${diffFromAvg.toFixed(1)}`} pts)
            </span>
          </div>
        </div>

      </div>

      {/* Human-Friendly Summary Banner */}
      <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 my-4 text-xs text-slate-300 leading-relaxed">
        <p>{statusSummary}</p>
      </div>

      {/* Expected Score Range (Confidence) */}
      <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-800">
        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block font-medium">Expected Minimum</span>
          <span className="text-sm font-mono font-bold text-slate-200">
            {confidence_range.lower_bound.toFixed(1)} pts
          </span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block font-medium">Expected Maximum</span>
          <span className="text-sm font-mono font-bold text-emerald-400">
            {confidence_range.upper_bound.toFixed(1)} pts
          </span>
        </div>
      </div>

    </div>
  );
}
