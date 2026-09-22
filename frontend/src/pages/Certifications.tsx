import React, { useEffect, useState } from 'react';
import {
  Award,
  ExternalLink,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Building
} from 'lucide-react';
import api from '../services/api';
import { CertificationItem } from '../types';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';

export const Certifications: React.FC = () => {
  const [certs, setCerts] = useState<CertificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/experience/certifications');
        setCerts(res.data.certifications || []);
      } catch (err) {
        console.error('Failed to load certifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
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
        <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
          <Award className="h-4 w-4" />
          Industry Credentials & Verified Certifications
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Verified Certifications Portfolio</h1>
        <p className="text-xs text-slate-500 mt-1">
          Tracking individual credential issuers, domains, issue dates, and unique validation IDs.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Certifications"
          value={`${certs.length}`}
          subtitle="AWS, DeepLearning.AI, Coursera, edX"
          icon={Award}
          accentColor="brand"
          trend={{ value: '100% Verified Credentials', isPositive: true }}
        />
        <StatCard
          title="Certification Status"
          value="All Active"
          subtitle="Valid & Verified Credential IDs"
          icon={ShieldCheck}
          accentColor="emerald"
          trend={{ value: 'Zero Expired Badges', isPositive: true }}
        />
        <StatCard
          title="Primary Domain"
          value="Cloud & Embedded Systems"
          subtitle="Multi-disciplinary Skill Proof"
          icon={Building}
          accentColor="violet"
          trend={{ value: 'High Industry Recognition', isPositive: true }}
        />
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {certs.map((cert) => (
          <div
            key={cert.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 border border-brand-100 text-brand-600">
                  <Award className="h-6 w-6" />
                </div>
                <Badge variant="success" size="sm">
                  {cert.status}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{cert.name}</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Issued by: <strong className="text-slate-800">{cert.provider}</strong>
                </p>
              </div>

              <div className="space-y-2 bg-slate-50 rounded-2xl p-3 border border-slate-200/80 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Domain:</span>
                  <span className="font-semibold text-brand-600">{cert.domain}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Issue Date:</span>
                  <span className="font-mono text-slate-700">{cert.issue_date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Credential ID:</span>
                  <span className="font-mono text-slate-800 font-semibold">{cert.credential_id}</span>
                </div>
              </div>
            </div>

            <a
              href={cert.credential_url}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              <span>Verify Credential Online</span>
              <ExternalLink className="h-3.5 w-3.5 text-brand-600" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
