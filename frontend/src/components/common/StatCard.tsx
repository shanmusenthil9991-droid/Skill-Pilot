import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    neutral?: boolean;
  };
  accentColor?: 'brand' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'violet';
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'brand',
  onClick,
  className = '',
}) => {
  const accentStyles = {
    brand: {
      bg: 'bg-slate-100 border-slate-200 text-slate-800',
      glow: 'hover:border-slate-300 hover:shadow-sm',
    },
    emerald: {
      bg: 'bg-slate-100 border-slate-200 text-slate-800',
      glow: 'hover:border-slate-300 hover:shadow-sm',
    },
    amber: {
      bg: 'bg-slate-100 border-slate-200 text-slate-800',
      glow: 'hover:border-slate-300 hover:shadow-sm',
    },
    rose: {
      bg: 'bg-slate-100 border-slate-200 text-slate-800',
      glow: 'hover:border-slate-300 hover:shadow-sm',
    },
    cyan: {
      bg: 'bg-slate-100 border-slate-200 text-slate-800',
      glow: 'hover:border-slate-300 hover:shadow-sm',
    },
    violet: {
      bg: 'bg-slate-100 border-slate-200 text-slate-800',
      glow: 'hover:border-slate-300 hover:shadow-sm',
    },
  };

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-5 shadow-xs transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      } ${accentStyles[accentColor].glow} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">{value}</h3>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className={`rounded-xl border p-3 ${accentStyles[accentColor].bg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          <span
            className={`font-semibold ${
              trend.neutral
                ? 'text-slate-500'
                : trend.isPositive
                ? 'text-emerald-600'
                : 'text-rose-600'
            }`}
          >
            {trend.value}
          </span>
          <span className="text-slate-400">vs historical baseline</span>
        </div>
      )}
    </div>
  );
};

