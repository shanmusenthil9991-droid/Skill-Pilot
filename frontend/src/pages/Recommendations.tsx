import React, { useEffect, useState } from 'react';
import {
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Filter,
  Sparkles,
  Award
} from 'lucide-react';
import api from '../services/api';
import { RecommendationItem } from '../types';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';

export const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const res = await api.get('/recommendations');
        setRecommendations(res.data.recommendations || []);
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(recommendations.map(r => r.category)))];

  const filtered = recommendations.filter(r => {
    if (activeCategory === 'All') return true;
    return r.category === activeCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
          <Lightbulb className="h-4 w-4" />
          Actionable Career & Skill Prescriptions
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Personalized Recommendations</h1>
        <p className="text-xs text-slate-500 mt-1">
          Every recommendation follows a structured <strong className="text-slate-800">WHAT</strong> • <strong className="text-slate-800">WHY</strong> • <strong className="text-slate-800">NEXT STEP</strong> framework for clear execution.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Recommendations"
          value={`${recommendations.length}`}
          subtitle="Target Domain Roadmaps"
          icon={Lightbulb}
          accentColor="amber"
          trend={{ value: `${recommendations.filter(r => r.priority === 'High').length} High Priority`, isPositive: true }}
        />
        <StatCard
          title="Actionable Framework"
          value="WHAT • WHY • NEXT"
          subtitle="Clear Diagnostic Execution"
          icon={Sparkles}
          accentColor="brand"
          trend={{ value: 'Zero Ambiguity Guidance', isPositive: true }}
        />
        <StatCard
          title="Prescription Domains"
          value={`${categories.length - 1} Categories`}
          subtitle="Cross-Disciplinary Roadmap"
          icon={Award}
          accentColor="emerald"
          trend={{ value: 'Continuously Updated', isPositive: true }}
        />
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
              activeCategory === cat
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-5">
        {filtered.map((rec) => (
          <div
            key={rec.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold text-slate-900">{rec.title}</h3>
                  <Badge
                    variant={rec.priority === 'High' ? 'danger' : 'warning'}
                    size="sm"
                  >
                    {rec.priority} Priority
                  </Badge>
                </div>
                <span className="text-xs font-semibold text-brand-600">{rec.category}</span>
              </div>
            </div>

            {/* Structured WHAT, WHY, NEXT STEP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-1.5">
                <span className="text-[11px] font-bold text-brand-700 uppercase tracking-wider block">WHAT</span>
                <p className="text-xs text-slate-800 leading-relaxed">{rec.what}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-1.5">
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">WHY</span>
                <p className="text-xs text-slate-700 leading-relaxed">{rec.why}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs">
                <span className="font-bold text-emerald-800 uppercase tracking-wider">NEXT STEP ACTION:</span>
                <p className="text-slate-800 font-medium leading-relaxed">{rec.next_step}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
