import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Compass,
  User,
  GraduationCap,
  Code2,
  Binary,
  Globe,
  Calculator,
  Brain,
  MessageSquareText,
  Speech,
  Award,
  FolderGit2,
  Briefcase,
  BookOpenCheck,
  Target,
  Sparkles,
  GitPullRequestDraft,
  Lightbulb,
  Settings,
  ChevronRight,
  Cpu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { student } = useAuth();
  const dept = (student?.dept_code || '').toUpperCase();
  const isCoreDept = ['ECE', 'EEE', 'MECH', 'CIVIL', 'MECHANICAL'].includes(dept);
  const isECE = dept === 'ECE';

  const navSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/', icon: Compass },
        { name: 'Student Profile', path: '/profile', icon: User },
      ],
    },
    {
      title: isCoreDept ? 'CORE DOMAIN & TOPICS' : 'ACADEMICS & CODING',
      items: [
        { name: 'Academic Performance', path: '/academics', icon: GraduationCap },
        { 
          name: isCoreDept ? 'Core Domain Skills' : 'Programming Skills', 
          path: '/programming-skills', 
          icon: isCoreDept ? Cpu : Code2 
        },
        { 
          name: isCoreDept ? 'Technical Topic Mastery' : 'DSA Analysis', 
          path: '/dsa-analysis', 
          icon: Binary 
        },
        { 
          name: 'Online Coding Hub', 
          path: '/online-coding', 
          icon: Globe, 
          badge: 'Active', 
          badgeColor: 'bg-emerald-100 text-emerald-700' 
        },
      ],
    },
    {
      title: 'COGNITIVE & SOFT SKILLS',
      items: [
        { name: 'Quantitative Aptitude', path: '/aptitude', icon: Calculator },
        { name: 'Logical Reasoning', path: '/logical-reasoning', icon: Brain },
        { name: 'Verbal Ability', path: '/verbal-ability', icon: MessageSquareText },
        { name: 'Communication Skills', path: '/communication', icon: Speech },
      ],
    },
    {
      title: 'EXPERIENCE PORTFOLIO',
      items: [
        { name: 'Projects & Repos', path: '/projects', icon: FolderGit2 },
        { name: 'Internships', path: '/internships', icon: Briefcase },
        { name: 'Certifications', path: '/certifications', icon: Award },
        { name: 'Training Programs', path: '/training', icon: BookOpenCheck },
      ],
    },
    {
      title: 'CAREER & PLACEMENT AI',
      items: [
        { 
          name: 'Career Opportunities', 
          path: '/career-opportunities', 
          icon: Target, 
          badge: isECE ? 'Dual-Track' : undefined,
          badgeColor: 'bg-violet-100 text-violet-700' 
        },
        { name: 'Placement Readiness', path: '/placement-readiness', icon: Sparkles, badge: 'ML Model', badgeColor: 'bg-brand-100 text-brand-700' },
        { name: 'Skill Gap Engine', path: '/skill-gap', icon: GitPullRequestDraft },
        { name: 'Recommendations', path: '/recommendations', icon: Lightbulb },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { name: 'Settings & Account', path: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white shadow-xs">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5 bg-white">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 shadow-xs">
          <Compass className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black tracking-tight text-slate-900">SKILLPILOT</span>
            <span className="rounded bg-slate-100 px-1 py-0.2 text-[9px] font-bold text-slate-700 border border-slate-200">AI</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium tracking-tight">Career & Placement Intelligence</p>
        </div>
      </div>

      {/* Navigation Links (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`h-4 w-4 shrink-0 transition-transform ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'}`} />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.badge ? (
                        <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold shrink-0 ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {item.badge}
                        </span>
                      ) : (
                        <ChevronRight className={`h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 shrink-0 ${isActive ? 'text-white/60' : 'text-slate-400'}`} />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom User Card */}
      <div className="border-t border-slate-200 p-3 bg-slate-50/70">
        <div className="flex items-center gap-3 rounded-xl bg-white border border-slate-200 p-2.5 shadow-2xs">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 font-black text-xs text-white">
            {student?.name ? student.name[0] : 'S'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 truncate">{student?.name || 'Student Pilot'}</div>
            <div className="text-[10px] text-slate-500 font-mono truncate">{student?.student_id || 'SP2026-REG'}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
