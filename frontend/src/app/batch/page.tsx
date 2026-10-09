'use client';

import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  RotateCcw,
  Search,
  Award
} from 'lucide-react';
import { StudentInput, BatchPredictionResponse } from '../../types';
import { predictBatch } from '../../lib/api';
import { GRADE_THEMES } from '../../lib/constants';

const SAMPLE_COHORT: StudentInput[] = [
  { Attendance: 95, Hours_Studied: 32, Previous_Scores: 90, Access_to_Resources: 'High', Parental_Involvement: 'High', Tutoring_Sessions: 3, Parental_Education_Level: 'Postgraduate', Peer_Influence: 'Positive', Distance_from_Home: 'Near', Motivation_Level: 'High', Teacher_Quality: 'High', Extracurricular_Activities: 'Yes', Internet_Access: 'Yes', student_id: 'CS-101', student_name: 'Elena Rostova' },
  { Attendance: 88, Hours_Studied: 24, Previous_Scores: 82, Access_to_Resources: 'High', Parental_Involvement: 'Medium', Tutoring_Sessions: 2, Parental_Education_Level: 'College', Peer_Influence: 'Positive', Distance_from_Home: 'Moderate', Motivation_Level: 'High', Teacher_Quality: 'High', Extracurricular_Activities: 'Yes', Internet_Access: 'Yes', student_id: 'CS-102', student_name: 'Marcus Vance' },
  { Attendance: 80, Hours_Studied: 20, Previous_Scores: 74, Access_to_Resources: 'Medium', Parental_Involvement: 'Medium', Tutoring_Sessions: 1, Parental_Education_Level: 'College', Peer_Influence: 'Neutral', Distance_from_Home: 'Near', Motivation_Level: 'Medium', Teacher_Quality: 'Medium', Extracurricular_Activities: 'No', Internet_Access: 'Yes', student_id: 'CS-103', student_name: 'Jordan Lee' },
  { Attendance: 92, Hours_Studied: 26, Previous_Scores: 78, Access_to_Resources: 'Low', Parental_Involvement: 'Medium', Tutoring_Sessions: 0, Parental_Education_Level: 'High School', Peer_Influence: 'Positive', Distance_from_Home: 'Far', Motivation_Level: 'High', Teacher_Quality: 'Medium', Extracurricular_Activities: 'No', Internet_Access: 'Yes', student_id: 'CS-104', student_name: 'Sophia Patel' },
  { Attendance: 65, Hours_Studied: 12, Previous_Scores: 62, Access_to_Resources: 'Low', Parental_Involvement: 'Low', Tutoring_Sessions: 0, Parental_Education_Level: 'High School', Peer_Influence: 'Negative', Distance_from_Home: 'Far', Motivation_Level: 'Low', Teacher_Quality: 'Low', Extracurricular_Activities: 'No', Internet_Access: 'No', student_id: 'CS-105', student_name: 'David Chen' },
  { Attendance: 76, Hours_Studied: 18, Previous_Scores: 70, Access_to_Resources: 'Medium', Parental_Involvement: 'Medium', Tutoring_Sessions: 1, Parental_Education_Level: 'College', Peer_Influence: 'Neutral', Distance_from_Home: 'Near', Motivation_Level: 'Medium', Teacher_Quality: 'High', Extracurricular_Activities: 'Yes', Internet_Access: 'Yes', student_id: 'CS-106', student_name: 'Aisha Robinson' },
  { Attendance: 90, Hours_Studied: 28, Previous_Scores: 85, Access_to_Resources: 'High', Parental_Involvement: 'High', Tutoring_Sessions: 2, Parental_Education_Level: 'College', Peer_Influence: 'Positive', Distance_from_Home: 'Moderate', Motivation_Level: 'High', Teacher_Quality: 'High', Extracurricular_Activities: 'Yes', Internet_Access: 'Yes', student_id: 'CS-107', student_name: 'Liam Gallagher' },
  { Attendance: 60, Hours_Studied: 10, Previous_Scores: 55, Access_to_Resources: 'Low', Parental_Involvement: 'Low', Tutoring_Sessions: 0, Parental_Education_Level: 'High School', Peer_Influence: 'Negative', Distance_from_Home: 'Moderate', Motivation_Level: 'Low', Teacher_Quality: 'Low', Extracurricular_Activities: 'No', Internet_Access: 'Yes', student_id: 'CS-108', student_name: 'Noah Bennett' }
];

