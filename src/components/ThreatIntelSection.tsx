import React from 'react';
import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import { ThreatIntel } from '../types';

/**
 * South African threat intelligence (Prompt 2 section 19). Shows curated
 * indicator matches (or an honest "none matched") and community reports, kept
 * strictly separate. "No known indicators matched" is never presented as proof
 * the job is legitimate. Community reports are local-only: Qhaphela has no
 * shared reporting network, so these are never shown as other people's reports.
 */
export const ThreatIntelSection: React.FC<{ intel: ThreatIntel }> = ({ intel }) => {
  const matched = intel.curated || [];
  const local = intel.local_reports || [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
      <div className="flex items-center gap-2 mb-3">
        <ShieldAlert className="w-4 h-4 text-[var(--qp-primary)]" aria-hidden="true" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">🇿🇦 South African threat intelligence</span>
      </div>

      {matched.length === 0 ? (
        <p className="text-sm text-slate-200">No known scam indicators matched this posting.</p>
      ) : (
        <ul className="space-y-2">
          {matched.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <AlertTriangle className="w-4 h-4 text-[var(--qp-warn)] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <span className="text-slate-100 font-medium">{f.category}</span>
                {f.note ? <span className="text-slate-400"> - {f.note}</span> : null}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-slate-500 mt-2">
        Matched against {intel.curated_pattern_count} documented South African recruitment-fraud indicators.
      </p>

      <div className="mt-4 pt-4 border-t border-slate-800">
        <p className="text-xs font-semibold text-slate-300 mb-1">Community reports</p>
        {local.length === 0 ? (
          <p className="text-sm text-slate-300">Nothing reported for this posting on this device.</p>
        ) : (
          <ul className="space-y-1">
            {local.map((f, i) => (
              <li key={i} className="text-sm text-slate-300">{f.note}</li>
            ))}
          </ul>
        )}
        <p className="text-[11px] text-slate-500 mt-2">
          Reports are stored locally on this device. Qhaphela has no shared reporting network yet, so
          these are never shown as other people&apos;s reports.
        </p>
      </div>

      <div className="mt-4 flex items-start gap-2.5 text-xs text-slate-500 italic">
        <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
        <p>&quot;No known scam indicators matched&quot; does not mean this job is legitimate. Always verify the employer yourself.</p>
      </div>
    </div>
  );
};

export default ThreatIntelSection;
