import { StudentInput, StudentPreset } from '../types';

export const DEFAULT_STUDENT: StudentInput = {
  // Core Predictive Features
  Attendance: 85,
  Hours_Studied: 22,
  Previous_Scores: 78,
  Access_to_Resources: 'High',
  Parental_Involvement: 'Medium',
  Tutoring_Sessions: 2,
  Parental_Education_Level: 'College',
  Peer_Influence: 'Positive',
  Distance_from_Home: 'Near',
  Motivation_Level: 'High',
  Teacher_Quality: 'High',
  Extracurricular_Activities: 'Yes',
  Internet_Access: 'Yes',

  // Profile & Lifestyle Features
  Sleep_Hours: 7,
  Physical_Activity: 3,
  School_Type: 'Public',
  Family_Income: 'Medium',
  Gender: 'Female',
  Learning_Disabilities: 'No',

  student_id: 'STU-2026-08',
  student_name: 'Alex Morgan'
};

export const PRESET_STUDENTS: StudentPreset[] = [
  {
    id: 'top-achiever',
    name: 'Honor Student',
    description: 'High attendance (96%), 32 hrs study/wk, strong resources and motivation',
    badge: 'Grade A / Top 5%',
    data: {
      Attendance: 96,
      Hours_Studied: 32,
      Previous_Scores: 92,
      Access_to_Resources: 'High',
      Parental_Involvement: 'High',
      Tutoring_Sessions: 3,
      Parental_Education_Level: 'Postgraduate',
      Peer_Influence: 'Positive',
      Distance_from_Home: 'Near',
      Motivation_Level: 'High',
      Teacher_Quality: 'High',
      Extracurricular_Activities: 'Yes',
      Internet_Access: 'Yes',
      Sleep_Hours: 8,
      Physical_Activity: 4,
      School_Type: 'Private',
      Family_Income: 'High',
      Gender: 'Female',
      Learning_Disabilities: 'No',
      student_id: 'PRESET-01',
      student_name: 'Elena Rostova'
    }
  },
  {
    id: 'balanced-average',
    name: 'Average Student',
    description: 'Typical attendance (80%), 20 hrs study/wk, medium resources and support',
    badge: 'Grade B / Class Median',
    data: {
      Attendance: 80,
      Hours_Studied: 20,
      Previous_Scores: 72,
      Access_to_Resources: 'Medium',
      Parental_Involvement: 'Medium',
      Tutoring_Sessions: 1,
      Parental_Education_Level: 'College',
      Peer_Influence: 'Neutral',
      Distance_from_Home: 'Moderate',
      Motivation_Level: 'Medium',
      Teacher_Quality: 'Medium',
      Extracurricular_Activities: 'Yes',
      Internet_Access: 'Yes',
      Sleep_Hours: 7,
      Physical_Activity: 3,
      School_Type: 'Public',
      Family_Income: 'Medium',
      Gender: 'Male',
      Learning_Disabilities: 'No',
      student_id: 'PRESET-02',
      student_name: 'Jordan Lee'
    }
  },
  {
    id: 'at-risk',
    name: 'Needs Help / Low Attendance',
    description: 'Low attendance (62%), only 10 hrs study/wk, low resources, requires support',
    badge: 'Grade D-F / At Risk',
    data: {
      Attendance: 62,
      Hours_Studied: 10,
      Previous_Scores: 58,
      Access_to_Resources: 'Low',
      Parental_Involvement: 'Low',
      Tutoring_Sessions: 0,
      Parental_Education_Level: 'High School',
      Peer_Influence: 'Negative',
      Distance_from_Home: 'Far',
      Motivation_Level: 'Low',
      Teacher_Quality: 'Low',
      Extracurricular_Activities: 'No',
      Internet_Access: 'No',
      Sleep_Hours: 6,
      Physical_Activity: 1,
      School_Type: 'Public',
      Family_Income: 'Low',
      Gender: 'Male',
      Learning_Disabilities: 'No',
      student_id: 'PRESET-03',
      student_name: 'Marcus Vance'
    }
  },
  {
    id: 'high-potential',
    name: 'High Effort / Low Resources',
    description: 'High diligence (94% attendance, 26 hrs study) working hard despite limited access',
    badge: 'Grade B+ / High Effort',
    data: {
      Attendance: 94,
      Hours_Studied: 26,
      Previous_Scores: 74,
      Access_to_Resources: 'Low',
      Parental_Involvement: 'Medium',
      Tutoring_Sessions: 0,
      Parental_Education_Level: 'High School',
      Peer_Influence: 'Positive',
      Distance_from_Home: 'Far',
      Motivation_Level: 'High',
      Teacher_Quality: 'Medium',
      Extracurricular_Activities: 'No',
      Internet_Access: 'Yes',
      Sleep_Hours: 7,
      Physical_Activity: 2,
      School_Type: 'Public',
      Family_Income: 'Low',
      Gender: 'Female',
      Learning_Disabilities: 'No',
      student_id: 'PRESET-04',
      student_name: 'Sophia Patel'
    }
  }
];

export const COHORT_BENCHMARKS = {
  sampleSize: 6607,
  meanScore: 67.24,
  stdScore: 3.89,
  minScore: 55.0,
  maxScore: 100.0,
  meanAttendance: 79.98,
  meanStudyHours: 19.98,
  meanPreviousScore: 74.99
};

export const GRADE_THEMES: Record<string, { bg: string; text: string; border: string; glow: string; label: string }> = {
  'A+': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]', label: 'Exceptional (Honors)' },
  'A':  { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]', label: 'Excellent Mastery' },
  'A-': { bg: 'bg-teal-500/10',    text: 'text-teal-400',    border: 'border-teal-500/30',    glow: 'shadow-[0_0_20px_rgba(20,184,166,0.25)]', label: 'Very Good' },
  'B+': { bg: 'bg-cyan-500/10',    text: 'text-cyan-400',    border: 'border-cyan-500/30',    glow: 'shadow-[0_0_20px_rgba(6,182,212,0.25)]', label: 'Above Average' },
  'B':  { bg: 'bg-blue-500/10',    text: 'text-blue-400',    border: 'border-blue-500/30',    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.25)]', label: 'Good Standing' },
  'C+': { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/30',   glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]', label: 'Average' },
  'C':  { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/30',   glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',  label: 'Passing' },
  'D':  { bg: 'bg-orange-500/10',  text: 'text-orange-400',  border: 'border-orange-500/30',  glow: 'shadow-[0_0_20px_rgba(249,115,22,0.25)]', label: 'Borderline' },
  'F':  { bg: 'bg-rose-500/10',    text: 'text-rose-400',    border: 'border-rose-500/30',    glow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]',  label: 'Needs Intervention' },
};
