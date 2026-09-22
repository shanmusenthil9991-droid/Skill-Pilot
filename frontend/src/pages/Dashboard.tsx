import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Code2,
  Binary,
  Globe,
  Sparkles,
  Target,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Cpu,
  Flame,
  Award,
  BookOpen
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/common/StatCard';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';

export const Dashboard: React.FC = () => {
  const { student } = useAuth();
  const navigate = useNavigate();

  const [academics, setAcademics] = useState<any>(null);
  const [coding, setCoding] = useState<any>(null);
  const [dsa, setDsa] = useState<any>(null);
  const [onlineCoding, setOnlineCoding] = useState<any>(null);
  const [placement, setPlacement] = useState<any>(null);
  const [career, setCareer] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const dept = (student?.dept_code || '').toUpperCase();
  const isCoreDept = ['ECE', 'EEE', 'MECH', 'CIVIL', 'MECHANICAL'].includes(dept);
  const isECE = dept === 'ECE';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [acadRes, codingRes, dsaRes, onlineRes, placeRes, careerRes, recRes] = await Promise.all([
          api.get('/student/academics').catch(() => ({ data: null })),
          api.get('/coding/languages').catch(() => ({ data: null })),
          api.get('/coding/dsa').catch(() => ({ data: null })),
          api.get('/online-coding/summary').catch(() => ({ data: null })),
          api.get('/placement/readiness').catch(() => ({ data: null })),
          api.get('/career/domains').catch(() => ({ data: null })),
          api.get('/recommendations').catch(() => ({ data: { recommendations: [] } })),
        ]);

        setAcademics(acadRes.data);
        setCoding(codingRes.data);
        setDsa(dsaRes.data);
        setOnlineCoding(onlineRes.data);
        setPlacement(placeRes.data);
        setCareer(careerRes.data);
        setRecommendations(recRes.data?.recommendations || []);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [student]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">Loading SkillPilot Intelligence Cockpit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
              <Sparkles className="h-3.5 w-3.5 text-slate-600" />
              <span>Skill & Career Intelligence Engine Active</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, {student?.name}
            </h1>
            <p className="text-xs md:text-sm text-slate-500 max-w-2xl leading-relaxed">
              {student?.department} • Year {student?.year}, Semester {student?.semester} • Student ID: <span className="font-mono font-bold text-slate-700">{student?.student_id}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/placement-readiness')}
              className="flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2.5 text-xs font-bold hover:bg-slate-800 transition shadow-xs"
            >
              <Sparkles className="h-4 w-4" />
              Placement Readiness
            </button>
            <button
              onClick={() => navigate('/career-opportunities')}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
            >
              <Target className="h-4 w-4 text-slate-600" />
              {isECE ? 'ECE Dual-Pathway' : 'Career Engine'}
            </button>
          </div>
        </div>
      </div>

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Academic Standing"
          value={`${student?.cgpa.toFixed(2)} CGPA`}
          subtitle={`Attendance: ${student?.attendance_pct.toFixed(1)}%`}
          icon={GraduationCap}
          accentColor="brand"
          trend={{ value: 'Top 10%', isPositive: true }}
          onClick={() => navigate('/academics')}
        />
        <StatCard
          title={isCoreDept ? 'Core Domain Mastery' : 'Programming Mastery'}
          value={`${coding?.overall_programming_score || 85}%`}
          subtitle={isCoreDept ? `${coding?.languages?.length || 5} Core Modules Tracked` : `${coding?.languages?.length || 6} Languages Tracked`}
          icon={isCoreDept ? Cpu : Code2}
          accentColor="cyan"
          trend={{ value: '+4.2%', isPositive: true }}
          onClick={() => navigate('/programming-skills')}
        />
        <StatCard
          title={isCoreDept ? 'Technical Topic Mastery' : 'DSA Accuracy'}
          value={`${dsa?.overall_dsa_accuracy || 84}%`}
          subtitle={`${dsa?.total_problems_solved || 120} Problems / Topics Completed`}
          icon={Binary}
          accentColor="emerald"
          trend={{ value: 'Active Curriculum', neutral: true }}
          onClick={() => navigate('/dsa-analysis')}
        />
        <StatCard
          title="Online Coding Hub"
          value={`${onlineCoding?.total_solved || 185} Solved`}
          subtitle={`Rating: ${onlineCoding?.contest_rating || 1640} (${onlineCoding?.global_rank || 'Top 15%'})`}
          icon={Globe}
          accentColor="amber"
          trend={{ value: `${onlineCoding?.coding_streak_days || 14} Day Streak`, isPositive: true }}
          onClick={() => navigate('/online-coding')}
        />
      </div>

      {/* Main Intelligence Grid: ML Placement Cockpit & Career Domain Engine */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ML Placement Readiness Summary Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-slate-800">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">ML Placement Readiness Cockpit</h3>
                  <p className="text-[11px] text-slate-500">Ensemble Model Prediction & Weight Contributions</p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">
                93% Confidence
              </span>
            </div>

            <div className="my-6 flex flex-col items-center justify-center">
              <ScoreGauge
                score={placement?.readiness_score || 88}
                size={160}
                strokeWidth={12}
                label="READINESS"
                sublabel={placement?.readiness_status || 'High Placement Readiness'}
              />
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Top Contributing Factors
              </div>
              {placement?.top_positive_factors?.slice(0, 3).map((item: any, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">{item.factor}: </span>
                    <span className="text-slate-600">{item.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/placement-readiness')}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <span>View Complete ML Factor Breakdown</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* ECE Dual-Pathway / Department Career Domain Engine */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-slate-800">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isECE ? 'ECE Dual-Pathway Career Intelligence' : 'Target Career Domain Alignment'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Domain Fit & Competency Breakdown</p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">
                {isECE ? 'Dual Scoring' : `${student?.dept_code} Specialized`}
              </span>
            </div>

            {isECE ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">CORE HARDWARE / ECE PATHWAY</span>
                    <span className="text-xs font-extrabold text-blue-600">86.3% Fit</span>
                  </div>
                  <ProgressBar value={86.3} color="brand" size="sm" showPercentage={false} />
                  <p className="text-[11px] text-slate-600">
                    Strong alignment in Embedded Systems, Microcontrollers, FreeRTOS, and VLSI.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">✓ Embedded C</span>
                    <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">✓ FreeRTOS</span>
                    <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">✓ ESP32 / IoT</span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">SOFTWARE / CS PATHWAY</span>
                    <span className="text-xs font-extrabold text-blue-600">78.5% Fit</span>
                  </div>
                  <ProgressBar value={78.5} color="brand" size="sm" showPercentage={false} />
                  <p className="text-[11px] text-slate-600">
                    High Python & REST API competency; expand Dynamic Programming & Scalability.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">✓ Python API</span>
                    <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">✓ SQL Databases</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {career?.all_domains?.slice(0, 3).map((dom: any, idx: number) => (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{dom.domain_name}</span>
                      <span className="text-xs font-extrabold text-blue-600">{dom.alignment_score}%</span>
                    </div>
                    <ProgressBar value={dom.alignment_score} color="brand" size="sm" showPercentage={false} />
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(dom.completed_skills || dom.matching_skills)?.slice(0, 4).map((s: string, sIdx: number) => (
                        <span key={sIdx} className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/career-opportunities')}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <span>Explore Complete Career Pathways</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Prioritized Actionable Recommendations Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-slate-800">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Prioritized Next Actions</h3>
              <p className="text-[11px] text-slate-500">Structured What • Why • Next Step Guidance</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/recommendations')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All ({recommendations.length})
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {recommendations.slice(0, 3).map((rec, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-800">
                    {rec.priority} Priority
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">{rec.category}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{rec.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-800">Why: </span>{rec.why}
                </p>
              </div>
              <div className="rounded-lg bg-slate-100 border border-slate-200 p-2.5 text-[11px] text-slate-800">
                <span className="font-bold text-slate-900">Next Step: </span>
                {rec.next_step}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

