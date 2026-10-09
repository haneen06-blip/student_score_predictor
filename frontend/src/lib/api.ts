import {
  StudentInput,
  PredictionResponse,
  BatchPredictionResponse,
  WhatIfResponse,
  ModelMetadataResponse,
  FeatureSchema
} from '../types';
import { localPredictSingle, localSimulateWhatIf } from './modelFallback';
import staticSchema from './feature_schema.json';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function fetchFeatureSchema(): Promise<FeatureSchema> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${BACKEND_URL}/schema`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Graceful fallback to static verified schema
  }
  return staticSchema as unknown as FeatureSchema;
}

export async function checkBackendHealth(): Promise<{ online: boolean; engine?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { online: true, engine: data.engine || 'FastAPI Scikit-Learn Engine' };
    }
  } catch (err) {
    // Backend offline
  }
  return { online: false, engine: 'Client High-Precision Engine' };
}

export async function predictStudent(student: StudentInput): Promise<{
  data: PredictionResponse;
  source: 'fastapi' | 'client';
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${BACKEND_URL}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { data, source: 'fastapi' };
    }
  } catch (err) {
    // Fallback to client calculation
  }

  const localData = localPredictSingle(student);
  return { data: localData, source: 'client' };
}

export async function predictBatch(students: StudentInput[]): Promise<BatchPredictionResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${BACKEND_URL}/api/predict/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ students }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback
  }

  const results = students.map(s => localPredictSingle(s));
  const scores = results.map(r => r.predicted_score);
  const gradeDist: Record<string, number> = {};
  for (const r of results) {
    gradeDist[r.grade_letter] = (gradeDist[r.grade_letter] || 0) + 1;
  }
  const avg = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
  const passCount = scores.filter(s => s >= 60).length;

  return {
    summary: {
      total_students: students.length,
      class_average: Math.round(avg * 100) / 100,
      highest_score: Math.max(...scores),
      lowest_score: Math.min(...scores),
      pass_rate: Math.round((passCount / (students.length || 1)) * 1000) / 10,
      grade_distribution: gradeDist
    },
    results
  };
}

export async function simulateWhatIf(
  baseStudent: StudentInput,
  changes: Partial<StudentInput>
): Promise<WhatIfResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${BACKEND_URL}/api/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base_student: baseStudent, changes }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback
  }

  return localSimulateWhatIf(baseStudent, changes);
}

export async function getModelMetadata(): Promise<ModelMetadataResponse> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/model-info`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback
  }

  return {
    model_name: 'Student Academic Exam Performance Predictor',
    algorithm: 'Standardized Multiple Linear Regression Pipeline',
    r2_score: 0.743,
    mae: 1.621,
    rmse: 2.037,
    baseline_intercept: 67.2135,
    training_sample_count: 6607,
    features: (staticSchema.features as any[]).map((f, i) => ({
      feature: f.name,
      label: f.label,
      coefficient: f.coefficient,
      mean: f.mean,
      std_scale: f.std,
      importance_rank: i + 1,
      category: f.type === 'numeric' ? 'Study Metric' : 'Environmental Factor'
    }))
  };
}
