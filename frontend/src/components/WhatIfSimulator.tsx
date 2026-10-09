'use client';

import React, { useState, useEffect } from 'react';
import { Sliders, ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { StudentInput, WhatIfResponse } from '../types';
import { simulateWhatIf } from '../lib/api';

interface WhatIfSimulatorProps {
  baseStudent: StudentInput;
  baseScore: number;
}

export default function WhatIfSimulator({ baseStudent, baseScore }: WhatIfSimulatorProps) {
  const [simHours, setSimHours] = useState(baseStudent.Hours_Studied);
  const [simAttendance, setSimAttendance] = useState(baseStudent.Attendance);
  const [simResult, setSimResult] = useState<WhatIfResponse | null>(null);

  useEffect(() => {
    setSimHours(baseStudent.Hours_Studied);
    setSimAttendance(baseStudent.Attendance);
  }, [baseStudent]);

  useEffect(() => {
    simulateWhatIf(baseStudent, {
      Hours_Studied: simHours,
      Attendance: simAttendance
    }).then(setSimResult);
  }, [baseStudent, simHours, simAttendance]);

  if (!simResult) return null;

  const isGain = simResult.score_delta >= 0;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-elevated">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 mb-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          Score Improvement Simulator (What-If?)
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          See the instant boost in grade by increasing study hours or lecture attendance
        </p>
      </div>

      {/* Sliders */}
      <div className="space-y-4 mb-5">
        
        {/* Attendance Slider */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-300">Target Attendance</span>
            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              {simAttendance}%
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={100}
            step={1}
            value={simAttendance}
            onChange={(e) => setSimAttendance(Number(e.target.value))}
          />
          <div className="text-[11px] text-slate-500 mt-1 flex justify-between font-mono">
            <span>Current: {baseStudent.Attendance}%</span>
            <span>Slide to simulate improvement</span>
          </div>
        </div>

        {/* Study Hours Slider */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-300">Target Weekly Study Hours</span>
            <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
              {simHours} hrs/week
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={44}
            step={1}
            value={simHours}
            onChange={(e) => setSimHours(Number(e.target.value))}
          />
          <div className="text-[11px] text-slate-500 mt-1 flex justify-between font-mono">
            <span>Current: {baseStudent.Hours_Studied} hrs</span>
            <span>Slide to add more hours</span>
          </div>
        </div>

      </div>

      {/* Before / After Result Card */}
      <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div>
            <div className="text-[11px] text-slate-400">Current Score</div>
            <div className="text-lg font-bold font-mono text-slate-300">
              {simResult.original_score.toFixed(1)}
            </div>
            <div className="text-[10px] font-bold text-slate-400">
              Grade {simResult.grade_before}
            </div>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />

          <div>
            <div className="text-[11px] text-indigo-300 font-semibold">Simulated Score</div>
            <div className="text-2xl font-black font-mono text-white">
              {simResult.simulated_score.toFixed(1)}
            </div>
            <div className="text-[10px] font-bold text-indigo-400">
              Grade {simResult.grade_after}
            </div>
          </div>
        </div>

        <div className={`px-4 py-2 rounded-xl border text-center ${
          isGain
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          <div className="text-[10px] uppercase font-bold tracking-wider">
            Predicted Change
          </div>
          <div className="text-base font-black font-mono">
            {isGain ? `+${simResult.score_delta.toFixed(2)}` : `${simResult.score_delta.toFixed(2)}`} pts
          </div>
        </div>

      </div>

    </div>
  );
}
