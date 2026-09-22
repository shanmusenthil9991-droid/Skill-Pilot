import React, { useEffect, useState } from 'react';
import {
  FolderGit2,
  ExternalLink,
  Github,
  CheckCircle2,
  Clock,
  Layers,
  Cpu
} from 'lucide-react';
import api from '../services/api';
import { ProjectItem } from '../types';
import { StatCard } from '../components/common/StatCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [avgCompletion, setAvgCompletion] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await api.get('/experience/projects');
        setProjects(res.data.projects || []);
        setAvgCompletion(res.data.avg_completion_pct || 0);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
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
          <FolderGit2 className="h-4 w-4" />
          Technical Portfolio & Architecture
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Project Engineering Analysis</h1>
        <p className="text-xs text-slate-500 mt-1">
          Component-level tracking of full-stack, embedded, and AI applications, including completed vs pending architecture modules.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Projects Built"
          value={`${projects.length}`}
          subtitle="Multi-Component Production Systems"
          icon={FolderGit2}
          accentColor="brand"
          trend={{ value: 'Full Stack & Embedded', isPositive: true }}
        />
        <StatCard
          title="Average Component Completion"
          value={`${avgCompletion}%`}
          subtitle="Across Frontend, Backend, DB & Cloud"
          icon={Layers}
          accentColor="emerald"
          trend={{ value: 'Production Ready Portfolio', isPositive: true }}
        />
        <StatCard
          title="Lead Architect Role"
          value="100%"
          subtitle="Solo or Technical Lead Responsibility"
          icon={Cpu}
          accentColor="violet"
          trend={{ value: 'Verified Source Repositories', isPositive: true }}
        />
      </div>

      {/* Project Cards Grid */}
      <div className="space-y-6">
        {projects.map((prj) => (
          <div
            key={prj.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition space-y-6"
          >
            {/* Project Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900">{prj.title}</h3>
                  <Badge variant="primary" size="sm">{prj.domain}</Badge>
                </div>
                <p className="text-xs text-slate-500">
                  Student Role: <strong className="text-slate-800">{prj.student_role}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                {prj.github_url && (
                  <a
                    href={prj.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>GitHub Code</span>
                  </a>
                )}
                {prj.live_url && (
                  <a
                    href={prj.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>

            {/* Problem Statement */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Problem Statement & Purpose</h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 rounded-2xl p-4 border border-slate-200">
                {prj.problem_statement}
              </p>
            </div>

            {/* Tech Stack Pills */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Technologies & Architecture Stack</h4>
              <div className="flex flex-wrap gap-2">
                {prj.technologies?.map((tech, idx) => (
                  <span
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-800"
                  >
                    {tech}
                  </span>
                ))}
                {prj.database && (
                  <span className="rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">
                    DB: {prj.database}
                  </span>
                )}
                {prj.deployment_platform && (
                  <span className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800">
                    Deploy: {prj.deployment_platform}
                  </span>
                )}
              </div>
            </div>

            {/* Component Completion Breakdown */}
            <div className="space-y-3 bg-slate-50/60 rounded-2xl p-4 border border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">System Component Progress ({prj.completion_pct}% Overall)</span>
                <span className="text-slate-500">
                  {prj.completed_components?.length} Completed • {prj.pending_components?.length} Pending
                </span>
              </div>
              <ProgressBar value={prj.completion_pct} color="emerald" size="md" showPercentage={false} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                {/* Completed components */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Completed Components
                  </span>
                  <div className="space-y-1">
                    {prj.completed_components?.map((c, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-800">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending components */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    Pending Work / Optimization
                  </span>
                  <div className="space-y-1">
                    {prj.pending_components?.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <span className="text-amber-600 font-bold">⏳</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

