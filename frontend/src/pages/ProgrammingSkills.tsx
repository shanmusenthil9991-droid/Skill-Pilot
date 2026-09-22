import React, { useEffect, useState } from 'react';
import {
  Code2,
  CheckCircle,
  Clock,
  Award,
  Cpu,
  Layers
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ProgrammingProgressItem } from '../types';
import { StatCard } from '../components/common/StatCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';

export const ProgrammingSkills: React.FC = () => {
  const { student } = useAuth();
  const [languages, setLanguages] = useState<ProgrammingProgressItem[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [overallCompletion, setOverallCompletion] = useState<number>(0);
  const [selectedLang, setSelectedLang] = useState<ProgrammingProgressItem | null>(null);
  const [loading, setLoading] = useState(true);

  const dept = (student?.dept_code || '').toUpperCase();
  const isCoreDept = ['ECE', 'EEE', 'MECH', 'CIVIL', 'MECHANICAL'].includes(dept);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        const res = await api.get('/coding/languages');
        setLanguages(res.data.languages || []);
        setOverallScore(res.data.overall_programming_score || 0);
        setOverallCompletion(res.data.overall_completion_pct || 0);
        if (res.data.languages?.length > 0) {
          setSelectedLang(res.data.languages[0]);
        }
      } catch (err) {
        console.error('Failed to load technical skills:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLanguages();
  }, [student]);

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
          {isCoreDept ? <Cpu className="h-4 w-4" /> : <Code2 className="h-4 w-4" />}
          {isCoreDept ? `${dept} Technical Core Modules` : 'Language Proficiency & Topic Curriculum'}
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          {isCoreDept ? 'Core Domain Skills Intelligence' : 'Programming Skills Intelligence'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Separate tracking of <strong className="text-slate-800">Curriculum Completion</strong> and <strong className="text-slate-800">Assessment Performance</strong> across {isCoreDept ? `${dept} core engineering modules` : 'standard programming languages'}.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={isCoreDept ? 'Overall Core Score' : 'Overall Programming Score'}
          value={`${overallScore}%`}
          subtitle="Weighted Assessment Average"
          icon={Award}
          accentColor="brand"
          trend={{ value: 'Proficient Tier', isPositive: true }}
        />
        <StatCard
          title="Curriculum Completion"
          value={`${overallCompletion}%`}
          subtitle="Across All Tracked Modules"
          icon={Layers}
          accentColor="cyan"
          trend={{ value: 'Active Progression', isPositive: true }}
        />
        <StatCard
          title={isCoreDept ? 'Tracked Core Modules' : 'Total Languages'}
          value={languages.length}
          subtitle={isCoreDept ? `${dept} Domain Modules` : 'Full Stack & Systems'}
          icon={isCoreDept ? Cpu : Code2}
          accentColor="violet"
          trend={{ value: 'Specialized Core', neutral: true }}
        />
        <StatCard
          title="Questions / Tasks Solved"
          value={languages.reduce((acc, l) => acc + l.questions_solved, 0)}
          subtitle={`Out of ${languages.reduce((acc, l) => acc + l.questions_attempted, 0)} Attempted`}
          icon={CheckCircle}
          accentColor="emerald"
          trend={{ value: 'High Accuracy Rate', isPositive: true }}
        />
      </div>

      {/* Language / Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {languages.map((lang) => {
          const isSelected = selectedLang?.id === lang.id;
          return (
            <div
              key={lang.id}
              onClick={() => setSelectedLang(lang)}
              className={`cursor-pointer rounded-3xl border p-5 transition-all duration-300 flex flex-col justify-between shadow-xs ${
                isSelected
                  ? 'border-brand-500 bg-white ring-2 ring-brand-400 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 border border-brand-200 text-brand-700 font-bold text-sm">
                      {lang.language_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{lang.language_name}</h3>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {lang.topics_completed} / {lang.total_topics} Topics Finished
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      lang.skill_level === 'Advanced'
                        ? 'success'
                        : lang.skill_level === 'Proficient'
                        ? 'primary'
                        : 'warning'
                    }
                    size="sm"
                  >
                    {lang.skill_level}
                  </Badge>
                </div>

                {/* Separate Metrics: Completion vs Performance */}
                <div className="space-y-3.5 my-4 bg-slate-50/70 rounded-2xl p-3.5 border border-slate-200/80">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">Topic Completion:</span>
                      <span className="font-extrabold text-slate-900">{lang.completion_pct}%</span>
                    </div>
                    <ProgressBar value={lang.completion_pct} color="cyan" size="sm" showPercentage={false} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">Assessment Score:</span>
                      <span className="font-extrabold text-brand-700">{lang.assessment_score}%</span>
                    </div>
                    <ProgressBar value={lang.assessment_score} color="brand" size="sm" showPercentage={false} />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                    <span className="text-slate-600 font-medium">Task Accuracy:</span>
                    <span className="font-extrabold text-emerald-700">{lang.accuracy_pct}% ({lang.questions_solved}/{lang.questions_attempted})</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-center font-bold text-brand-700 pt-1">
                {isSelected ? '✓ Viewing Curriculum Breakdown' : 'Click to View Topic Checklist'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Language / Module Topic Checklist & Drilldown */}
      {selectedLang && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  {selectedLang.language_name} Curriculum & Topic Mastery
                </h3>
                <Badge variant="primary" size="sm">
                  {selectedLang.topics_completed} / {selectedLang.total_topics} Finished
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Detailed audit of completed syllabus modules and pending curriculum topics
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block font-medium">Assessment Score</span>
                <span className="text-sm font-extrabold text-brand-700">{selectedLang.assessment_score}%</span>
              </div>
              <div className="h-8 w-[1px] bg-slate-200" />
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block font-medium">Accuracy</span>
                <span className="text-sm font-extrabold text-emerald-700">{selectedLang.accuracy_pct}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Completed Topics */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Completed Topics ({selectedLang.completed_topics.length})
              </h4>
              <div className="space-y-2">
                {selectedLang.completed_topics.map((top, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-emerald-50/70 border border-emerald-200/80 p-3 text-xs"
                  >
                    <span className="font-semibold text-slate-800">{top}</span>
                    <Badge variant="success" size="sm">Completed</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Topics */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-600" />
                Pending Curriculum Topics ({selectedLang.pending_topics.length})
              </h4>
              <div className="space-y-2">
                {selectedLang.pending_topics.length > 0 ? (
                  selectedLang.pending_topics.map((top, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl bg-amber-50/70 border border-amber-200/80 p-3 text-xs"
                    >
                      <span className="font-semibold text-slate-800">{top}</span>
                      <Badge variant="warning" size="sm">Pending Practice</Badge>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center text-xs font-bold text-emerald-800">
                    🎉 100% Curriculum Topics Completed for {selectedLang.language_name}!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

