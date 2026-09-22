import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { InternshipItem } from '../types';
import { StatCard } from '../components/common/StatCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';

export const Internships: React.FC = () => {
  const [internships, setInternships] = useState<InternshipItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        const res = await api.get('/experience/internships');
        setInternships(res.data.internships || []);
      } catch (err) {
        console.error('Failed to load internships:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
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
        <div className="flex items-center gap-2 text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">
          <Briefcase className="h-4 w-4" />
          Industry Experience & Corporate Projects
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Internship & Work Experience Analysis</h1>
        <p className="text-xs text-slate-500 mt-1">
          Full audit of company roles, duration, technical responsibilities, skills acquired, and completed deliverables.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Internships"
          value={`${internships.length}`}
          subtitle="Corporate Industry Engagements"
          icon={Briefcase}
          accentColor="violet"
          trend={{ value: 'Full-Time Summer Internship', isPositive: true }}
        />
        <StatCard
          title="Industry Domain"
          value="Firmware & Systems"
          subtitle="Real-world Production Experience"
          icon={Building}
          accentColor="brand"
          trend={{ value: 'High Hiring Rehire Rating', isPositive: true }}
        />
        <StatCard
          title="Tasks Completed"
          value="80%"
          subtitle="Deliverable Milestones Passed"
          icon={CheckCircle2}
          accentColor="emerald"
          trend={{ value: 'Verified Reference', isPositive: true }}
        />
      </div>

      {/* Internships List */}
      <div className="space-y-6">
        {internships.map((intern) => (
          <div
            key={intern.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900">{intern.role}</h3>
                  <Badge variant="purple" size="sm">{intern.domain}</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Building className="h-3.5 w-3.5 text-brand-600" />
                    {intern.company}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {intern.duration} ({intern.start_date} – {intern.end_date})
                  </span>
                </div>
              </div>

              <Badge variant="success" size="md">
                ✓ Verified Industry Engagement
              </Badge>
            </div>

            {/* Responsibilities */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Responsibilities & Project Scope</h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                {intern.responsibilities}
              </p>
            </div>

            {/* Technologies & Skills Acquired */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {intern.technologies?.map((tech, idx) => (
                    <span
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Key Skills Acquired</h4>
                <div className="flex flex-wrap gap-2">
                  {intern.skills_acquired?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Task Checklist */}
            <div className="space-y-3 bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Internship Task Completion ({intern.completion_pct}%)</span>
                <span className="text-slate-500">
                  {intern.completed_tasks?.length} Tasks Done • {intern.pending_tasks?.length} Follow-up
                </span>
              </div>
              <ProgressBar value={intern.completion_pct} color="violet" size="md" showPercentage={false} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Completed Deliverables
                  </span>
                  <div className="space-y-1">
                    {intern.completed_tasks?.map((t, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Pending Follow-up
                  </span>
                  <div className="space-y-1">
                    {intern.pending_tasks?.map((t, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="text-amber-600 font-bold">⏳</span>
                        <span>{t}</span>
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
