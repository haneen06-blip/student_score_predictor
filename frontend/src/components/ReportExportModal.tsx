'use client';

import React from 'react';
import { Printer, Download, X, GraduationCap, Award, CheckCircle2 } from 'lucide-react';
import { StudentInput, PredictionResponse } from '../types';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentInput;
  prediction: PredictionResponse;
}

export default function ReportExportModal({
  isOpen,
  onClose,
  student,
  prediction
}: ReportExportModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      
      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100 my-8">
        
        {/* Actions Bar (hidden in print) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 no-print">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-sm text-slate-200">
              Student Assessment Evaluation Sheet
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-5 mb-5">
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                ApexScore Academic Evaluation
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Empirical Performance Projection & Attributive Analysis
              </p>
            </div>
            <div className="text-right text-xs font-mono text-slate-400">
              <div>Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
              <div>Report ID: {student.student_id || 'STU-OFFICIAL'}</div>
            </div>
          </div>

          {/* Student Profile Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800 mb-6 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Student Identifier</span>
              <span className="font-bold font-mono text-slate-200">{student.student_name || 'Student Candidate'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Class Attendance</span>
              <span className="font-bold font-mono text-emerald-400">{student.Attendance}%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Weekly Study Hours</span>
              <span className="font-bold font-mono text-indigo-400">{student.Hours_Studied} hrs/wk</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Prior Exam Baseline</span>
              <span className="font-bold font-mono text-cyan-400">{student.Previous_Scores} pts</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Sleep / Rest</span>
              <span className="font-bold text-slate-300">{student.Sleep_Hours || 7} hrs/night</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Tutoring Support</span>
              <span className="font-bold text-slate-300">{student.Tutoring_Sessions} sessions/mo</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">School Type</span>
              <span className="font-bold text-slate-300">{student.School_Type || 'Public'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Learning Resources</span>
              <span className="font-bold text-slate-300">{student.Access_to_Resources}</span>
            </div>
          </div>

          {/* Score Box */}
          <div className="flex items-center justify-between p-5 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/40 rounded-xl border border-indigo-500/30 mb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Forecasted Exam Result
              </span>
              <div className="text-3xl font-extrabold font-mono text-white mt-1">
                {prediction.predicted_score.toFixed(1)} <span className="text-sm font-normal text-slate-400">/ 100</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Band: <span className="font-semibold text-white">{prediction.performance_band}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-extrabold font-mono text-indigo-400">
                {prediction.grade_letter}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Percentile: <span className="font-bold text-slate-200">{prediction.percentile}%</span>
              </div>
            </div>
          </div>

          {/* Key Drivers */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Primary Factor Attributions
            </h4>
            <div className="space-y-1.5 text-xs">
              {prediction.contributions.slice(0, 5).map((c) => (
                <div key={c.feature} className="flex items-center justify-between py-1 border-b border-slate-900 text-slate-300">
                  <span>{c.label}</span>
                  <span className={`font-mono font-bold ${c.impact_points >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {c.impact_points >= 0 ? `+${c.impact_points.toFixed(2)}` : `${c.impact_points.toFixed(2)}`} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Improvement Targets */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Actionable Guidance & Interventions
            </h4>
            <div className="space-y-2 text-xs">
              {prediction.recommendations.map((rec, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-300">{rec.action}</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold shrink-0 ml-2">
                    +{rec.potential_gain.toFixed(1)} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
