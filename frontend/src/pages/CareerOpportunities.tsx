import React, { useEffect, useState } from 'react';
import {
  Target,
  Cpu,
  Code2,
  Sparkles,
  Compass,
  CheckCircle2,
  Clock,
  Briefcase
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ECEDualTrackSummary, CareerDomainScore } from '../types';
import { StatCard } from '../components/common/StatCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';

export const CareerOpportunities: React.FC = () => {
  const { student } = useAuth();
  const [dualTrack, setDualTrack] = useState<ECEDualTrackSummary | null>(null);
  const [allDomains, setAllDomains] = useState<CareerDomainScore[]>([]);
  const [loading, setLoading] = useState(true);

  const dept = (student?.dept_code || '').toUpperCase();
  const isECE = dept === 'ECE';
  const isCoreDept = ['ECE', 'EEE', 'MECH', 'CIVIL', 'MECHANICAL'].includes(dept);

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        setLoading(true);
        const res = await api.get('/career/domains');
        setDualTrack(res.data.ece_dual_track);
        setAllDomains(res.data.all_domains || []);
      } catch (err) {
        console.error('Failed to load career data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCareer();
  }, [student]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
          <Target className="h-4 w-4 text-slate-600" />
          Career Intelligence & Domain Alignment Engine
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {isECE ? 'ECE Dual-Pathway Career Intelligence' : `${student?.dept_code || 'Department'} Career Opportunities`}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {isECE
            ? 'Dedicated dual-pathway analysis evaluating Core Hardware / Embedded / VLSI vs Software / CS engineering competencies side-by-side.'
            : `AI-driven career alignment and pathway roadmap tailored strictly to ${student?.dept_code || 'core'} engineering disciplines.`}
        </p>
      </div>

      {/* ECE Dual-Pathway View */}
      {isECE && dualTrack && (
        <div className="space-y-6">
          {/* Side-by-side Dual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Core ECE Pathway Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">CORE ECE PATHWAY</h3>
                      <p className="text-xs text-slate-500 font-medium">Embedded • VLSI • Microcontrollers • IoT</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-blue-600">{dualTrack.core_ece_alignment_pct}%</span>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Alignment</span>
                  </div>
                </div>

                <ProgressBar value={dualTrack.core_ece_alignment_pct} color="brand" size="md" showPercentage={false} />

                {/* Completed Skills */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Completed Skills (Core Hardware)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Embedded C', 'FreeRTOS Tasks', 'ESP32 / Microcontrollers', 'GPIO & I2C/SPI Protocols', 'Digital Electronics'].map((s, idx) => (
                      <span key={idx} className="rounded-md bg-slate-50 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* In Progress Skills */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-slate-500" />
                    In Progress Skills (Target Gaps)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Verilog HDL / FPGA RTL Design', 'ARM Cortex Low-Power Optimization', 'BLE / Zigbee Mesh Networking'].map((s, idx) => (
                      <span key={idx} className="rounded-md bg-slate-50 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        ⏳ {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Target Roles */}
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 text-xs text-slate-700 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                  Target Core Hardware Roles:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded bg-white border border-slate-200 px-2 py-0.5 text-[11px] text-slate-700 font-semibold">Firmware Engineer</span>
                  <span className="rounded bg-white border border-slate-200 px-2 py-0.5 text-[11px] text-slate-700 font-semibold">VLSI Design Engineer</span>
                  <span className="rounded bg-white border border-slate-200 px-2 py-0.5 text-[11px] text-slate-700 font-semibold">IoT Solutions Architect</span>
                </div>
              </div>
            </div>

            {/* Software / CS Pathway Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                      <Code2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">SOFTWARE / CS PATHWAY</h3>
                      <p className="text-xs text-slate-500 font-medium">Full Stack • Backend APIs • Cloud Services</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-blue-600">{dualTrack.software_cs_alignment_pct}%</span>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Alignment</span>
                  </div>
                </div>

                <ProgressBar value={dualTrack.software_cs_alignment_pct} color="brand" size="md" showPercentage={false} />

                {/* Completed Skills */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Completed Skills (Software)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Python Core & FastAPI', 'REST API Design', 'SQL & Relational DBs', 'Git & Docker Basics'].map((s, idx) => (
                      <span key={idx} className="rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* In Progress Skills */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-amber-600" />
                    In Progress Skills (Target Gaps)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Dynamic Programming / Graphs', 'Distributed Microservices', 'Redis Caching & Kafka'].map((s, idx) => (
                      <span key={idx} className="rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-800">
                        ⏳ {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Target Roles */}
              <div className="rounded-2xl bg-sky-50/70 p-3.5 border border-sky-200 text-xs text-slate-700 space-y-1.5">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  Target Software Roles:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-white border border-sky-200 px-2 py-0.5 text-[11px] text-blue-800 font-semibold shadow-2xs">Full Stack Software Engineer</span>
                  <span className="rounded-md bg-white border border-sky-200 px-2 py-0.5 text-[11px] text-blue-800 font-semibold shadow-2xs">Backend Systems SDE-1</span>
                  <span className="rounded-md bg-white border border-sky-200 px-2 py-0.5 text-[11px] text-blue-800 font-semibold shadow-2xs">Cloud & DevOps Specialist</span>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Dual-Pathway Strategy Banner */}
          <div className="rounded-3xl border border-blue-200/90 bg-blue-50/60 p-5 shadow-sm flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-blue-200 text-blue-600 shrink-0 shadow-2xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">Dual Pathway Strategy Guidance</h4>
              <p className="text-xs text-slate-700 leading-relaxed">{dualTrack.primary_recommendation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Target Domains Directory with Completed and In Progress Breakdown */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-2.5 text-blue-600 shadow-2xs">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {isCoreDept ? `${student?.dept_code || 'Core'} Engineering Pathways` : 'Target Career Domain Directory'}
              </h3>
              <p className="text-[11px] text-slate-500">Domain readiness with explicit Completed and In Progress skills</p>
            </div>
          </div>
          <Badge variant="primary" size="sm">{allDomains.length} Domains Analyzed</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {allDomains.map((dom, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={dom.category.includes('Core') ? 'purple' : 'primary'} size="sm">
                    {dom.category}
                  </Badge>
                  <span className="text-xs font-extrabold text-blue-700">{dom.alignment_score}% Match</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{dom.domain_name}</h4>
                <ProgressBar value={dom.alignment_score} color="brand" size="sm" showPercentage={false} />
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[11px] text-emerald-700 uppercase tracking-wider block font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Completed Skills:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {(dom.completed_skills || dom.matching_skills)?.map((s, sIdx) => (
                      <span key={sIdx} className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] text-emerald-800 font-semibold">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-amber-700 uppercase tracking-wider block font-bold flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    In Progress Skills:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {(dom.in_progress_skills || dom.missing_skills)?.map((s, sIdx) => (
                      <span key={sIdx} className="rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] text-amber-800 font-semibold">
                        ⏳ {s}
                      </span>
                    ))}
                  </div>
                </div>

                {dom.recommended_roles && dom.recommended_roles.length > 0 && (
                  <div className="pt-2.5 border-t border-slate-200/80">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Target Roles:</span>
                    <div className="flex flex-wrap gap-1">
                      {dom.recommended_roles.map((r, rIdx) => (
                        <span key={rIdx} className="rounded-md bg-white border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 shadow-2xs">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

