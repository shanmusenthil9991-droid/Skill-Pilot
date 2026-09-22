import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Compass,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Layers,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Badge } from '../components/common/Badge';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      if (res.data.access_token) {
        await login(res.data.access_token);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 shadow-md">
            <Compass className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">SKILLPILOT</h1>
          <p className="text-xs font-semibold text-brand-600">
            "Navigate Your Skills. Pilot Your Career."
          </p>
          <p className="text-xs text-slate-500 max-w-xs mx-auto pt-1">
            AI-Powered Student Skill, Career & Placement Intelligence Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">Student Account Sign In</h2>
            <p className="text-xs text-slate-500">Access your verified skill graph, technical mastery & placement intelligence</p>
          </div>

          {error && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-700">College Student Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.ece@skillpilot.ai"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-1">
                <span>Password</span>
                <Link to="/forgot-password" className="text-[11px] text-brand-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-brand-500 transition"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In & Launch Cockpit'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Persona Demo Buttons */}
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              <span>Quick Demo Student Logins</span>
              <Badge variant="purple" size="sm">Pre-seeded</Badge>
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('alex.ece@skillpilot.ai')}
                className="w-full text-left rounded-xl bg-slate-50 border border-slate-200/80 p-2.5 hover:bg-slate-100 hover:border-violet-300 transition flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900">Alex Chen (ECE Showcase)</div>
                  <div className="text-[10px] text-violet-700">Core ECE (Embedded/VLSI) + Software Dual Track</div>
                </div>
                <span className="text-[10px] font-mono font-bold text-brand-600">Fill</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('priya.cse@skillpilot.ai')}
                className="w-full text-left rounded-xl bg-slate-50 border border-slate-200/80 p-2.5 hover:bg-slate-100 hover:border-emerald-300 transition flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900">Priya Sharma (CSE Specialist)</div>
                  <div className="text-[10px] text-emerald-700">High Coding & DSA • 450+ LeetCode Solves</div>
                </div>
                <span className="text-[10px] font-mono font-bold text-brand-600">Fill</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('rahul.aiml@skillpilot.ai')}
                className="w-full text-left rounded-xl bg-slate-50 border border-slate-200/80 p-2.5 hover:bg-slate-100 hover:border-cyan-300 transition flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900">Rahul Verma (AI/ML & DS)</div>
                  <div className="text-[10px] text-cyan-700">Deep Learning • Statistical Intelligence</div>
                </div>
                <span className="text-[10px] font-mono font-bold text-brand-600">Fill</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
