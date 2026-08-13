import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Phone, Lock, Info } from 'lucide-react';

/**
 * "I think I've been scammed" recovery flow (Prompt 3, sections 47-50).
 *
 * Deliberately calm and non-judgemental. The guidance is general first-response
 * advice, not legal advice, and it never claims Qhaphela can reverse damage.
 * Only real, verifiable South African channels are named; no phone numbers are
 * invented (10111 is the genuine SAPS emergency number; bank numbers are
 * referred to the card/app rather than guessed).
 */

interface Incident {
  id: string;
  label: string;
  guidance: string;
}

const INCIDENTS: Incident[] = [
  {
    id: 'money',
    label: 'I sent money',
    guidance:
      "Contact your bank straight away using the fraud number on the back of your card or inside your banking app. Ask them to try to stop or reverse the payment and to flag the recipient. Then open a case with SAPS.",
  },
  {
    id: 'id',
    label: 'I sent my ID',
    guidance:
      'Your ID can be used for identity theft and SIM-swap fraud. Report the compromise to SAFPS (Southern African Fraud Prevention Service) so a protective notice can be placed against your ID, and alert your bank to watch your accounts.',
  },
  {
    id: 'banking',
    label: 'I sent banking information',
    guidance:
      "Phone your bank's fraud line now to freeze or monitor the account. Change your online-banking password and PIN, and turn on transaction alerts if they are not already on.",
  },
  {
    id: 'password',
    label: 'I shared a password',
    guidance:
      'Change that password immediately, and change it anywhere else you used the same one. Turn on two-factor authentication (2FA) on those accounts so a password alone is not enough to log in.',
  },
  {
    id: 'documents',
    label: 'I shared documents',
    guidance:
      'Note exactly what you sent. If it included your ID, bank statements or proof of address, follow the ID and banking steps above and watch closely for accounts or SIMs opened in your name.',
  },
  {
    id: 'link',
    label: 'I clicked a suspicious link',
    guidance:
      'Do not enter any details on the page it opened. Run a security or antivirus scan on your device, and change the password for any account you may have signed into there.',
  },
  {
    id: 'interview',
    label: 'I attended a suspicious interview',
    guidance:
      'Write down the address and any names or numbers you were given. Never pay for an interview, training or equipment. Tell someone you trust what happened, especially before any follow-up meeting.',
  },
  {
    id: 'unsure',
    label: "I'm not sure what happened",
    guidance:
      'That is okay. Tick anything above that might apply. If nothing fits, a safe start is to contact your bank and change the passwords on your main accounts as a precaution.',
  },
];

const ACCOUNT_STEPS = [
  'Change the affected passwords, and any account that shared the same password.',
  'Turn on two-factor authentication (2FA) wherever it is offered.',
  'Check your recent bank and account activity for anything you do not recognise.',
  'Watch for follow-up messages pretending to "help you recover" - that is often a second scam.',
];

const RESOURCES = [
  {
    name: 'Your bank',
    detail: 'Use the fraud or lost-card number on the back of your card or in your banking app. Do not use a number a recruiter gave you.',
  },
  {
    name: 'SAPS (South African Police Service)',
    detail: 'Call 10111 in an emergency, or go to your nearest police station to open a case.',
  },
  {
    name: 'SAFPS (Southern African Fraud Prevention Service)',
    detail: 'Report identity theft and ask for a protective registration against your ID number.',
  },
  {
    name: 'Information Regulator (South Africa)',
    detail: 'If your personal information was misused, you can lodge a POPIA complaint through their official website.',
  },
];

export const ScamRecovery: React.FC = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const chosen = INCIDENTS.filter((i) => selected.has(i.id));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Calm, clear banner */}
      <div className="bg-[var(--qp-risk-soft)] border border-[var(--qp-risk)] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="w-6 h-6 text-[var(--qp-risk)]" aria-hidden="true" />
          <h2 className="text-xl font-bold text-[var(--qp-risk)]">Stop and pause</h2>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">
          If you think a job or recruiter has scammed you, take a breath. Do not send anything else or
          pay any more money. Work through the steps below - acting quickly gives you the best chance,
          and none of this is your fault.
        </p>
      </div>

      {/* What happened */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">What happened?</h3>
        <p className="text-xs text-slate-400 mb-4">Tick everything that applies. Qhaphela will show the first steps for each.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {INCIDENTS.map((inc) => {
            const active = selected.has(inc.id);
            return (
              <button
                key={inc.id}
                onClick={() => toggle(inc.id)}
                aria-pressed={active}
                className={`flex items-center gap-2.5 text-left text-sm px-3.5 py-2.5 rounded-lg border transition-colors ${
                  active
                    ? 'bg-[var(--qp-primary)] text-[var(--qp-primary-ink)] border-[var(--qp-primary)]'
                    : 'bg-slate-950 text-slate-200 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    active ? 'border-[var(--qp-primary-ink)]' : 'border-slate-600'
                  }`}
                >
                  {active ? '✓' : ''}
                </span>
                <span>{inc.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tailored guidance for the ticked items */}
      {chosen.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Your first steps</h3>
          <ul className="space-y-4">
            {chosen.map((inc) => (
              <li key={inc.id} className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-[var(--qp-warn)] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-slate-100">{inc.label}</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{inc.guidance}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Account-security checklist (always shown) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-[var(--qp-safe)]" aria-hidden="true" />
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Secure your accounts</h3>
        </div>
        <ul className="space-y-2.5">
          {ACCOUNT_STEPS.map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-[var(--qp-safe)] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Where to report (real SA channels only) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-4 h-4 text-[var(--qp-primary)]" aria-hidden="true" />
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Where to get help (South Africa)</h3>
        </div>
        <ul className="space-y-3">
          {RESOURCES.map((r) => (
            <li key={r.name}>
              <p className="text-sm font-semibold text-slate-100">{r.name}</p>
              <p className="text-sm text-slate-300 leading-relaxed">{r.detail}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Honest limits */}
      <div className="flex items-start gap-2.5 text-xs text-slate-500 italic px-1">
        <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
        <p>
          Qhaphela cannot recover money or undo a scam, and this is not legal advice. These are the
          standard first steps - act quickly and only ever use official contact channels.
        </p>
      </div>
    </div>
  );
};

export default ScamRecovery;
