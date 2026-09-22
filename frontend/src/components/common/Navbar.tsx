import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  User,
  LogOut,
  Flame,
  Award,
  Sparkles,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from './Badge';

export const Navbar: React.FC = () => {
  const { student, logout, login } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDemoSwitcher, setShowDemoSwitcher] = useState(false);

  const handleDemoSwitch = async (email: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'password123' })
      });
      const data = await res.json();
      if (data.access_token) {
        await login(data.access_token);
        setShowDemoSwitcher(false);
        navigate('/');
      }
    } catch (err) {
      console.error('Failed to switch demo persona:', err);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur-md shadow-xs">
      {/* Search Input */}
      <div className="flex items-center gap-3">
        <div className="relative w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search skills, topics, projects, domains..."
            className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 transition"
          />
        </div>
        {student?.dept_code === 'ECE' && (
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
            <Sparkles className="h-3.5 w-3.5 text-slate-500" />
            ECE Dual-Track Active
          </span>
        )}
      </div>

      {/* Right Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Demo Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDemoSwitcher(!showDemoSwitcher)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
          >
            <Layers className="h-3.5 w-3.5 text-slate-600" />
            <span className="hidden md:inline">Switch Persona</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showDemoSwitcher && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in duration-150">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Demo Persona
              </div>
              <button
                onClick={() => handleDemoSwitch('alex.ece@skillpilot.ai')}
                className="w-full text-left rounded-xl p-2.5 hover:bg-slate-50 transition flex flex-col gap-0.5"
              >
                <span className="text-xs font-bold text-slate-900">Alex Chen (ECE Dual-Track)</span>
                <span className="text-[11px] text-slate-500">Core ECE (Embedded/VLSI) + Software</span>
              </button>
              <button
                onClick={() => handleDemoSwitch('priya.cse@skillpilot.ai')}
                className="w-full text-left rounded-xl p-2.5 hover:bg-slate-50 transition flex flex-col gap-0.5"
              >
                <span className="text-xs font-bold text-slate-900">Priya Sharma (CSE Specialist)</span>
                <span className="text-[11px] text-slate-500">Competitive Coding • LeetCode 1850+</span>
              </button>
              <button
                onClick={() => handleDemoSwitch('rahul.aiml@skillpilot.ai')}
                className="w-full text-left rounded-xl p-2.5 hover:bg-slate-50 transition flex flex-col gap-0.5"
              >
                <span className="text-xs font-bold text-slate-900">Rahul Verma (AI/ML Specialist)</span>
                <span className="text-[11px] text-slate-500">Deep Learning & Statistical Intelligence</span>
              </button>
            </div>
          )}
        </div>

        {/* Streak indicator */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs">
          <Flame className="h-3.5 w-3.5 text-amber-500" />
          <span>14 Day Streak</span>
        </div>

        {/* Notifications */}
        <button className="relative rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition shadow-2xs">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-600" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-1.5 pr-3 hover:bg-slate-100 transition shadow-2xs"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 font-bold text-white text-xs">
              {student?.name ? student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'SP'}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">{student?.name || 'Student'}</div>
              <div className="text-[10px] text-slate-500 leading-tight font-medium">{student?.dept_code || 'Engineering'} • Yr {student?.year || 3}</div>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-xs font-semibold text-slate-800">{student?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{student?.email}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { setShowProfileMenu(false); navigate('/profile'); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  Student Profile
                </button>
                <button
                  onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  <Award className="h-3.5 w-3.5 text-slate-500" />
                  Settings & Preferences
                </button>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
