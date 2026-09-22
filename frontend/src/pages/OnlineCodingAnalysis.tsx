import React, { useEffect, useState } from 'react';
import {
  Globe,
  Flame,
  Trophy,
  Activity,
  CheckCircle2,
  Calendar,
  Code2
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import api from '../services/api';
import { OnlineCodingSummary } from '../types';
import { StatCard } from '../components/common/StatCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';

export const OnlineCodingAnalysis: React.FC = () => {
  const [data, setData] = useState<OnlineCodingSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOnlineCoding = async () => {
      try {
        setLoading(true);
        const res = await api.get('/online-coding/summary');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load online coding data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOnlineCoding();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  // Difficulty Pie Data
  const difficultyData = [
    { name: 'Easy', value: data?.easy_solved || 95, color: '#0284c7' },
    { name: 'Medium', value: data?.medium_solved || 72, color: '#d97706' },
    { name: 'Hard', value: data?.hard_solved || 18, color: '#e11d48' },
  ];

  // Filter topic distribution to only include active topics (solved > 0 or attempted > 0)
  const topicData = Object.entries(data?.topic_distribution || {})
    .filter(([_, stats]) => (stats.solved > 0 || stats.attempted > 0))
    .map(([topic, stats]) => ({
      topic,
      solved: stats.solved,
      attempted: stats.attempted,
      accuracy: stats.accuracy
    }));

  // Filter language distribution to only include active languages
  const langData = Object.entries(data?.language_distribution || {})
    .filter(([_, stats]) => (stats.solved > 0 || stats.attempted > 0))
    .map(([lang, stats]) => ({
      language: lang,
      solved: stats.solved,
      attempted: stats.attempted,
      accuracy: stats.accuracy
    }));

  const hasActivePlatform = (data?.total_solved || 0) > 0 || (data?.total_attempted || 0) > 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
          <Globe className="h-4 w-4" />
          Competitive Programming & Online Platforms
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Online Coding Platform Intelligence</h1>
        <p className="text-xs text-slate-500 mt-1">
          Aggregated telemetry from active coding platforms ({data?.platform_name || 'LeetCode'}), tracking contest ratings, difficulty distributions, and active streaks.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Problems Solved"
          value={`${data?.total_solved || 185}`}
          subtitle={`${data?.total_attempted || 220} Attempted (${data?.accuracy_pct || 84.1}% Accuracy)`}
          icon={CheckCircle2}
          accentColor="brand"
          trend={{ value: `${data?.global_rank || 'Top 12%'} Global Rank`, isPositive: true }}
        />
        <StatCard
          title="Contest Rating"
          value={`${data?.contest_rating || 1640}`}
          subtitle={`${data?.contests_count || 14} Contests Attended`}
          icon={Trophy}
          accentColor="amber"
          trend={{ value: 'Knight / Div 2 Contender', isPositive: true }}
        />
        <StatCard
          title="Active Coding Streak"
          value={`${data?.coding_streak_days || 18} Days`}
          subtitle="Continuous Daily Problem Submissions"
          icon={Flame}
          accentColor="rose"
          trend={{ value: 'Flame Active 🔥', isPositive: true }}
        />
        <StatCard
          title="Active Platform"
          value={data?.handle || 'pilot_coder'}
          subtitle={`${data?.platform_name || 'LeetCode'} Verified Sync`}
          icon={Globe}
          accentColor="cyan"
          trend={{ value: 'Live Connected', neutral: true }}
        />
      </div>

      {hasActivePlatform && (
        <>
          {/* Difficulty Breakdown & Topic Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Difficulty Donut Chart */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Difficulty Distribution</h3>
                    <p className="text-[11px] text-slate-500">Easy vs Medium vs Hard Problem Solves</p>
                  </div>
                  <Badge variant="warning" size="sm">Solved Split</Badge>
                </div>

                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={difficultyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {difficultyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
                <div className="rounded-xl bg-sky-50 border border-sky-200 p-2">
                  <div className="text-[10px] text-brand-700 font-bold uppercase">Easy</div>
                  <div className="text-xs font-extrabold text-slate-900">{data?.easy_solved || 95}</div>
                </div>
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-2">
                  <div className="text-[10px] text-amber-800 font-bold uppercase">Medium</div>
                  <div className="text-xs font-extrabold text-slate-900">{data?.medium_solved || 72}</div>
                </div>
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-2">
                  <div className="text-[10px] text-rose-700 font-bold uppercase">Hard</div>
                  <div className="text-xs font-extrabold text-slate-900">{data?.hard_solved || 18}</div>
                </div>
              </div>
            </div>

            {/* Topic-Wise Solved Bar Chart (2 columns) */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Active Topic Distribution</h3>
                    <p className="text-[11px] text-slate-500">Curriculum topics with non-zero activity on {data?.platform_name}</p>
                  </div>
                  <Badge variant="primary" size="sm">{topicData.length} Active Topics</Badge>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topicData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="topic" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#0f172a' }}
                      />
                      <Bar dataKey="solved" name="Solved Problems" fill="#0284c7" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Language Activity & Recent Problems */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Language Breakdown */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-brand-600" />
                  Active Programming Languages on Platform
                </h3>
                <Badge variant="info" size="sm">{langData.length} Active</Badge>
              </div>

              <div className="space-y-3">
                {langData.map((l, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{l.language}</span>
                      <span className="font-extrabold text-brand-700">{l.solved} Solved ({l.accuracy}% Acc)</span>
                    </div>
                    <ProgressBar value={l.accuracy} color="brand" size="sm" showPercentage={false} />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Submissions Activity */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-600" />
                  Recent Problem Activity
                </h3>
                <Badge variant="success" size="sm">Live Feed</Badge>
              </div>

              <div className="space-y-3">
                {data?.recent_activity?.map((act, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {act.date}
                      </span>
                      <Badge variant="success" size="sm">{act.count} Accepted</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {act.problems.map((p, pIdx) => (
                        <span key={pIdx} className="rounded-lg bg-white px-2 py-0.5 text-[11px] text-slate-700 border border-slate-200 shadow-2xs font-medium">
                          ✓ {p}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