export default function BatchPage() {
  const [students, setStudents] = useState<StudentInput[]>(SAMPLE_COHORT);
  const [batchResult, setBatchResult] = useState<BatchPredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const executeBatch = async (data: StudentInput[]) => {
    setIsLoading(true);
    try {
      const res = await predictBatch(data);
      setBatchResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [
      'student_id', 'student_name', 'Attendance', 'Hours_Studied', 'Previous_Scores',
      'Access_to_Resources', 'Parental_Involvement', 'Tutoring_Sessions',
      'Parental_Education_Level', 'Peer_Influence', 'Distance_from_Home',
      'Motivation_Level', 'Teacher_Quality', 'Extracurricular_Activities', 'Internet_Access'
    ];
    const rows = SAMPLE_COHORT.map(s => [
      s.student_id, s.student_name, s.Attendance, s.Hours_Studied, s.Previous_Scores,
      s.Access_to_Resources, s.Parental_Involvement, s.Tutoring_Sessions,
      s.Parental_Education_Level, s.Peer_Influence, s.Distance_from_Home,
      s.Motivation_Level, s.Teacher_Quality, s.Extracurricular_Activities, s.Internet_Access
    ].join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'student_cohort_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredResults = batchResult?.results.filter((res, idx) => {
    const student = students[idx];
    const nameMatch = student.student_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const idMatch = student.student_id?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || idMatch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <FileSpreadsheet className="w-3 h-3" />
              Classroom & Institutional Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cohort Batch Score Prediction
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Process entire student lists, compute class grade distributions, and pinpoint individuals requiring targeted academic intervention.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 shadow-sm transition-all hover:border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>CSV Template</span>
          </button>
          <button
            onClick={() => executeBatch(students)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Processing...' : 'Run Cohort Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Summary Statistics (when computed) */}
      {batchResult && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono uppercase text-slate-400 block">Class Average</span>
            <div className="text-2xl font-extrabold font-mono text-white mt-1">
              {batchResult.summary.class_average.toFixed(1)} <span className="text-xs text-slate-400 font-normal">pts</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Baseline: 67.2 pts</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono uppercase text-slate-400 block">Projected Pass Rate</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">
              {batchResult.summary.pass_rate}%
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Score ≥ 60 pts</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono uppercase text-slate-400 block">Highest Projection</span>
            <div className="text-2xl font-extrabold font-mono text-indigo-400 mt-1">
              {batchResult.summary.highest_score.toFixed(1)}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Honors Candidate</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono uppercase text-slate-400 block">Lowest Projection</span>
            <div className="text-2xl font-extrabold font-mono text-rose-400 mt-1">
              {batchResult.summary.lowest_score.toFixed(1)}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Intervention Priority</span>
          </div>
        </div>
      )}

      {/* Cohort Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 shadow-elevated overflow-hidden">
        
        {/* Table Search & Filter Bar */}
        <div className="p-4 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/40">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {students.length} Records Loaded
            </span>
          </div>

          {!batchResult && (
            <button
              onClick={() => executeBatch(students)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              Click "Run Cohort Analysis" to calculate scores →
            </button>
          )}
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Attendance</th>
                <th className="py-3 px-3">Weekly Hours</th>
                <th className="py-3 px-3">Prior Score</th>
                <th className="py-3 px-3">Resources</th>
                <th className="py-3 px-4 text-right">Forecast Score</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4">Academic Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {students.map((student, idx) => {
                const res = batchResult?.results[idx];
                const theme = res ? GRADE_THEMES[res.grade_letter] || GRADE_THEMES['C'] : null;
                const isPass = res ? res.predicted_score >= 60 : null;

                if (searchTerm) {
                  const match = student.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.student_id?.toLowerCase().includes(searchTerm.toLowerCase());
                  if (!match) return null;
                }

                return (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-100">{student.student_name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{student.student_id}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-emerald-400">
                      {student.Attendance}%
                    </td>
                    <td className="py-3 px-3 font-mono text-indigo-300">
                      {student.Hours_Studied} hrs
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-300">
                      {student.Previous_Scores} pts
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium">
                        {student.Access_to_Resources}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-sm">
                      {res ? (
                        <span className={res.predicted_score >= 75 ? 'text-emerald-400' : res.predicted_score >= 60 ? 'text-slate-200' : 'text-rose-400'}>
                          {res.predicted_score.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono">--</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {res && theme ? (
                        <span className={`inline-block px-2.5 py-0.5 rounded-lg font-mono font-bold text-xs border ${theme.bg} ${theme.text} ${theme.border}`}>
                          {res.grade_letter}
                        </span>
                      ) : (
                        <span className="text-slate-500">--</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {res ? (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${isPass ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPass ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                          <span>{res.performance_band}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">Pending Evaluation</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
