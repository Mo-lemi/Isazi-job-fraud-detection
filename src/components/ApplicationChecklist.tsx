import React, { useState } from 'react';
import { ClipboardCheck, CheckCircle2 } from 'lucide-react';

/**
 * "Before you apply" checklist (Prompt 2 section 33). A simple interactive list
 * the job seeker ticks off before submitting an application. It holds no data
 * beyond the checkbox state in this component and is never submitted anywhere.
 */
const ITEMS = [
  'I verified the employer independently.',
  'I checked the official company website.',
  'I am not being asked to pay any money.',
  'I checked the recruiter’s contact details.',
  'I have not shared unnecessary personal information.',
  'My CV does not contain my ID number or banking details.',
  'I understand where my application is being submitted.',
];

export const ApplicationChecklist: React.FC = () => {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const allDone = checked.size === ITEMS.length;

  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardCheck className="w-4 h-4 text-[var(--qp-primary)]" aria-hidden="true" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Before you apply</span>
      </div>
      <ul className="space-y-2">
        {ITEMS.map((item, i) => {
          const on = checked.has(i);
          return (
            <li key={i}>
              <button
                onClick={() => toggle(i)}
                aria-pressed={on}
                className="w-full flex items-start gap-3 text-left text-sm text-slate-200 group"
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    on ? 'bg-[var(--qp-safe)] border-[var(--qp-safe)] text-white' : 'border-slate-600 group-hover:border-slate-400'
                  }`}
                >
                  {on ? '✓' : ''}
                </span>
                <span className={on ? 'text-slate-400 line-through' : ''}>{item}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {allDone && (
        <p className="mt-4 flex items-center gap-2 text-sm text-[var(--qp-safe)] font-medium">
          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
          You have worked through the safety checklist. Apply with care.
        </p>
      )}
    </div>
  );
};

export default ApplicationChecklist;
