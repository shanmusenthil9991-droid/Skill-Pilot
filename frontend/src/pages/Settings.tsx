import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Lock,
  Bell,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';

export const Settings: React.FC = () => {
  const { student, logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  // Notification Toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [placementAlerts, setPlacementAlerts] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);
  const [savedPrefs, setSavedPrefs] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPwError('Password must be at least 6 characters');
      return;
    }

    try {
      setPwLoading(true);
      await api.post('/settings/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      setPwSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwSuccess(false), 4000);
    } catch (err: any) {
      setPwError(err.response?.data?.detail || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  const handleSavePreferences = () => {
    setSavedPrefs(true);
    setTimeout(() => setSavedPrefs(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
          <SettingsIcon className="h-4 w-4 text-brand-600" />
          Account & Platform Configuration
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Settings & Preferences</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your security credentials, notification channels, target career preferences, and session controls.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security & Password Change */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lock className="h-4 w-4 text-brand-600" />
            Change Password & Security
          </h3>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            {pwError && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {pwError}
              </div>
            )}

            {pwSuccess && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Password updated successfully!
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-slate-600">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={pwLoading}
              className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-500 transition shadow-xs"
            >
              <ShieldCheck className="h-4 w-4" />
              {pwLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Notifications & System Preferences */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Bell className="h-4 w-4 text-cyan-600" />
            Notification & Intelligence Alerts
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-200/80">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Campus Placement Drive Alerts</h4>
                <p className="text-[11px] text-slate-500">Instant notifications when you match target role criteria</p>
              </div>
              <input
                type="checkbox"
                checked={placementAlerts}
                onChange={(e) => setPlacementAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-200/80">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Skill & Lab Milestone Reminders</h4>
                <p className="text-[11px] text-slate-500">Regular reminders to track hands-on project and training progress</p>
              </div>
              <input
                type="checkbox"
                checked={streakReminders}
                onChange={(e) => setStreakReminders(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 border border-slate-200/80">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Weekly Skill Gap Digest</h4>
                <p className="text-[11px] text-slate-500">Summary email of top recommended learning actions</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
            </div>

            <button
              onClick={handleSavePreferences}
              className="flex items-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
            >
              <Save className="h-4 w-4 text-brand-600" />
              Save Notification Preferences
            </button>

            {savedPrefs && (
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Preferences saved!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sign Out Card */}
      <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Sign Out of SkillPilot</h3>
          <p className="text-xs text-slate-500">Terminates your active session on this device.</p>
        </div>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-rose-500 transition shadow-xs"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};
