import React, { useEffect, useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowUpRight
} from 'lucide-react';
import api from '../services/api';
import { AptitudeTopicItem } from '../types';
import { StatCard } from '../components/common/StatCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';

export const AptitudeAnalysis: React.FC = () => {
  const [topics, setTopics] = useState<AptitudeTopicItem[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [overallAccuracy, setOverallAccuracy] = useState<number>(0);
  const [strongCount, setStrongCount] = useState<number>(0);
  const [weakCount, setWeakCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAptitude = async () => {
      try {
        setLoading(true);
        const res = await api.get('/cognitive/aptitude');
        setTopics(res.data.topics || []);
        setOverallScore(res.data.overall_aptitude_score || 0);
        setOverallAccuracy(res.data.overall_accuracy_pct || 0);
        setStrongCount(res.data.strong_topics_count || 0);
        setWeakCount(res.data.weak_topics_count || 0);
      } catch (err) {
        console.error('Failed to load aptitude data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAptitude();
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
        <div className="flex items-center gap-2 text-xs font-bold text-brand-700 uppercase tracking-wider mb-1">
          <Calculator className="h-4 w-4" />
          Quantitative Aptitude & Mathematical Reasoning
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Quantitative Aptitude Analysis</h1>
        <p className="text-xs text-slate-500 mt-1">
          Analysis of mathematical competencies: Number System, Ratio, Time & Work, Probability, and Data Interpretation.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Aptitude Score"
          value={`${overallScore}%`}
          subtitle="Weighted Quantitative Score"
          icon={Award}
          accentColor="brand"
          trend={{ value: 'Above Placement Cutoff (70%)', isPositive: true }}
        />
        <StatCard
          title="Overall Accuracy"
          value={`${overallAccuracy}%`}
          subtitle="Correct Problem Submissions"
          icon={CheckCircle2}
          accentColor="emerald"
          trend={{ value: 'High First Attempt Rate', isPositive: true }}
        />
        <StatCard
          title="Strong Topics"
          value={`${strongCount} / ${topics.length}`}
          subtitle="&gt; 80% Benchmark Mastery"
          icon={ArrowUpRight}
          accentColor="cyan"
          trend={{ value: 'Ratio, Percentage, Averages', isPositive: true }}
        />
        <StatCard
          title="Review Recommended"
          value={`${weakCount}`}
          subtitle="Topics Requiring Practice"
          icon={AlertTriangle}
          accentColor="amber"
          trend={{ value: 'Targeted Practice Active', neutral: true }}
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
                  variant={t.strength_level === 'Strong' ? 'success' : 'warning'}
                  size="sm"
                >
                  {t.strength_level}
                </Badge>
              </div>

              <div className="space-y-3 bg-slate-50/70 rounded-2xl p-3.5 border border-slate-200/80">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Accuracy:</span>
                    <span className="font-extrabold text-slate-900">{t.accuracy_pct}%</span>
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

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                  <span className="text-slate-600 font-medium">Questions:</span>
                  <span className="font-semibold text-slate-800">{t.questions_solved} Solved / {t.questions_attempted} Attempted</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

