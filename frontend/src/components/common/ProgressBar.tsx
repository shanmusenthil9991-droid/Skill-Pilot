import React from 'react';

interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  label?: string;
  sublabel?: string;
  color?: 'brand' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'violet';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  sublabel,
  color = 'brand',
  size = 'md',
  showPercentage = true,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const colorGradients = {
    brand: 'from-brand-600 to-cyan-500',
    emerald: 'from-emerald-600 to-teal-500',
    amber: 'from-amber-500 to-yellow-500',
    rose: 'from-rose-600 to-pink-500',
    cyan: 'from-cyan-600 to-blue-500',
    violet: 'from-violet-600 to-purple-500',
  };

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
          <span>{label}</span>
          <div className="flex items-center gap-2">
            {sublabel && <span className="text-slate-500 text-xs font-normal">{sublabel}</span>}
            {showPercentage && <span className="font-bold text-slate-900">{percentage}%</span>}
          </div>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 ${heightStyles[size]}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorGradients[color]} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

