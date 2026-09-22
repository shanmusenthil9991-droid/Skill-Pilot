import React, { useEffect, useState } from 'react';
import {
  BookOpenCheck,
  Clock,
  Award,
  Layers,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';
import { TrainingItem } from '../types';
import { StatCard } from '../components/common/StatCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';

export const TrainingAnalysis: React.FC = () => {
  const [trainings, setTrainings] = useState<TrainingItem[]>([]);
  const [completedHours, setCompletedHours] = useState<number>(0);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [overallCompletion, setOverallCompletion] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        setLoading(true);
        const res = await api.get('/experience/training');
        setTrainings(res.data.trainings || []);
        setCompletedHours(res.data.total_completed_hours || 0);
        setTotalHours(res.data.total_scheduled_hours || 0);
        setOverallCompletion(res.data.overall_completion_pct || 0);
      } catch (err) {
        console.error('Failed to load training data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTraining();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 uppercase tracking-wider mb-1">
          <BookOpenCheck className="h-4 w-4" />
          Technical Training & Skill Bootcamp Analysis
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Institutional Training & Hours Tracking</h1>
        <p className="text-xs text-slate-500 mt-1">
          Tracking structured hands-on training programs, completed lab hours (e.g. {completedHours}/{totalHours} hours), and module-level assessments.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Training Hours"
          value={`${completedHours} / ${totalHours} Hrs`}
          subtitle="Completed vs Scheduled Hours"
          icon={Clock}
          accentColor="brand"
          trend={{ value: `${overallCompletion}% Overall Completed`, isPositive: true }}
        />
        <StatCard
          title="Training Programs"
          value={`${trainings.length}`}
          subtitle="DSA, Full Stack, RTOS Hardware"
          icon={Layers}
          accentColor="cyan"
          trend={{ value: 'Full Lab Attendance', isPositive: true }}
        />
        <StatCard
          title="Average Assessment"
          value={`${Math.round(trainings.reduce((acc, t) => acc + t.assessment_score, 0) / Math.max(1, trainings.length))}%`}
          subtitle="Post-Training Examination Score"
          icon={Award}
          accentColor="emerald"
          trend={{ value: 'Distinction Tier', isPositive: true }}
        />
      </div>

      {/* Training Programs Grid */}
      <div className="space-y-5">
        {trainings.map((tr) => (
          <div
            key={tr.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{tr.training_name}</h3>
                <span className="text-xs text-brand-600 font-semibold">{tr.domain}</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={tr.completion_pct >= 90 ? 'success' : 'primary'} size="md">
                  {tr.completed_hours} / {tr.total_hours} Hours ({tr.completion_pct}%)
                </Badge>
              </div>
            </div>

            {/* Progress Bar & Assessment */}
            <div className="space-y-3 bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Training Hours Progress:</span>
                <span className="font-extrabold text-slate-900">{tr.completed_hours} / {tr.total_hours} Hours</span>
              </div>
              <ProgressBar value={tr.completion_pct} color="cyan" size="md" showPercentage={false} />

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/80">
                <span className="text-slate-500 font-medium">Assessment Performance:</span>
                <span className="font-extrabold text-emerald-600">{tr.assessment_score}%</span>
              </div>
            </div>

            {/* Modules List */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Curriculum Modules</h4>
              <div className="flex flex-wrap gap-2">
                {tr.modules_list?.map((mod, idx) => (
                  <span
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    ✓ {mod}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function max(a: number, b: number) {
  return a > b ? a : b;
}
