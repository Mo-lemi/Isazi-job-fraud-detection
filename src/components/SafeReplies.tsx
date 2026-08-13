import React, { useState } from 'react';
import { MessageSquare, Copy, CheckCircle2, HelpCircle } from 'lucide-react';

/**
 * Safe verification replies and questions (Prompt 3, sections 33-34 and 83-88).
 *
 * Gives a job seeker polite, non-confrontational wording to verify an employer
 * before sharing anything. Nothing here accuses the recruiter; it simply asks
 * for the checks a legitimate employer can easily provide. All copy is generic
 * and truthful - no company or personal details are invented.
 */

interface Template {
  id: string;
  title: string;
  body: string;
}

const QUESTIONS: string[] = [
  'Can you confirm the official careers page where this vacancy is listed?',
  'Is any fee, deposit or payment required at any stage of the process?',
  'What is your official company email address?',
  'Can you confirm the interview address and the interviewer’s name?',
];

const TEMPLATES: Template[] = [
  {
    id: 'verify',
    title: 'Ask the recruiter to verify the vacancy',
    body:
      'Hello, thank you for reaching out about this role. Before I share any personal information, could you please confirm the official company email address and the careers page where this vacancy is advertised? I would like to verify the opportunity first. Thank you.',
  },
  {
    id: 'fees',
    title: 'Ask about any fees',
    body:
      'Thank you for the information. Could you please confirm whether any fee, deposit or payment is required at any stage of the recruitment process? I want to make sure I understand the process fully before continuing.',
  },
  {
    id: 'interview',
    title: 'Confirm an interview',
    body:
      'Thank you for the invitation. Before attending, could you please confirm the interview address, the name of the interviewer and an official company contact number? I would appreciate having these details in advance.',
  },
  {
    id: 'decline',
    title: 'Politely step back',
    body:
      'Thank you for the opportunity. I have decided not to proceed until I can independently verify the vacancy and the recruitment process. I appreciate your understanding.',
  },
  {
    id: 'employer',
    title: 'Email the company directly to confirm',
    body:
      'Hello, I am writing to confirm whether the following vacancy is genuinely being advertised by your organisation, as I was contacted about it by a recruiter. Could you please confirm whether this role is open and which official channel I should apply through? Thank you for your help.',
  },
];

export const SafeReplies: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 2500);
    } catch {
      /* Clipboard can be blocked in some contexts; the text is still visible to
         select and copy manually, so fail quietly. */
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-5 h-5 text-[var(--qp-primary)]" aria-hidden="true" />
          <h2 className="text-lg font-bold text-slate-100">Verify a recruiter safely</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          A real employer can easily confirm who they are. These polite messages ask for that without
          accusing anyone. Copy one, adjust it if you like, and send it before sharing your ID,
          banking details or any payment.
        </p>
      </div>

      {/* Questions to ask */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-4 h-4 text-[var(--qp-warn)]" aria-hidden="true" />
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Good questions to ask</h3>
        </div>
        <ul className="space-y-2.5">
          {QUESTIONS.map((q, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-200">
              <span className="text-[var(--qp-warn)] mt-0.5 shrink-0" aria-hidden="true">?</span>
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Copy-ready templates */}
      <div className="space-y-4">
        {TEMPLATES.map((tpl) => (
          <div key={tpl.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-sm font-semibold text-slate-100">{tpl.title}</h3>
              <button
                onClick={() => copy(tpl.id, tpl.body)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-medium transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--qp-primary)]"
                aria-label={`Copy: ${tpl.title}`}
              >
                {copiedId === tpl.id
                  ? <><CheckCircle2 className="w-3.5 h-3.5 text-[var(--qp-safe)]" aria-hidden="true" /><span>Copied</span></>
                  : <><Copy className="w-3.5 h-3.5" aria-hidden="true" /><span>Copy</span></>}
              </button>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 border border-slate-800/80 rounded-lg p-3">
              {tpl.body}
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500 italic px-1">
        If a recruiter refuses to answer simple verification questions, or pressures you to skip them,
        treat that as a warning sign.
      </p>
    </div>
  );
};

export default SafeReplies;
