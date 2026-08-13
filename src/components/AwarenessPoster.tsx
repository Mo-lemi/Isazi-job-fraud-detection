import React from 'react';
import { Printer, Briefcase, Building2, MapPin, Link2, Lock, Ban } from 'lucide-react';
import { POSTER_QR } from '../data/posterQr';

/**
 * Printable awareness poster (Prompt 4 sections 21-24). A ready-to-print A4-ish
 * sheet a school, TVET college or career centre can put up. It carries the core
 * safety rules and a QR code to the Qhaphela project. Styled with explicit brand
 * colours (not theme tokens) so it looks identical in light, dark and print.
 * The controls are hidden when printing; only the poster sheet prints.
 */

const RULES = [
  { icon: Briefcase, text: 'Check the job' },
  { icon: Building2, text: 'Verify the employer' },
  { icon: MapPin, text: 'Check the location' },
  { icon: Link2, text: 'Scan the link before you open it' },
  { icon: Lock, text: 'Protect your ID and banking details' },
  { icon: Ban, text: 'Never pay to get a job' },
];

export const AwarenessPoster: React.FC = () => (
  <div className="max-w-3xl mx-auto space-y-4">
    <div className="qp-no-print flex items-center justify-between gap-3">
      <p className="text-sm text-slate-400">
        A ready-to-print poster for schools, colleges and career centres. Print it or save it as a PDF.
      </p>
      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[var(--qp-primary)] text-[var(--qp-primary-ink)] text-sm font-medium transition-all hover:brightness-110 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--qp-primary)]"
      >
        <Printer className="w-4 h-4" aria-hidden="true" />
        <span>Print / save as PDF</span>
      </button>
    </div>

    {/* The poster sheet. Explicit colours so it is print-safe and theme-independent. */}
    <div
      className="rounded-xl overflow-hidden border"
      style={{ background: '#FFFFFF', borderColor: '#E2E8F0', color: '#081A2F' }}
    >
      <div style={{ background: '#081A2F', color: '#FFFFFF' }} className="px-8 py-6 flex items-center gap-3">
        <img src="/icons/logo-mark.png" alt="" className="w-12 h-12 object-contain" aria-hidden="true" />
        <div>
          <p className="text-2xl font-extrabold tracking-widest">QHAPHELA</p>
          <p className="text-sm" style={{ color: '#F4C74A' }}>Know before you apply</p>
        </div>
      </div>

      <div className="px-8 py-8 text-center">
        <h1 className="text-4xl font-extrabold leading-tight">BEFORE YOU APPLY</h1>
        <p className="text-2xl font-bold mt-1" style={{ color: '#083E7D' }}>CHECK WITH QHAPHELA</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 text-left">
          {RULES.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.text} className="flex items-center gap-3">
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
                  style={{ background: '#EAF1FB', color: '#083E7D' }}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <span className="text-lg font-semibold">{r.text}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center">
          <img src={POSTER_QR} alt="QR code linking to Qhaphela" className="w-40 h-40" />
          <p className="text-lg font-bold mt-3">SCAN TO CHECK A JOB</p>
          <p className="text-sm mt-1" style={{ color: '#5B6472' }}>
            github.com/Mo-lemi/Qhaphela-Know-before-you-apply
          </p>
        </div>
      </div>

      <div style={{ background: '#F4F6FA', color: '#5B6472' }} className="px-8 py-4 text-center text-sm">
        Protecting Opportunities. Empowering Futures. &middot; A real-looking poster can still be a scam - always verify the employer yourself.
      </div>
    </div>
  </div>
);

export default AwarenessPoster;
