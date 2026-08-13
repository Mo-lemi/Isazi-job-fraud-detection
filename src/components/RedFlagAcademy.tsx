import React, { useState } from 'react';
import { ACADEMY_LESSONS } from '../data/samples';
import { SupportedLanguage } from '../types';
import { BookOpen, Share2, Check, Globe, Shield, MessageSquare, AlertTriangle, Layers } from 'lucide-react';

export const RedFlagAcademy: React.FC = () => {
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const [copiedLessonId, setCopiedLessonId] = useState<string | null>(null);

  const langNames: Record<SupportedLanguage, string> = {
    en: 'English',
    zu: 'isiZulu',
    af: 'Afrikaans',
  };

  const handleShare = async (lessonId: string, title: string, content: string) => {
    const cardText = `⚑ ${title} (${langNames[lang]})\n\n${content}\n\nvia Qhaphela Red Flag Academy`;
    try {
      await navigator.clipboard.writeText(cardText);
      setCopiedLessonId(lessonId);
      setTimeout(() => setCopiedLessonId(null), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Academy Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/30 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold font-mono tracking-wide text-[var(--qp-warn)]">
                Red Flag Academy
              </h2>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Media & Information Literacy (MIL) Education: each lesson generalises one real job scam flag into a transferable skill. Share cards work with no app install required.
            </p>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-amber-500/40 p-1.5 rounded-lg">
            <Globe className="w-4 h-4 text-amber-400 ml-1.5" />
            <span className="text-xs font-mono text-slate-400 uppercase font-semibold">Language:</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as SupportedLanguage)}
              className="bg-slate-950 text-[var(--qp-warn)] text-xs font-medium py-1 px-2.5 rounded border border-slate-800 outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="zu">isiZulu</option>
              <option value="af">Afrikaans</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lesson Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ACADEMY_LESSONS.map((lesson) => {
          const lessonContent = lesson[lang];
          const isCopied = copiedLessonId === lesson.id;

          return (
            <div
              key={lesson.id}
              className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:border-amber-500/40 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs text-[var(--qp-warn)] font-semibold uppercase tracking-wider bg-[var(--qp-warn-soft)] px-2 py-0.5 rounded border border-[var(--qp-warn)]">
                    Red Flag Pattern #{lesson.id}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{langNames[lang]}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-100 group-hover:text-[var(--qp-warn)] transition-colors">
                  {lesson.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed font-sans bg-slate-900/60 p-4 rounded-lg border border-slate-800/80">
                  {lessonContent}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-900 flex items-center justify-between">
                <span className="text-xs text-slate-500">Free to copy & forward</span>
                <button
                  onClick={() => handleShare(lesson.id, lesson.title, lessonContent)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isCopied
                      ? 'bg-[var(--qp-safe-soft)] text-[var(--qp-safe)] border border-[var(--qp-safe)]'
                      : 'bg-[var(--qp-warn-soft)] hover:brightness-95 text-[var(--qp-warn)] border border-[var(--qp-warn)]'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share this red flag</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Principles Section */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-teal-400" />
          <h3 className="text-base font-bold text-slate-200 font-mono uppercase tracking-wider">
            South African Youth Work Safety Golden Rules
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-slate-200 text-sm">
              <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-mono text-xs">1</span>
              <span>Never Pay Upfront</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              No legitimate company asks job seekers to pay application, medical test, uniform, or admin fees before employment.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-slate-200 text-sm">
              <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-mono text-xs">2</span>
              <span>Protect ID & Bank Details</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Do not send certified ID copies, passport numbers, or bank account numbers until you have attended an in-person interview or verified contract.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-slate-200 text-sm">
              <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-mono text-xs">3</span>
              <span>Verify Corporate Domain</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ensure emails come from official corporate domains (e.g. @company.co.za) rather than generic @gmail.com or @yahoo.com addresses.
            </p>
          </div>
        </div>
      </div>

      {/* Sector-specific scam types (Prompt 3 sections 55-65). Real SA
          recruitment-fraud patterns, described plainly. English for now;
          translations are a follow-up. No invented statistics. */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[var(--qp-warn)]" />
          <h3 className="text-base font-bold text-slate-200 font-mono uppercase tracking-wider">
            Common recruitment scam types in South Africa
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {[
            { t: 'Learnership & internship "fees"', s: 'You are asked to pay to secure a learnership, internship or "training".', d: 'Genuine learnerships never charge you to join. Verify directly with the company or SETA, and never pay.' },
            { t: 'Government job scams', s: 'Posts using a department or DPSA name ask for payment or your documents upfront.', d: 'Real government vacancies are advertised free through official channels. Apply only there; never pay a "processing" fee.' },
            { t: 'Work-from-home / starter kit', s: 'You must buy equipment, software or a "starter pack" before you can begin.', d: 'A real employer provides the tools. Being asked to pay to start is a strong warning sign.' },
            { t: 'Recruit-others / MLM', s: 'You earn mainly by signing up other people, or must buy a package to join.', d: 'Treat "join and recruit" income and joining fees as a warning sign, and verify what you are actually being hired to do.' },
            { t: 'Commission-only with upfront costs', s: 'A "sales" role expects you to buy stock or pay for materials first.', d: 'Be very cautious about paying for stock before you have earned anything.' },
            { t: 'Overseas / visa job scams', s: 'You are told to pay visa, agency, relocation or accommodation fees for a foreign job.', d: 'Never pay these to a recruiter. Confirm the offer through the official employer and the relevant embassy.' },
          ].map((item) => (
            <div key={item.t} className="p-4 bg-slate-900/60 rounded-lg border border-slate-800/80 space-y-1">
              <p className="font-semibold text-slate-200 text-sm">{item.t}</p>
              <p className="text-xs text-slate-400 leading-relaxed"><span className="text-[var(--qp-warn)]">What it looks like:</span> {item.s}</p>
              <p className="text-xs text-slate-400 leading-relaxed"><span className="text-[var(--qp-safe)]">What to do:</span> {item.d}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
