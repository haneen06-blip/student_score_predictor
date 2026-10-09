'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  Layers, 
  CheckCircle2, 
  Activity, 
  TrendingUp, 
  Award,
  BookOpen,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { ModelMetadataResponse } from '../../types';
import { getModelMetadata } from '../../lib/api';

export default function AnalyticsPage() {
  const [metadata, setMetadata] = useState<ModelMetadataResponse | null>(null);

  useEffect(() => {
    getModelMetadata().then(setMetadata);
  }, []);

  if (!metadata) return null;

  const baselineComparisons = [
    { model: 'Linear Regression (Selected)', mae: 1.621, rmse: 2.037, r2: 0.743, selected: true },
    { model: 'Support Vector Regressor (SVR)', mae: 1.892, rmse: 2.348, r2: 0.658, selected: false },
    { model: 'K-Nearest Neighbors (KNN)', mae: 2.451, rmse: 3.082, r2: 0.412, selected: false },
    { model: 'Random Forest Regressor', mae: 2.314, rmse: 2.891, r2: 0.483, selected: false },
    { model: 'Decision Tree Regressor', mae: 3.120, rmse: 3.952, r2: 0.034, selected: false },
  ];

  const droppedFeatures = [
    { feature: 'Family_Income', reason: 'Removed by ethical design (sensitive socioeconomic demographic)' },
    { feature: 'Learning_Disabilities', reason: 'Removed by ethical design (sensitive personal accommodation)' },
    { feature: 'Sleep_Hours', reason: 'Removed: Weak empirical correlation (|r| = 0.021 < 0.05 threshold)' },
    { feature: 'Physical_Activity', reason: 'Removed: Weak empirical correlation (|r| = 0.026 < 0.05 threshold)' },
    { feature: 'School_Type', reason: 'Removed: Weak empirical correlation (|r| = 0.013 < 0.05 threshold)' },
    { feature: 'Gender', reason: 'Removed: Weak empirical correlation (|r| = 0.012 < 0.05 threshold)' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              Machine Learning Audit & Architecture
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Dataset: 6,607 Student Observations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Model Specifications & Training Results
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Verified performance metrics, benchmark comparisons against alternative algorithms, feature selection rationale, and exact standardized coefficients.
          </p>
        </div>
      </div>

      {/* Model Benchmark Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Variance Fit (R²)
          </span>
          <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">
            {metadata.r2_score.toFixed(3)}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">74.3% Variance Explained</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Mean Abs. Error (MAE)
          </span>
          <div className="text-2xl font-extrabold font-mono text-indigo-400 mt-1">
            {metadata.mae.toFixed(3)} <span className="text-xs text-slate-400">pts</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">±1.62 Exam Points Error</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Root Mean Sq. Error
          </span>
          <div className="text-2xl font-extrabold font-mono text-cyan-400 mt-1">
            {metadata.rmse.toFixed(3)} <span className="text-xs text-slate-400">pts</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Gaussian Residual</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Baseline Intercept (β₀)
          </span>
          <div className="text-2xl font-extrabold font-mono text-amber-400 mt-1">
            {metadata.baseline_intercept.toFixed(2)} <span className="text-xs text-slate-400">pts</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Cohort Center Point</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Sample Size (n)
          </span>
          <div className="text-2xl font-extrabold font-mono text-slate-200 mt-1">
            {metadata.training_sample_count.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">80/20 Train-Test Split</span>
        </div>
      </div>

      {/* Feature Importance & Weights Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 shadow-elevated overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Standardized Feature Effects (Notebook Cell 31)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Standardized linear weights: points of Exam_Score gained or lost per 1 standard deviation
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">13 Features In Pipeline</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 text-center">Rank</th>
                <th className="py-3 px-4">Feature Name</th>
                <th className="py-3 px-3 font-mono text-right">Standardized Weight (β)</th>
                <th className="py-3 px-3 font-mono text-right">Cohort Mean (μ)</th>
                <th className="py-3 px-3 font-mono text-right">Std Dev (σ)</th>
                <th className="py-3 px-4">Impact Sensitivity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {metadata.features.map((f) => {
                const isPositive = f.coefficient > 0;
                return (
                  <tr key={f.feature} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-400">
                      #{f.importance_rank}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-100">{f.label}</div>
                      <div className="text-[10px] font-mono text-slate-400">{f.feature}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-right">
                      <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
                        {isPositive ? `+${f.coefficient.toFixed(4)}` : f.coefficient.toFixed(4)}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-right text-slate-400">
                      {f.mean.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 font-mono text-right text-slate-400">
                      {f.std_scale.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isPositive
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                              : 'bg-rose-500'
                          }`}
                          style={{
                            width: `${Math.min(100, (Math.abs(f.coefficient) / 2.3) * 100)}%`
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Baseline Algorithm Comparison & Feature Selection Decisions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Baseline Models Comparison */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-elevated">
          <h3 className="text-sm font-bold text-slate-100 mb-1 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Model Selection Benchmark (Notebook Section 9)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Comparison of 5 candidate models on test set (20% holdout, random_state=20):
          </p>

          <div className="space-y-2.5">
            {baselineComparisons.map((b) => (
              <div
                key={b.model}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  b.selected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-900/50 border-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    {b.selected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{b.model}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    R² = {b.r2.toFixed(3)} | RMSE = {b.rmse.toFixed(3)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">MAE Error</span>
                  <span className="font-mono font-bold text-sm text-slate-100">
                    {b.mae.toFixed(3)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dropped Features Justification */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-elevated">
          <h3 className="text-sm font-bold text-slate-100 mb-1 flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-400" />
            Feature Selection Decisions (Notebook Section 5)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Features from original dataset that were excluded during training:
          </p>

          <div className="space-y-2.5">
            {droppedFeatures.map((d) => (
              <div
                key={d.feature}
                className="p-3 rounded-xl border border-slate-800 bg-slate-900/50 text-xs"
              >
                <div className="font-mono font-bold text-amber-300 mb-0.5">
                  {d.feature}
                </div>
                <div className="text-[11px] text-slate-300 leading-relaxed">
                  {d.reason}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
