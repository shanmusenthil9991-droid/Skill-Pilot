import React, { useEffect, useState } from 'react';
import {
  MessageSquareText,
  AlertCircle,
  Award,
  BookOpen
} from 'lucide-react';
import api from '../services/api';
import { VerbalTopicItem } from '../types';
import { StatCard } from '../components/common/StatCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';

export const VerbalAbility: React.FC = () => {
  const [topics, setTopics] = useState<VerbalTopicItem[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerbal = async () => {
      try {
        setLoading(true);
        const res = await api.get('/cognitive/verbal');
        setTopics(res.data.topics || []);
        setOverallScore(res.data.overall_verbal_score || 0);
      } catch (err) {
        console.error('Failed to load verbal data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVerbal();
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
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 uppercase tracking-wider mb-1">
          <MessageSquareText className="h-4 w-4" />
          Language & Verbal Intelligence
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Verbal Ability & Grammar Analytics</h1>
        <p className="text-xs text-slate-500 mt-1">
          Tracking grammar, vocabulary, reading comprehension, sentence correction, and verbal reasoning competencies.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Overall Verbal Score"
          value={`${overallScore}%`}
          subtitle="Comprehensive Verbal Benchmark"
          icon={Award}
          accentColor="cyan"
          trend={{ value: 'Above Industry Standard', isPositive: true }}
        />
        <StatCard
          title="Verbal Topics Tracked"
          value={`${topics.length}`}
          subtitle="Grammar, RC, Vocab, Para Jumbles"
          icon={BookOpen}
          accentColor="brand"
          trend={{ value: 'Full Syllabus Evaluated', neutral: true }}
        />
        <StatCard
          title="Weak Topics Identified"
          value={`${topics.filter(t => t.is_weak_topic).length}`}
          subtitle="Targeted For Verbal Revision"
          icon={AlertCircle}
          accentColor="amber"
          trend={{ value: 'Actionable Tips Provided', neutral: true }}
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
                  <span className="text-[10px] text-slate-500 font-medium">Verbal Ability Module</span>
                </div>
                <Badge
                  variant={t.is_weak_topic ? 'warning' : 'success'}
                  size="sm"
                >
                  {t.is_weak_topic ? 'Needs Practice' : 'Proficient'}
                </Badge>
              </div>

              <div className="space-y-3 bg-slate-50/70 rounded-2xl p-3.5 border border-slate-200/80">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Topic Completion:</span>
                    <span className="font-extrabold text-slate-900">{t.completion_pct}%</span>
                  </div>
                  <ProgressBar value={t.completion_pct} color="cyan" size="sm" showPercentage={false} />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Assessment Score:</span>
                    <span className="font-extrabold text-brand-700">{t.assessment_score}%</span>
                  </div>
                  <ProgressBar value={t.assessment_score} color="brand" size="sm" showPercentage={false} />
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                  <span className="text-slate-600 font-medium">Accuracy:</span>
                  <span className="font-extrabold text-emerald-700">{t.accuracy_pct}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

