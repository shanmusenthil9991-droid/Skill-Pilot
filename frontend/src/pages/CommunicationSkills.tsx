import React, { useEffect, useState } from 'react';
import {
  Speech,
  Mic,
  Headphones,
  FileText,
  Presentation,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Award,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { CommunicationSummary } from '../types';
import { StatCard } from '../components/common/StatCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';

export const CommunicationSkills: React.FC = () => {
  const [data, setData] = useState<CommunicationSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComm = async () => {
      try {
        setLoading(true);
        const res = await api.get('/cognitive/communication');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load communication data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComm();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  const dimensions = [
    {
      name: 'Speaking & Pronunciation',
      score: data?.speaking_score || 75,
      icon: Mic,
      color: 'brand' as const,
      badgeText: 'Fluid Articulation',
      description: 'Clarity of speech, rhythm, vocal pace, and elimination of filler words during technical walkthroughs.'
    },
    {
      name: 'Active Listening & Comprehension',
      score: data?.listening_score || 80,
      icon: Headphones,
      color: 'emerald' as const,
      badgeText: 'High Retention',
      description: 'Understanding complex instructions, prompt clarification, and accurate interview recall.'
    },
    {
      name: 'Technical Writing & Documentation',
      score: data?.writing_score || 76,
      icon: FileText,
      color: 'cyan' as const,
      badgeText: 'Concise & Structured',
      description: 'Ability to document APIs, architectural trade-offs, commit messages, and formal technical reports.'
    },
    {
      name: 'Presentation & Executive Delivery',
      score: data?.presentation_score || 72,
      icon: Presentation,
      color: 'violet' as const,
      badgeText: 'Engaging Delivery',
      description: 'Confidence in slide delivery, executive summarization, and interactive project demonstrations.'
    },
    {
      name: 'Technical Interview Articulation',
      score: data?.interview_comm_score || 78,
      icon: UserCheck,
      color: 'amber' as const,
      badgeText: 'STAR Method Formatted',
      description: 'Structuring behavioral and technical questions using Situation, Task, Action, Result framework.'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Speech className="h-4 w-4" />
            Soft Skills & Technical Articulation
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Communication & Interview Fluency</h1>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive evaluation across Speaking, Listening, Technical Writing, Executive Presentations, and Behavioral Interview Readiness.
          </p>
        </div>
        <Badge variant="success" size="lg" className="self-start md:self-auto">
          <Sparkles className="h-3.5 w-3.5" />
          {data?.current_level || 'Professional'} Level
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Communication Score"
          value={`${data?.overall_score || 75}%`}
          subtitle={`Current Tier: ${data?.current_level || 'Professional'}`}
          icon={Award}
          accentColor="brand"
          trend={{ value: 'Interview Ready Tier', isPositive: true }}
        />
        <StatCard
          title="Speaking & Articulation"
          value={`${data?.speaking_score || 75}%`}
          subtitle="Clarity, Pace & Tone"
          icon={Mic}
          accentColor="cyan"
          trend={{ value: '+4.5% Growth in Mock Drives', isPositive: true }}
        />
        <StatCard
          title="Active Listening"
          value={`${data?.listening_score || 80}%`}
          subtitle="Comprehension & Standup Recall"
          icon={Headphones}
          accentColor="emerald"
          trend={{ value: 'High Comprehension Index', isPositive: true }}
        />
        <StatCard
          title="Interview Communication"
          value={`${data?.interview_comm_score || 78}%`}
          subtitle="STAR Method Structured Answers"
          icon={UserCheck}
          accentColor="violet"
          trend={{ value: 'Targeting Final HR & Tech Rounds', neutral: true }}
        />
      </div>

      {/* 5 Dimension Evaluator Cards */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Communication Dimension Evaluation</h3>
            <p className="text-[11px] text-slate-500">In-depth rubric scores and behavioral fluency indicators</p>
          </div>
          <Badge variant="primary" size="sm">5 Core Dimensions</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dimensions.map((dim, idx) => {
            const Icon = dim.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3 flex flex-col justify-between hover:bg-slate-50 transition shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-white border border-slate-200 p-2 text-slate-800 shadow-2xs">
                        <Icon className="h-4 w-4 text-brand-600" />
                      </div>
                      <span className="text-xs font-bold text-slate-900">{dim.name}</span>
                    </div>
                    <span className="text-xs font-extrabold text-brand-600">{dim.score}%</span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {dim.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/60">
                  <ProgressBar value={dim.score} color={dim.color} size="sm" showPercentage={false} />
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-semibold text-slate-500">{dim.badgeText}</span>
                    <span className="font-bold text-slate-800">Score: {dim.score}/100</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths, Areas for Polish, and Action Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strengths */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Identified Strengths
          </div>
          <div className="space-y-2.5">
            {data?.strengths?.map((str, idx) => (
              <div key={idx} className="rounded-xl bg-emerald-50/70 border border-emerald-200/80 p-3 text-xs text-slate-800 flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            Areas for Polish
          </div>
          <div className="space-y-2.5">
            {data?.weaknesses?.map((wk, idx) => (
              <div key={idx} className="rounded-xl bg-amber-50/70 border border-amber-200/80 p-3 text-xs text-slate-800 flex items-start gap-2">
                <span className="text-amber-600 font-bold">⚠️</span>
                <span>{wk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Recommendations */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-800 uppercase tracking-wider">
            <Lightbulb className="h-4 w-4 text-brand-600" />
            Action Recommendations
          </div>
          <div className="space-y-2.5">
            {data?.recommendations?.map((rec, idx) => (
              <div key={idx} className="rounded-xl bg-brand-50/70 border border-brand-200/80 p-3 text-xs text-slate-800 flex items-start gap-2">
                <span className="text-brand-600 font-bold">💡</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

