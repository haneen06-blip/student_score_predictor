'use client';

import React from 'react';
import { Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StudentInput } from '../types';
import { COHORT_BENCHMARKS } from '../lib/constants';

interface BenchmarkComparisonProps {
  student: StudentInput;
  predictedScore: number;
}

export default function BenchmarkComparison({ student, predictedScore }: BenchmarkComparisonProps) {
  const metrics = [
    {
      label: 'Final Exam Score',
      studentVal: predictedScore,
      benchmarkVal: COHORT_BENCHMARKS.meanScore,
      unit: 'pts',
      diff: predictedScore - COHORT_BENCHMARKS.meanScore,
    },
    {
      label: 'Class Attendance',
      studentVal: student.Attendance,
      benchmarkVal: COHORT_BENCHMARKS.meanAttendance,
      unit: '%',
      diff: student.Attendance - COHORT_BENCHMARKS.meanAttendance,
    },
    {
      label: 'Weekly Study Hours',
      studentVal: student.Hours_Studied,
      benchmarkVal: COHORT_BENCHMARKS.meanStudyHours,
      unit: 'hrs',
      diff: student.Hours_Studied - COHORT_BENCHMARKS.meanStudyHours,
    },
    {
      label: 'Previous Exam Score',
      studentVal: student.Previous_Scores,
      benchmarkVal: COHORT_BENCHMARKS.meanPreviousScore,
      unit: 'pts',
      diff: student.Previous_Scores - COHORT_BENCHMARKS.meanPreviousScore,
    }
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-elevated">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 mb-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          Comparison with Class Average (6,607 Students)
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          See whether the student is ahead of or behind the typical student in their cohort
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m) => {
          const isAbove = m.diff >= 0;
          return (
            <div
              key={m.label}
              className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {m.label}
                </span>
                <div className="text-xl font-black font-mono text-white">
                  {m.studentVal.toFixed(1)} {m.unit}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Average: {m.benchmarkVal.toFixed(1)}
                </span>
                <span
                  className={`font-mono font-bold flex items-center gap-0.5 text-xs ${
                    isAbove ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isAbove ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {isAbove ? `+${m.diff.toFixed(1)}` : `${m.diff.toFixed(1)}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
