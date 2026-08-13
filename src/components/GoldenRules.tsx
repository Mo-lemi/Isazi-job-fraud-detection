import React from 'react';
import { ShieldCheck } from 'lucide-react';

/**
 * South African youth work-safety golden rules. Mirrors the closing section of
 * the browser-extension panel so both surfaces end on the same five plain-language
 * rules. These are universal safety principles, not claims about any one job.
 */
const RULES = [
  'Never pay to get a job.',
  'Protect your ID number.',
  'Protect your banking details.',
  'Verify the employer independently.',
  "Don't let urgency pressure you.",
];

export const GoldenRules: React.FC = () => (
  <section
    aria-label="South African youth work safety golden rules"
    className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-6"
  >
    <div className="flex items-center gap-2 mb-4">
      <ShieldCheck className="w-5 h-5 text-[var(--qp-safe)]" aria-hidden="true" />
      <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
        South African youth work safety - golden rules
      </h2>
    </div>
    <ol className="space-y-2.5">
      {RULES.map((rule, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-slate-200">
          <span
            aria-hidden="true"
            className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--qp-safe-soft)] text-[var(--qp-safe)] text-xs font-bold shrink-0"
          >
            {i + 1}
          </span>
          <span className="pt-0.5">{rule}</span>
        </li>
      ))}
    </ol>
  </section>
);

export default GoldenRules;
