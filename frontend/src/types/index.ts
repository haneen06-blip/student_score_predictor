export interface FeatureSchemaItem {
  name: string;
  label: string;
  description: string;
  order: number;
  type: 'numeric' | 'categorical';
  coefficient: number;
  mean: number;
  std: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string | null;
  default: number | string;
  options?: string[];
  ordinal_mapping?: Record<string, number>;
}

export interface FeatureSchema {
  model_name: string;
  algorithm: string;
  baseline_intercept: number;
  training_metrics: {
    r2_score: number;
    mae: number;
    rmse: number;
  };
  features: FeatureSchemaItem[];
}

export type LevelOption = 'Low' | 'Medium' | 'High';
export type BinaryOption = 'No' | 'Yes';
export type InfluenceOption = 'Negative' | 'Neutral' | 'Positive';
export type DistanceOption = 'Near' | 'Moderate' | 'Far';
export type EducationOption = 'High School' | 'College' | 'Postgraduate';

export type StudentInput = Record<string, any>;

export interface FeatureContribution {
  feature: string;
  label: string;
  input_value: string | number;
  impact_points: number;
  direction: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface ConfidenceRange {
  lower_bound: number;
  upper_bound: number;
  confidence_level: string;
}

export interface Recommendation {
  factor: string;
  current_value: string | number;
  suggested_target: string | number;
  potential_gain: number;
  action: string;
}

export interface PredictionResponse {
  predicted_score: number;
  grade_letter: string;
  performance_band: string;
  percentile: number;
  base_score: number;
  confidence_range: ConfidenceRange;
  contributions: FeatureContribution[];
  recommendations: Recommendation[];
  student_id?: string;
}

export interface BatchSummary {
  total_students: number;
  class_average: number;
  highest_score: number;
  lowest_score: number;
  pass_rate: number;
  grade_distribution: Record<string, number>;
}

export interface BatchPredictionResponse {
  summary: BatchSummary;
  results: PredictionResponse[];
}

export interface WhatIfResponse {
  original_score: number;
  simulated_score: number;
  score_delta: number;
  grade_before: string;
  grade_after: string;
  attribution_changes: {
    feature: string;
    label: string;
    before_impact: number;
    after_impact: number;
    gain_points: number;
  }[];
}

export interface FeatureWeightInfo {
  feature: string;
  label: string;
  coefficient: number;
  mean: number;
  std_scale: number;
  importance_rank: number;
  category: string;
}

export interface ModelMetadataResponse {
  model_name: string;
  algorithm: string;
  r2_score: number;
  mae: number;
  rmse: number;
  baseline_intercept: number;
  training_sample_count: number;
  features: FeatureWeightInfo[];
}

export interface StudentPreset {
  id: string;
  name: string;
  description: string;
  badge: string;
  data: StudentInput;
}
