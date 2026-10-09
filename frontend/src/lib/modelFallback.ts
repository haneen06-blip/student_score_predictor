import {
  StudentInput,
  PredictionResponse,
  FeatureContribution,
  Recommendation,
  BatchPredictionResponse,
  WhatIfResponse,
  ModelMetadataResponse
} from '../types';

const ORDINAL_MAP: Record<string, number> = {
  'Low': 0, 'Medium': 1, 'High': 2,
  'No': 0, 'Yes': 1,
  'Negative': 0, 'Neutral': 1, 'Positive': 2,
  'Near': 0, 'Moderate': 1, 'Far': 2,
  'High School': 0, 'College': 1, 'Postgraduate': 2
};

const FEATURE_ORDER = [
  'Attendance',
  'Hours_Studied',
  'Previous_Scores',
  'Access_to_Resources',
  'Parental_Involvement',
  'Tutoring_Sessions',
  'Parental_Education_Level',
  'Peer_Influence',
  'Distance_from_Home',
  'Motivation_Level',
  'Teacher_Quality',
  'Extracurricular_Activities',
  'Internet_Access'
];

const FEATURE_LABELS: Record<string, string> = {
  'Attendance': 'Class Attendance (%)',
  'Hours_Studied': 'Weekly Study Hours',
  'Previous_Scores': 'Prior Exam Score',
  'Access_to_Resources': 'Learning Resources Access',
  'Parental_Involvement': 'Parental Support',
  'Tutoring_Sessions': 'Monthly Tutoring Sessions',
  'Parental_Education_Level': 'Parental Education',
  'Peer_Influence': 'Peer Study Influence',
  'Distance_from_Home': 'Commute Distance',
  'Motivation_Level': 'Academic Motivation',
  'Teacher_Quality': 'Teaching Quality',
  'Extracurricular_Activities': 'Extracurricular Participation',
  'Internet_Access': 'Home High-Speed Internet'
};

const BASE_INTERCEPT = 67.21347464042393;

const SCALER_MEANS = [
  79.91937926, 19.9348978, 74.99791824, 1.09670704, 1.08743376, 1.49091597,
  0.69057532, 1.18584406, 0.50738077, 0.90821347, 1.19057532, 0.59405753,
  0.92448902
];

const SCALER_SCALES = [
  11.54092589, 5.8912939, 14.42176535, 0.7005976, 0.69381468, 1.21952355,
  0.77663293, 0.75468523, 0.67235789, 0.69475208, 0.59760604, 0.4910735,
  0.26421406
];

const MODEL_COEFS = [
  2.28402682, 1.73557574, 0.6770424, 0.73065346, 0.67605924, 0.58689263,
  0.37998468, 0.39124423, -0.31971337, 0.36812999, 0.30776231, 0.28214434,
  0.24877934
];

function erf(x: number): number {
  // Approximate error function for normal CDF
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return sign * y;
}

