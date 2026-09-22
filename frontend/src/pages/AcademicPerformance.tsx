import React, { useEffect, useState } from 'react';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  Layers,
  BookOpen,
  Award,
  TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import api from '../services/api';
import { AcademicsSummary } from '../types';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';

export const AcademicPerformance: React.FC = () => {
  const [data, setData] = useState<AcademicsSummary | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcademics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/student/academics');
        setData(res.data);
        if (res.data.semesters && res.data.semesters.length > 0) {
          setSelectedSemester(res.data.semesters[res.data.semesters.length - 1].semester_number);
        }
      } catch (err) {
        console.error('Failed to load academic data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAcademics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const currentSemDetails = data?.semesters?.find(s => s.semester_number === selectedSemester);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
          <GraduationCap className="h-4 w-4" />
          Curriculum & Grades Intelligence
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Academic Performance & Analytics</h1>
        <p className="text-xs text-slate-500 mt-1">
          Track semester-wise SGPA trajectories, cumulative CGPA growth, and subject-level credit performance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Cumulative CGPA"
          value={`${data?.overall_cgpa.toFixed(2)} / 10.0`}
          subtitle="All Semesters Combined"
          icon={GraduationCap}
          accentColor="brand"
          trend={{ value: '+0.18 SGPA Improvement', isPositive: true }}
        />
        <StatCard
          title="Overall Attendance"
          value={`${data?.overall_attendance_pct.toFixed(1)}%`}
          subtitle="Mandatory Minimum 75%"
          icon={CheckCircle2}
          accentColor="emerald"
          trend={{ value: 'Eligible for All Exams', isPositive: true }}
        />
        <StatCard
          title="Active Backlogs"
          value={data?.total_backlogs || 0}
          subtitle="Zero Backlog Standing"
          icon={Layers}
          accentColor="cyan"
          trend={{ value: 'Clean Record', isPositive: true }}
        />
        <StatCard
          title="Completed Semesters"
          value={`${data?.semesters?.length || 6} / 8`}
          subtitle={`Current: Semester ${data?.current_semester || 6}`}
          icon={Calendar}
          accentColor="violet"
          trend={{ value: 'On Track for Grad', neutral: true }}
        />
      </div>

      {/* Charts Section: SGPA/CGPA Trend Line & Attendance Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Line */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">CGPA vs SGPA Trend</h3>
              <p className="text-[11px] text-slate-500">Progression across completed academic semesters</p>
            </div>
            <Badge variant="primary" size="sm">Academic Trend</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.cgpa_trend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="semester" stroke="#64748b" fontSize={11} />
                <YAxis domain={[6.0, 10.0]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="sgpa" name="Semester SGPA" stroke="#0284c7" strokeWidth={3} dot={{ r: 4, fill: '#0284c7' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="cgpa" name="Cumulative CGPA" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Bar Chart */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Semester Attendance Progression</h3>
              <p className="text-[11px] text-slate-500">Classroom engagement and practical lab presence</p>
            </div>
            <Badge variant="success" size="sm">&gt; 80% Consistent</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.cgpa_trend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="semester" stroke="#64748b" fontSize={11} />
                <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="attendance" name="Attendance %" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Semester Selector Tabs & Subject Performance Table */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              Subject-Level Performance Breakdown
            </h3>
            <p className="text-[11px] text-slate-500">Select any semester to view credits, marks percentage and letter grades</p>
          </div>

          {/* Semester Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {data?.semesters?.map((s) => (
              <button
                key={s.semester_number}
                onClick={() => setSelectedSemester(s.semester_number)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-2xs ${
                  selectedSemester === s.semester_number
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Semester {s.semester_number}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Semester Summary Bar */}
        {currentSemDetails && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl bg-blue-50/40 p-4 border border-blue-100 text-center">
            <div className="p-2 bg-white rounded-xl border border-blue-100/60 shadow-2xs">
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Semester {selectedSemester} SGPA</div>
              <div className="text-lg font-black text-blue-700 mt-0.5">{currentSemDetails.sgpa.toFixed(2)} / 10.0</div>
            </div>
            <div className="p-2 bg-white rounded-xl border border-blue-100/60 shadow-2xs">
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Credits Earned / Total</div>
              <div className="text-lg font-black text-slate-900 mt-0.5">{currentSemDetails.credits_earned} / {currentSemDetails.credits_total} Credits</div>
            </div>
            <div className="p-2 bg-white rounded-xl border border-blue-100/60 shadow-2xs">
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Active Backlogs</div>
              <div className="text-lg font-black text-emerald-600 mt-0.5">{currentSemDetails.backlogs === 0 ? '0 (Clean Record)' : currentSemDetails.backlogs}</div>
            </div>
          </div>
        )}

        {/* Subjects Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px] bg-slate-50">
              <tr>
                <th className="py-3.5 px-4">Subject Code</th>
                <th className="py-3.5 px-4">Subject Name</th>
                <th className="py-3.5 px-4">Credits</th>
                <th className="py-3.5 px-4">Marks %</th>
                <th className="py-3.5 px-4">Letter Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 bg-white">
              {currentSemDetails?.subjects?.map((subj, idx) => (
                <tr key={`${selectedSemester}-${subj.subject_code}-${idx}`} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-blue-700 font-bold">{subj.subject_code}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{subj.subject_name}</td>
                  <td className="py-3 px-4 font-bold text-slate-700">{subj.credits} Credits</td>
                  <td className="py-3 px-4 font-bold text-slate-700">{subj.marks_pct}%</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        subj.grade === 'S' || subj.grade === 'A+' || subj.grade === 'O'
                          ? 'success'
                          : subj.grade === 'A'
                          ? 'primary'
                          : 'warning'
                      }
                      size="sm"
                    >
                      Grade {subj.grade}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

