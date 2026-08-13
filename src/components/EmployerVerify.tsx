import React, { useState } from 'react';
import { Building2, RefreshCw, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

/**
 * Employer verification (roadmap A). Calls the same passive-recon endpoint the
 * extension uses (/api/verify-employer): it pulls the email/website out of the
 * posting text and runs public DNS/RDAP/TLS and local checks. It reports counts
 * of passed / concerns / unchecked, never a "trust score" - these checks cannot
 * prove a company is legitimate, only surface things worth verifying yourself.
 */

interface Finding {
  key: string;
  state: 'verified' | 'warning' | 'unknown';
  label: string;
  detail: string;
}
interface VerifyResult {
  domain_checked: string | null;
  email_domains: string[];
  websites: string[];
  findings: Finding[];
  counts: { verified: number; warning: number; unknown: number };
  caveat: string;
}

const stateIcon = (s: Finding['state']) =>
  s === 'verified' ? (
    <CheckCircle2 className="w-4 h-4 text-[var(--qp-safe)] shrink-0 mt-0.5" aria-hidden="true" />
  ) : s === 'warning' ? (
    <AlertTriangle className="w-4 h-4 text-[var(--qp-warn)] shrink-0 mt-0.5" aria-hidden="true" />
  ) : (
    <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
  );

export const EmployerVerify: React.FC<{ jobText: string }> = ({ jobText }) => {
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const check = async () => {
    if (!jobText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/verify-employer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: jobText }),
      });
      if (resp.ok) setResult(await resp.json());
      else setError('Could not run the employer checks right now.');
    } catch {
      setError('Cannot reach the Qhaphela verification service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
      <div className="flex items-center gap-2 mb-2">
        <Building2 className="w-4 h-4 text-[var(--qp-primary)]" aria-hidden="true" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verify this employer</span>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        Runs public checks on any company email or website mentioned in the posting. These help you
        verify the employer - they do not prove a job is real.
      </p>

      {!result && (
        <button
          onClick={check}
          disabled={loading || !jobText.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--qp-primary)] text-[var(--qp-primary-ink)] text-sm font-medium transition-all hover:brightness-110 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--qp-primary)]"
        >
          <RefreshCw aria-hidden="true" className={`w-4 h-4 ${loading ? 'animate-spin motion-reduce:animate-none' : ''}`} />
          <span>{loading ? 'Checking...' : 'Check the employer details'}</span>
        </button>
      )}

      {error && <p className="mt-2 text-sm text-[var(--qp-risk)]">{error}</p>}

      {result && (
        <div className="space-y-3">
          <p className="text-sm text-slate-300">
            <span className="text-[var(--qp-safe)] font-semibold">{result.counts.verified} passed</span>
            {' · '}
            <span className="text-[var(--qp-warn)] font-semibold">{result.counts.warning} concern{result.counts.warning === 1 ? '' : 's'}</span>
            {' · '}
            <span className="text-slate-400 font-semibold">{result.counts.unknown} unchecked</span>
            {result.domain_checked ? <span className="text-slate-500"> · checked {result.domain_checked}</span> : null}
          </p>

          {result.findings.length === 0 ? (
            <p className="text-sm text-slate-300">
              No company email or website was found in this posting to check. Ask the recruiter for the
              official company website and verify it yourself.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {result.findings.map((f) => (
                <li key={f.key} className="flex items-start gap-2.5 text-sm">
                  {stateIcon(f.state)}
                  <span>
                    <span className="text-slate-100 font-medium">{f.label}</span>
                    {f.detail ? <span className="text-slate-400"> - {f.detail}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <p className="text-xs text-slate-500 italic">{result.caveat}</p>
        </div>
      )}
    </div>
  );
};

export default EmployerVerify;