export function localPredictSingle(student: StudentInput): PredictionResponse {
  let totalDelta = 0;
  const contributions: FeatureContribution[] = [];

  for (let i = 0; i < FEATURE_ORDER.length; i++) {
    const feat = FEATURE_ORDER[i];
    const rawVal = (student as any)[feat];
    const numericVal = typeof rawVal === 'string' && rawVal in ORDINAL_MAP ? ORDINAL_MAP[rawVal] : Number(rawVal);

    const meanVal = SCALER_MEANS[i];
    const scaleVal = SCALER_SCALES[i];
    const coef = MODEL_COEFS[i];

    const z = (numericVal - meanVal) / scaleVal;
    const impact = coef * z;
    totalDelta += impact;

    let dir: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (impact > 0.05) dir = 'positive';
    else if (impact < -0.05) dir = 'negative';

    let desc = `Impact derived from standard deviation offset`;
    if (feat === 'Attendance') {
      desc = `${numericVal}% attendance vs cohort mean ${Math.round(meanVal)}%`;
    } else if (feat === 'Hours_Studied') {
      desc = `${numericVal} hrs/wk vs cohort mean ${Math.round(meanVal)} hrs`;
    } else if (feat === 'Previous_Scores') {
      desc = `${numericVal} prior score vs cohort mean ${Math.round(meanVal)}`;
    }

    contributions.push({
      feature: feat,
      label: FEATURE_LABELS[feat] || feat,
      input_value: rawVal,
      impact_points: Math.round(impact * 100) / 100,
      direction: dir,
      description: desc
    });
  }

  const rawScore = BASE_INTERCEPT + totalDelta;
  const boundedScore = Math.max(0, Math.min(100, Math.round(rawScore * 100) / 100));

  // Grade & Band
  let gradeLetter = 'C';
  let performanceBand = 'Satisfactory Pass';
  if (boundedScore >= 90) {
    gradeLetter = 'A+';
    performanceBand = 'Exceptional / Honors';
  } else if (boundedScore >= 85) {
    gradeLetter = 'A';
    performanceBand = 'Excellent Mastery';
  } else if (boundedScore >= 80) {
    gradeLetter = 'A-';
    performanceBand = 'High Achievement';
  } else if (boundedScore >= 75) {
    gradeLetter = 'B+';
    performanceBand = 'Above Average';
  } else if (boundedScore >= 70) {
    gradeLetter = 'B';
    performanceBand = 'Competent';
  } else if (boundedScore >= 65) {
    gradeLetter = 'C+';
    performanceBand = 'Standard Academic Standing';
  } else if (boundedScore >= 60) {
    gradeLetter = 'C';
    performanceBand = 'Satisfactory Pass';
  } else if (boundedScore >= 55) {
    gradeLetter = 'D';
    performanceBand = 'Marginal Passing';
  } else {
    gradeLetter = 'F';
    performanceBand = 'Academic Intervention Required';
  }

  // Percentile
  const zScore = (boundedScore - 67.24) / 3.89;
  const cdf = 0.5 * (1.0 + erf(zScore / Math.sqrt(2.0)));
  const percentile = Math.max(1, Math.min(99.9, Math.round(cdf * 1000) / 10));

  // Recommendations
  const recs: Recommendation[] = [];
  if (student.Attendance < 85) {
    const gain = ((92 - student.Attendance) / SCALER_SCALES[0]) * MODEL_COEFS[0];
    recs.push({
      factor: 'Class Attendance',
      current_value: `${student.Attendance}%`,
      suggested_target: '92%',
      potential_gain: Math.round(Math.max(0.6, gain) * 10) / 10,
      action: 'Increase class attendance to at least 92% to maximize lecture engagement.'
    });
  }
  if (student.Hours_Studied < 25) {
    const targetHours = Math.min(28, student.Hours_Studied + 6);
    const gain = ((targetHours - student.Hours_Studied) / SCALER_SCALES[1]) * MODEL_COEFS[1];
    recs.push({
      factor: 'Weekly Study Hours',
      current_value: `${student.Hours_Studied} hrs/wk`,
      suggested_target: `${targetHours} hrs/wk`,
      potential_gain: Math.round(Math.max(0.5, gain) * 10) / 10,
      action: 'Commit 5-6 extra hours per week into dedicated problem-solving sessions.'
    });
  }
  if (student.Tutoring_Sessions < 3) {
    recs.push({
      factor: 'Tutoring Sessions',
      current_value: `${student.Tutoring_Sessions} / month`,
      suggested_target: '3 / month',
      potential_gain: 0.9,
      action: 'Attend 2-3 tutoring sessions per month for personalized difficult concept reviews.'
    });
  }

  // Sort contributions
  contributions.sort((a, b) => Math.abs(b.impact_points) - Math.abs(a.impact_points));

  return {
    predicted_score: boundedScore,
    grade_letter: gradeLetter,
    performance_band: performanceBand,
    percentile,
    base_score: Math.round(BASE_INTERCEPT * 100) / 100,
    confidence_range: {
      lower_bound: Math.max(0, Math.round((boundedScore - 2.45) * 10) / 10),
      upper_bound: Math.min(100, Math.round((boundedScore + 2.45) * 10) / 10),
      confidence_level: '90% Prediction Interval'
    },
    contributions,
    recommendations: recs.slice(0, 3),
    student_id: student.student_id
  };
}

export function localSimulateWhatIf(base: StudentInput, changes: Partial<StudentInput>): WhatIfResponse {
  const origRes = localPredictSingle(base);
  const updatedStudent: StudentInput = { ...base, ...changes };
  const simRes = localPredictSingle(updatedStudent);

  const attributionChanges = [];
  for (let i = 0; i < origRes.contributions.length; i++) {
    const origC = origRes.contributions[i];
    const simC = simRes.contributions.find(c => c.feature === origC.feature);
    if (simC) {
      const diff = Math.round((simC.impact_points - origC.impact_points) * 100) / 100;
      if (Math.abs(diff) > 0.01) {
        attributionChanges.push({
          feature: origC.feature,
          label: origC.label,
          before_impact: origC.impact_points,
          after_impact: simC.impact_points,
          gain_points: diff
        });
      }
    }
  }

  return {
    original_score: origRes.predicted_score,
    simulated_score: simRes.predicted_score,
    score_delta: Math.round((simRes.predicted_score - origRes.predicted_score) * 100) / 100,
    grade_before: origRes.grade_letter,
    grade_after: simRes.grade_letter,
    attribution_changes: attributionChanges
  };
}
