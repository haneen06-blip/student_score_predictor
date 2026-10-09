'use client';

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  FileSpreadsheet, 
  Printer, 
  CheckCircle2, 
  Activity,
  Layers,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

import { FeatureSchema, StudentInput, PredictionResponse } from '../types';
import { fetchFeatureSchema, predictStudent } from '../lib/api';
import staticSchema from '../lib/feature_schema.json';

import ScoreGauge from '../components/ScoreGauge';
import PredictionForm from '../components/PredictionForm';
import FeatureImpactChart from '../components/FeatureImpactChart';
import WhatIfSimulator from '../components/WhatIfSimulator';
import BenchmarkComparison from '../components/BenchmarkComparison';
import RecommendationsCard from '../components/RecommendationsCard';
import ReportExportModal from '../components/ReportExportModal';

export default function DashboardPage() {
  const [schema, setSchema] = useState<FeatureSchema>(staticSchema as unknown as FeatureSchema);
  const [student, setStudent] = useState<StudentInput>(() => {
    const initial: Record<string, any> = {};
    staticSchema.features.forEach(f => {
      initial[f.name] = f.default;
    });
    initial.student_id = 'STU-1001';
    initial.student_name = 'Alex Morgan';
    return initial;
  });
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [lastCalculatedStudent, setLastCalculatedStudent] = useState<StudentInput>(() => {
    const initial: Record<string, any> = {};
    staticSchema.features.forEach(f => {
      initial[f.name] = f.default;
    });
    initial.student_id = 'STU-1001';
    initial.student_name = 'Alex Morgan';
    return initial;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchFeatureSchema().then((fetchedSchema) => {
      setSchema(fetchedSchema);
    });
  }, []);

  const runPrediction = async (currentData: StudentInput) => {
    setIsLoading(true);
    try {
      const res = await predictStudent(currentData);
      setPrediction(res.data);
      setLastCalculatedStudent(currentData);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runPrediction(student);
  }, []);

  const handleFieldChange = (field: string, val: any) => {
    setStudent(prev => ({ ...prev, [field]: val }));
  };

  const handleLoadPreset = (presetData: Record<string, any>) => {
    setStudent(prev => ({ ...prev, ...presetData }));
  };

  const handleReset = () => {
    const resetVals: Record<string, any> = {};
    schema.features.forEach(f => {
      resetVals[f.name] = f.default;
    });
    resetVals.student_id = 'STU-1001';
    resetVals.student_name = 'Alex Morgan';
    setStudent(resetVals);
  };

  const isDirty = JSON.stringify(student) !== JSON.stringify(lastCalculatedStudent);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              Verified ML Pipeline Predictor
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Model: LinearRegression (R² = 0.74, MAE = 1.62)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Student Exam Score Forecast
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            All input fields below are generated dynamically from the trained model schema. Adjust any feature to forecast final exam scores with exact mathematical attribution.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 shadow-sm transition-all hover:border-slate-700 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-indigo-400" />
            <span>Print Student Report</span>
          </button>
          <Link
            href="/batch"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-glow transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Whole Class (Batch Mode)</span>
          </Link>
        </div>
      </div>

      {/* 2. Main Executive Grid: Dynamic Form (Left) & Live Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Dynamic Schema Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <PredictionForm
            schema={schema}
            values={student}
            onChange={handleFieldChange}
            onLoadPreset={handleLoadPreset}
            onReset={handleReset}
            onSubmit={() => runPrediction(student)}
            isLoading={isLoading}
            isDirty={isDirty}
          />
        </div>

        {/* Right Column: Sticky Results & Simulator */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {prediction && (
            <>
              <ScoreGauge prediction={prediction} isLoading={isLoading} />
              <WhatIfSimulator
                baseStudent={lastCalculatedStudent}
                baseScore={prediction.predicted_score}
              />
            </>
          )}
        </div>

      </div>

      {/* 3. Deep-Dive Section: Breakdown, Benchmarks & Guidance */}
      {prediction && (
        <div className="space-y-6 pt-4 border-t border-slate-800">
          <FeatureImpactChart contributions={prediction.contributions} />
          <BenchmarkComparison
            student={lastCalculatedStudent}
            predictedScore={prediction.predicted_score}
          />
          <RecommendationsCard recommendations={prediction.recommendations} />
        </div>
      )}

      {/* Export Report Modal */}
      {prediction && (
        <ReportExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          student={lastCalculatedStudent}
          prediction={prediction}
        />
      )}

    </div>
  );
}
