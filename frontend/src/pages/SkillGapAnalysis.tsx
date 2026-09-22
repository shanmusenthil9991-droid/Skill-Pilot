import React, { useEffect, useState } from 'react';
import {
  GitPullRequestDraft,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { SkillGapItem } from '../types';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';

export const SkillGapAnalysis: React.FC = () => {
  const [gaps, setGaps] = useState<SkillGapItem[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGaps = async () => {
      try {
        setLoading(true);
        const res = await api.get('/career/skill-gaps');
        setGaps(res.data.gaps || []);
      } catch (err) {
        console.error('Failed to load skill gaps:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGaps();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  const distinctRoles = ['All', ...Array.from(new Set(gaps.map(g => g.target_career_role)))];

  const filteredGaps = gaps.filter(g => {
    if (selectedRole === 'All') return true;
    return g.target_career_role === selectedRole;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
          <GitPullRequestDraft className="h-4 w-4" />
          Target Competency Difference Engine
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Skill Gap Analysis</h1>
        <p className="text-xs text-slate-500 mt-1">
          Compare your current validated proficiency against industry target roles to pinpoint high-priority missing technologies and core engineering competencies.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Identified Skill Gaps"
          value={`${gaps.length}`}
          subtitle="Target Role Benchmark Delta"
          icon={AlertTriangle}
          accentColor="rose"
          trend={{ value: `${gaps.filter(g => g.gap_severity === 'High').length} High Priority`, neutral: true }}
        />
        <StatCard
          title="Target Roles Analyzed"
          value={`${distinctRoles.length - 1}`}
          subtitle="Domain Pathways & Benchmark Roles"
          icon={Layers}
          accentColor="brand"
          trend={{ value: 'Multi-Pathway Profile Evaluation', isPositive: true }}
        />
        <StatCard
          title="Actionable Next Steps"
          value={`${gaps.length} Guided Steps`}
          subtitle="Curated Roadmap Actions"
          icon={Sparkles}
          accentColor="emerald"
          trend={{ value: 'Mapped to Projects & Labs', isPositive: true }}
        />
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {distinctRoles.map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              selectedRole === role
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Gaps List */}
      <div className="space-y-4">
        {filteredGaps.map((gap) => (
          <div
            key={gap.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-slate-900">{gap.skill_name}</h3>
                  <Badge
                    variant={gap.gap_severity === 'High' ? 'danger' : 'warning'}
                    size="sm"
                  >
                    {gap.gap_severity} Severity Gap
                  </Badge>
                </div>
                <p className="text-xs text-brand-600 font-semibold">
                  Target Role: {gap.target_career_role}
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-200/80 text-xs">
                <span className="text-slate-500">Current: <strong className="text-slate-800">{gap.current_level}</strong></span>
                <span className="text-slate-400">➔</span>
                <span className="text-slate-500">Required: <strong className="text-emerald-600">{gap.required_level}</strong></span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Why This Gap Matters</span>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80">
                {gap.reason}
              </p>
            </div>

            <div className="rounded-2xl bg-brand-50 border border-brand-200 p-3.5 flex items-start gap-2.5 text-xs text-slate-800">
              <Sparkles className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-brand-800">Recommended Action: </span>
                {gap.recommended_action}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
