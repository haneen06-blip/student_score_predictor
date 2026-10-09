'use client';

import React from 'react';
import { 
  RotateCcw, 
  Users, 
  SlidersHorizontal,
  Info,
  CheckCircle2,
  Calendar,
  Clock,
  BookOpen,
  Activity
} from 'lucide-react';
import { FeatureSchema, FeatureSchemaItem, StudentInput } from '../types';
import { PRESET_STUDENTS } from '../lib/constants';

interface PredictionFormProps {
  schema: FeatureSchema;
  values: StudentInput;
  onChange: (field: string, val: any) => void;
  onLoadPreset?: (data: Record<string, any>) => void;
  onReset: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
  isDirty?: boolean;
}

export default function PredictionForm({
  schema,
  values,
  onChange,
  onLoadPreset,
  onReset,
  onSubmit,
  isLoading,
  isDirty
}: PredictionFormProps) {

  const loadPreset = (presetId: string) => {
    const found = PRESET_STUDENTS.find(p => p.id === presetId);
    if (found) {
      if (onLoadPreset) {
        onLoadPreset(found.data);
      } else {
        Object.entries(found.data).forEach(([key, val]) => {
          onChange(key, val);
        });
      }
    }
  };

  return (
    <div className="space-y-6">

      {/* Preset Student Selector */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-elevated">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Sample Students (One-Click Presets)
            </span>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Model Defaults</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_STUDENTS.map((preset) => {
            const isSelected = values.student_id === preset.data.student_id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => loadPreset(preset.id)}
                className={`p-3 rounded-xl text-left border transition-all text-xs flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-glow'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-slate-100">{preset.name}</div>
                <div className="text-[10px] text-indigo-300 mt-1 font-mono font-medium">{preset.badge}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamically Generated Form from Schema */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-elevated space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              Dynamic Model Features Input
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Generated directly from model pipeline schema ({schema.features.length} verified input features)
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isDirty && (
              <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Changes Pending
              </span>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isDirty
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow ring-2 ring-indigo-400/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Calculating...' : 'Calculate Score'}</span>
            </button>
          </div>
        </div>

        {/* Feature Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {schema.features.map((feat: FeatureSchemaItem) => {
            const currentValue = values[feat.name] ?? feat.default;

            if (feat.type === 'numeric') {
              const numVal = Number(currentValue);
              return (
                <div
                  key={feat.name}
                  className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-200">
                        {feat.label}
                      </label>
                      <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {numVal} {feat.unit || ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3 line-clamp-2">
                      {feat.description}
                    </p>
                  </div>

                  <div className="space-y-2 mt-2">
                    <input
                      type="range"
                      min={feat.min}
                      max={feat.max}
                      step={feat.step || 1}
                      value={numVal}
                      onChange={(e) => onChange(feat.name, Number(e.target.value))}
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Min: {feat.min}</span>
                      <input
                        type="number"
                        min={feat.min}
                        max={feat.max}
                        step={feat.step || 1}
                        value={numVal}
                        onChange={(e) => onChange(feat.name, Number(e.target.value))}
                        className="w-16 px-1.5 py-0.5 text-center text-xs font-mono font-bold bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                      <span>Max: {feat.max}</span>
                    </div>
                  </div>
                </div>
              );
            }

            // Categorical Input
            const options = feat.options || [];
            return (
              <div
                key={feat.name}
                className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1">
                    {feat.label}
                  </label>
                  <p className="text-[11px] text-slate-400 mb-3 line-clamp-2">
                    {feat.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mt-2">
                  {options.map((opt) => {
                    const isSelected = currentValue === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => onChange(feat.name, opt)}
                        className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all cursor-pointer truncate ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                        title={opt}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Prediction Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-bold text-sm text-white shadow-glow transition-all flex items-center justify-center gap-2 border cursor-pointer ${
            isDirty
              ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-400 border-indigo-400/50 ring-2 ring-indigo-500/30'
              : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500/30'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>
            {isLoading
              ? 'Calculating Prediction...'
              : isDirty
              ? 'Calculate Score Prediction (New Values Pending)'
              : 'Calculate Score Prediction'}
          </span>
        </button>

      </form>

    </div>
  );
}
