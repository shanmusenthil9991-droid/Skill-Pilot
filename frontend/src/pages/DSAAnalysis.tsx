import React, { useEffect, useState } from 'react';
import {
  Binary,
  CheckCircle2,
  Award,
  Layers,
  Sparkles,
  Cpu
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DSATopicItem } from '../types';
import { StatCard } from '../components/common/StatCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';

export const DSAAnalysis: React.FC = () => {
  const { student } = useAuth();
  const [topics, setTopics] = useState<DSATopicItem[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [overallAccuracy, setOverallAccuracy] = useState<number>(0);
  const [totalSolved, setTotalSolved] = useState<number>(0);
  const [totalProblems, setTotalProblems] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  const dept = (student?.dept_code || '').toUpperCase();
  const isCoreDept = ['ECE', 'EEE', 'MECH', 'CIVIL', 'MECHANICAL'].includes(dept);

  useEffect(() => {
    const fetchDSA = async () => {
      try {
        setLoading(true);
        const res = await api.get('/coding/dsa');
        setTopics(res.data.topics || []);
        setOverallScore(res.data.overall_dsa_score || 0);
        setOverallAccuracy(res.data.overall_dsa_accuracy || 0);
        setTotalSolved(res.data.total_problems_solved || 0);
        setTotalProblems(res.data.total_curriculum_problems || 0);
      } catch (err) {
        console.error('Failed to load topic mastery data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDSA();
  }, [student]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  // Generate unique categories based on topics
  const uniqueCategories = Array.from(new Set(topics.map(t => t.category))).filter(Boolean);
  const categories = ['All', ...uniqueCategories];

  const filteredTopics = topics.filter((t) => {
    if (activeFilter === 'All') return true;
    return t.category.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-brand-700 uppercase tracking-wider mb-1">
          {isCoreDept ? <Cpu className="h-4 w-4" /> : <Binary className="h-4 w-4" />}
          {isCoreDept ? `${dept} Technical Topic Curriculum` : 'Data Structures & Algorithms Intelligence'}
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          {isCoreDept ? 'Technical Topic Mastery & Benchmarks' : 'DSA Topic-Wise Mastery'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Comprehensive audit across {topics.length} core technical concepts with accuracy diagnostics and practical problem benchmarks.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Topic Score"
          value={`${overallScore}%`}
          subtitle="Weighted Topic Average"
          icon={Award}
          accentColor="brand"
          trend={{ value: 'Strong Technical Tier', isPositive: true }}
        />
        <StatCard
          title="Assessment Accuracy"
          value={`${overallAccuracy}%`}
          subtitle="First-Attempt Test Scores"
          icon={CheckCircle2}
          accentColor="emerald"
          trend={{ value: '+5.4% Accuracy Growth', isPositive: true }}
        />
        <StatCard
          title="Curriculum Completed"
          value={`${totalSolved} / ${totalProblems}`}
          subtitle="Total Curriculum Problems"
          icon={Layers}
          accentColor="cyan"
          trend={{ value: `${Math.round((totalSolved / Math.max(1, totalProblems)) * 100)}% Coverage`, neutral: true }}
        />
        <StatCard
          title="Mastered Concepts"
          value={`${topics.filter(t => t.skill_level === 'Mastered' || t.skill_level === 'Advanced').length} / ${topics.length}`}
          subtitle="Top Performing Modules"
          icon={Sparkles}
          accentColor="violet"
          trend={{ value: 'Active Progression', isPositive: true }}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs ${
              activeFilter === cat
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {cat} {cat === 'All' ? `(${topics.length})` : ''}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{topic.topic_name}</h3>
                  <span className="text-[10px] text-slate-500 font-medium">{topic.category} Category</span>
                </div>
                <Badge
                  variant={
                    topic.skill_level === 'Mastered' || topic.skill_level === 'Advanced'
                      ? 'success'
                      : topic.skill_level === 'Proficient'
                      ? 'primary'
                      : 'warning'
                  }
                  size="sm"
                >
                  {topic.skill_level}
                </Badge>
              </div>

              {/* Metrics */}
              <div className="space-y-3 bg-slate-50/70 rounded-2xl p-3.5 border border-slate-200/80">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Problems / Labs Solved:</span>
                    <span className="font-extrabold text-slate-900">
                      {topic.completed_problems} / {topic.total_problems} ({topic.completion_pct}%)
                    </span>
                  </div>
                  <ProgressBar value={topic.completion_pct} color="cyan" size="sm" showPercentage={false} />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Assessment Score:</span>
                    <span className="font-extrabold text-brand-700">{topic.assessment_score}%</span>
                  </div>
                  <ProgressBar value={topic.assessment_score} color="brand" size="sm" showPercentage={false} />
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                  <span className="text-slate-600 font-medium">Accuracy Benchmark:</span>
                  <span className="font-extrabold text-emerald-700">{topic.accuracy_pct}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              <span>Status: <strong className="text-slate-800 font-semibold">{topic.status}</strong></span>
              <span className="text-brand-700 font-bold">{Math.max(0, topic.total_problems - topic.completed_problems)} Pending</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

