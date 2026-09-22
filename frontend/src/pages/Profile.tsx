import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Building2,
  Github,
  Linkedin,
  Globe,
  Edit3,
  CheckCircle2,
  Save,
  ExternalLink,
  Award,
  ShieldCheck,
  Code2,
  Copy,
  Check,
  Compass,
  TrendingUp,
  BookOpen,
  Target,
  FileText,
  X,
  Share2,
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const Profile: React.FC = () => {
  const { student, refreshStudentProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [formData, setFormData] = useState({
    name: student?.name || '',
    phone: student?.phone || '',
    bio: student?.bio || '',
    github_url: student?.github_url || '',
    linkedin_url: student?.linkedin_url || '',
    leetcode_handle: student?.leetcode_handle || '',
    codeforces_handle: student?.codeforces_handle || '',
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        phone: student.phone || '',
        bio: student.bio || '',
        github_url: student.github_url || '',
        linkedin_url: student.linkedin_url || '',
        leetcode_handle: student.leetcode_handle || '',
        codeforces_handle: student.codeforces_handle || '',
      });
    }
  }, [student]);

  const handleCopyId = () => {
    if (student?.student_id) {
      navigator.clipboard.writeText(student.student_id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/student/profile', formData);
      await refreshStudentProfile();
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const initials = student?.name
    ? student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'SP';

  const cgpaTier = (student?.cgpa || 0) >= 9.0
    ? 'Distinction / Outstanding'
    : (student?.cgpa || 0) >= 8.0
    ? 'First Class with Distinction'
    : (student?.cgpa || 0) >= 6.5
    ? 'First Class'
    : 'Pass Division';

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* 1. Header Profile Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Identity & Basic Details */}
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-black text-white shadow-xs">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center" title="Active Student">
                <Check className="h-3 w-3 text-white stroke-[3]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {student?.name}
                </h1>
                <span className="inline-flex items-center rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">
                  {student?.dept_code}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified Student
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium">
                {student?.department} • Year {student?.year}, Semester {student?.semester}
              </p>

              {/* Quick Metadata Row */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <button
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1.5 font-mono text-slate-700 hover:text-blue-600 transition bg-slate-50 border border-slate-200 px-2 py-0.5 rounded"
                  title="Copy Roll Number"
                >
                  <GraduationCap className="h-3.5 w-3.5 text-slate-500" />
                  <span>{student?.student_id}</span>
                  {copiedId ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3 text-slate-400" />
                  )}
                </button>

                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{student?.email}</span>
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{student?.phone || '+91 98765 43210'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition shadow-xs"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccess && (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 shadow-xs animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Profile changes saved successfully and synced across all SkillPilot intelligence engines.</span>
        </div>
      )}

      {/* 2. Key Academic Performance Strip (4 Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Cumulative CGPA */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Cumulative CGPA</span>
            <Award className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{student?.cgpa.toFixed(2)}</span>
            <span className="text-xs font-semibold text-slate-400">/ 10.0</span>
          </div>
          <div className="mt-1.5">
            <span className="inline-block text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              {cgpaTier}
            </span>
          </div>
        </div>

        {/* Overall Attendance */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Overall Attendance</span>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{student?.attendance_pct.toFixed(1)}%</span>
          </div>
          <div className="mt-1.5">
            <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {(student?.attendance_pct || 0) >= 75 ? 'Compliant (>75% Norm)' : 'Below Threshold'}
            </span>
          </div>
        </div>

        {/* Active Backlogs */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Backlogs</span>
            <ShieldCheck className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{student?.backlogs || 0}</span>
            <span className="text-xs font-semibold text-slate-400">courses</span>
          </div>
          <div className="mt-1.5">
            <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {(student?.backlogs || 0) === 0 ? 'Clean Academic Track' : 'Remediation Active'}
            </span>
          </div>
        </div>

        {/* Current Term */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Current Term</span>
            <Calendar className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">Semester {student?.semester}</span>
          </div>
          <div className="mt-1.5">
            <span className="inline-block text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              Year {student?.year} • Active Cohort
            </span>
          </div>
        </div>
      </div>

      {/* 3. Enterprise Layout (1/3 Identity Sidebar + 2/3 Comprehensive Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (1/3): Identity, Institutional Credentials & Developer Handles */}
        <div className="space-y-6">
          {/* Institutional Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 mb-3.5">
              <Building2 className="h-4 w-4 text-slate-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Academic Details</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100/70">
                <span className="text-slate-500 font-medium">Department</span>
                <span className="font-bold text-slate-900 text-right">{student?.dept_code}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100/70">
                <span className="text-slate-500 font-medium">Roll ID</span>
                <span className="font-mono font-bold text-slate-900">{student?.student_id}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100/70">
                <span className="text-slate-500 font-medium">Semester</span>
                <span className="font-bold text-slate-900">Semester {student?.semester} (Year {student?.year})</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100/70">
                <span className="text-slate-500 font-medium">Registered Email</span>
                <span className="font-bold text-slate-900 truncate max-w-[170px]" title={student?.email}>{student?.email}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 font-medium">Contact Phone</span>
                <span className="font-bold text-slate-900">{student?.phone || '+91 98765 43210'}</span>
              </div>
            </div>
          </div>

          {/* Connected Developer & Professional Handles */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-3.5">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Professional Handles</h2>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Connected</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* GitHub */}
              <a
                href={student?.github_url || 'https://github.com'}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 hover:bg-white hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white">
                    <Github className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">GitHub</span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {student?.github_url ? student.github_url.replace('https://github.com/', '') : 'alexchen'}
                    </span>
                  </div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>

              {/* LinkedIn */}
              <a
                href={student?.linkedin_url || 'https://linkedin.com'}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 hover:bg-white hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Linkedin className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">LinkedIn</span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {student?.linkedin_url ? student.linkedin_url.replace('https://linkedin.com/in/', '') : 'alex-chen'}
                    </span>
                  </div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>

              {/* LeetCode */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-700 text-white">
                    <Code2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">LeetCode</span>
                    <span className="font-mono text-[11px] text-slate-600 font-semibold">
                      @{student?.leetcode_handle || 'alex_coder'}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                  Synced
                </span>
              </div>

              {/* Codeforces */}
              {student?.codeforces_handle && (
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-700 text-white">
                      <Code2 className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">Codeforces</span>
                      <span className="font-mono text-[11px] text-slate-600 font-semibold">
                        @{student?.codeforces_handle}
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                    Synced
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (2/3): Executive Bio, Target Pathways & Intelligence Hub */}
        <div className="lg:col-span-2 space-y-6">
          {/* Professional Biography Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Executive Summary & Statement</h2>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition"
              >
                Edit Bio
              </button>
            </div>

            <div className="rounded-xl bg-slate-50/70 p-4 border border-slate-100">
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-normal">
                {student?.bio || 'No professional statement added yet. Click "Edit Bio" above to provide your executive overview, technical background, and career focus.'}
              </p>
            </div>
          </div>

          {/* Target Career Interests & Engineering Pathways */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-slate-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Target Career Interests & Pathways</h2>
              </div>
              <Link
                to="/career-opportunities"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
              >
                <span>View Pathways</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {student?.career_interests && student.career_interests.length > 0 ? (
                student.career_interests.map((interest, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 hover:bg-white hover:border-slate-300 transition"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Track {idx + 1}
                      </span>
                      <p className="text-xs font-extrabold text-slate-900">{interest}</p>
                    </div>
                    <div className="pt-3">
                      <span className="inline-block text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        Mapped to {student.dept_code}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 col-span-3">No career targets selected.</p>
              )}
            </div>
          </div>

          {/* Quick Intelligence Navigation */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-slate-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">SkillPilot Intelligence Modules</h2>
              </div>
              <span className="text-xs text-slate-500">Fast Navigation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                to="/academic-performance"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 hover:bg-white hover:border-slate-300 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Academic Records</p>
                    <p className="text-[11px] text-slate-500">Transcripts & Semesters</p>
                  </div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900 transition" />
              </Link>

              <Link
                to="/career-opportunities"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 hover:bg-white hover:border-slate-300 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Career Tracks</p>
                    <p className="text-[11px] text-slate-500">Domains & Pathways</p>
                  </div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900 transition" />
              </Link>

              <Link
                to="/placement-readiness"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 hover:bg-white hover:border-slate-300 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Placement ML</p>
                    <p className="text-[11px] text-slate-500">Prediction Engine</p>
                  </div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900 transition" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Edit Profile Modal Dialog (Clean, Non-Disruptive) */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <Edit3 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Student Profile</h3>
                  <p className="text-xs text-slate-500">Update your identity, contact details, and handles</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 font-medium focus:border-slate-500 focus:bg-white focus:outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 font-medium focus:border-slate-500 focus:bg-white focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Professional Bio & Career Objective</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Describe your technical background, core competencies, and career goals..."
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 font-medium focus:border-slate-500 focus:bg-white focus:outline-none transition leading-relaxed"
                />
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Code2 className="h-3.5 w-3.5 text-slate-600" />
                  Online & Developer Profiles
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">GitHub Profile URL</label>
                    <input
                      type="url"
                      value={formData.github_url}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      placeholder="https://github.com/username"
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-slate-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-slate-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">LeetCode Username</label>
                    <input
                      type="text"
                      value={formData.leetcode_handle}
                      onChange={(e) => setFormData({ ...formData, leetcode_handle: e.target.value })}
                      placeholder="e.g. alex_chen"
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-slate-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Codeforces Handle</label>
                    <input
                      type="text"
                      value={formData.codeforces_handle}
                      onChange={(e) => setFormData({ ...formData, codeforces_handle: e.target.value })}
                      placeholder="e.g. alex_c"
                      className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-slate-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-xs"
                >
                  <Save className="h-3.5 w-3.5" />
                  {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


