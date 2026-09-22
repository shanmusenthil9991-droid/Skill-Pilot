import React, { useEffect, useState } from 'react';
import {
  Brain,
  CheckCircle2,
  Award,
  Layers
} from 'lucide-react';
import api from '../services/api';
import { LogicalTopicItem } from '../types';
import { StatCard } from '../components/common/StatCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';

export const LogicalReasoning: React.FC = () => {
  const [topics, setTopics] = useState<LogicalTopicItem[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogical = async () => {
      try {
        setLoading(true);
        const res = await api.get('/cognitive/logical');
        setTopics(res.data.topics || []);
        setOverallScore(res.data.overall_logical_score || 0);
      } catch (err) {
        console.error('Failed to load logical data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogical();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-violet-700 uppercase tracking-wider mb-1">
          <Brain className="h-4 w-4" />
          Analytical & Logical Intelligence
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Logical Reasoning Analysis</h1>
        <p className="text-xs text-slate-500 mt-1">
          Tracking inductive and deductive logic: Series, Coding-Decoding, Syllogisms, Seating Arrangements, Clocks & Puzzles.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Overall Logical Score"
          value={`${overallScore}%`}
          subtitle="Analytical Deduction Index"
          icon={Award}
          accentColor="violet"
          trend={{ value: 'Top 15% Cognitive Rank', isPositive: true }}
        />
        <StatCard
          title="Logical Topics Evaluated"
          value={`${topics.length}`}
          subtitle="Comprehensive Test Coverage"
          icon={Layers}
          accentColor="brand"
          trend={{ value: '100% Modules Attempted', isPositive: true }}
        />
        <StatCard
          title="Completed Modules"
          value={`${topics.filter(t => t.status === 'Completed').length} / ${topics.length}`}
          subtitle="Finished Logic Categories"
          icon={CheckCircle2}
          accentColor="emerald"
          trend={{ value: 'High Logical Consistency', isPositive: true }}
        />
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {topics.map((t) => (
          <div
            key={t.id}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{t.topic_name}</h3>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {t.completed_modules} / {t.total_modules} Modules Finished
                  </span>
                </div>
                <Badge
                  variant={t.status === 'Completed' ? 'success' : 'primary'}
                  size="sm"
                >
                  {t.status}
                </Badge>
              </div>

              <div className="space-y-3 bg-slate-50/70 rounded-2xl p-3.5 border border-slate-200/80">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Accuracy:</span>
                    <span className="font-extrabold text-emerald-700">{t.accuracy_pct}%</span>
                  </div>
                  <ProgressBar value={t.accuracy_pct} color="emerald" size="sm" showPercentage={false} />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Assessment Score:</span>
                    <span className="font-extrabold text-brand-700">{t.assessment_score}%</span>
                  </div>
                  <ProgressBar value={t.assessment_score} color="brand" size="sm" showPercentage={false} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              <span>Strength: <strong className="text-slate-800 font-semibold">{t.strength_level}</strong></span>
              <span className="text-brand-700 font-bold">{Math.max(0, t.total_modules - t.completed_modules)} Left</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

