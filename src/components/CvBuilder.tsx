import React, { useState } from 'react';
import { FileText, Plus, Trash2, Copy, CheckCircle2, Printer, Info } from 'lucide-react';

/**
 * CV builder (Prompt 2 section 32). A guided form that produces a plain,
 * ATS-friendly CV the user can copy or print. Everything stays in the browser;
 * nothing is uploaded or stored. Deliberately has NO fields for ID numbers,
 * banking details or passwords, and it reminds the user to list only real
 * qualifications and experience.
 */

interface EduItem { qualification: string; institution: string; year: string; }
interface ExpItem { role: string; company: string; period: string; details: string; }

const emptyEdu: EduItem = { qualification: '', institution: '', year: '' };
const emptyExp: ExpItem = { role: '', company: '', period: '', details: '' };

export const CvBuilder: React.FC = () => {
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState<EduItem[]>([{ ...emptyEdu }]);
  const [experience, setExperience] = useState<ExpItem[]>([{ ...emptyExp }]);
  const [copied, setCopied] = useState(false);

  const skillList = skills.split(',').map((s) => s.trim()).filter(Boolean);

  const buildText = (): string => {
    const lines: string[] = [];
    if (name) lines.push(name.toUpperCase());
    if (headline) lines.push(headline);
    const contact = [email, phone, location].filter(Boolean).join('  |  ');
    if (contact) lines.push(contact);
    if (summary) { lines.push('', 'PROFILE', summary); }
    const eduReal = education.filter((e) => e.qualification || e.institution);
    if (eduReal.length) {
      lines.push('', 'EDUCATION');
      eduReal.forEach((e) => lines.push([e.qualification, e.institution, e.year].filter(Boolean).join(', ')));
    }
    const expReal = experience.filter((x) => x.role || x.company);
    if (expReal.length) {
      lines.push('', 'EXPERIENCE');
      expReal.forEach((x) => {
        lines.push([x.role, x.company, x.period].filter(Boolean).join(', '));
        if (x.details) lines.push(x.details);
      });
    }
    if (skillList.length) { lines.push('', 'SKILLS', skillList.join(', ')); }
    return lines.join('\n');
  };

  const copyCv = async () => {
    try {
      await navigator.clipboard.writeText(buildText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard blocked; the preview text is selectable */
    }
  };

  const setEdu = (i: number, patch: Partial<EduItem>) =>
    setEducation((prev) => prev.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  const setExp = (i: number, patch: Partial<ExpItem>) =>
    setExperience((prev) => prev.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  const field = 'w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-[var(--qp-primary)] outline-none';
  const labelCls = 'block text-xs font-semibold text-slate-400 mb-1';

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="qp-no-print bg-[var(--qp-warn-soft)] border border-[var(--qp-warn)] rounded-xl p-4 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[var(--qp-warn)] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-[var(--qp-warn)]">
          List only real qualifications and experience. Never put your ID number, banking details or
          passwords on a CV - a genuine employer never needs those to consider you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form (hidden when printing) */}
        <div className="qp-no-print space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-5 h-5 text-[var(--qp-primary)]" aria-hidden="true" />
              <h2 className="text-base font-bold text-slate-100">Build your CV</h2>
            </div>
            <div><label className={labelCls}>Full name</label><input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Thandi Mokoena" /></div>
            <div><label className={labelCls}>Job title / headline</label><input className={field} value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Receptionist &amp; Administrator" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div><label className={labelCls}>Email</label><input className={field} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" /></div>
              <div><label className={labelCls}>Phone</label><input className={field} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0__ ___ ____" /></div>
              <div><label className={labelCls}>City</label><input className={field} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Gqeberha" /></div>
            </div>
            <div><label className={labelCls}>Short profile</label><textarea className={`${field} min-h-[72px]`} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Two or three sentences about who you are and what you do well." /></div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Education</h3>
              <button onClick={() => setEducation((p) => [...p, { ...emptyEdu }])} className="flex items-center gap-1 text-xs text-[var(--qp-primary)] hover:brightness-110"><Plus className="w-3.5 h-3.5" />Add</button>
            </div>
            {education.map((e, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start">
                <input className={field} value={e.qualification} onChange={(ev) => setEdu(i, { qualification: ev.target.value })} placeholder="Qualification" />
                <input className={field} value={e.institution} onChange={(ev) => setEdu(i, { institution: ev.target.value })} placeholder="Institution" />
                <div className="flex gap-2">
                  <input className={field} value={e.year} onChange={(ev) => setEdu(i, { year: ev.target.value })} placeholder="Year" />
                  {education.length > 1 && <button onClick={() => setEducation((p) => p.filter((_, idx) => idx !== i))} aria-label="Remove" className="text-slate-500 hover:text-[var(--qp-risk)]"><Trash2 className="w-4 h-4" /></button>}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Experience</h3>
              <button onClick={() => setExperience((p) => [...p, { ...emptyExp }])} className="flex items-center gap-1 text-xs text-[var(--qp-primary)] hover:brightness-110"><Plus className="w-3.5 h-3.5" />Add</button>
            </div>
            {experience.map((x, i) => (
              <div key={i} className="space-y-2 border-b border-slate-800/70 pb-3 last:border-0">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input className={field} value={x.role} onChange={(ev) => setExp(i, { role: ev.target.value })} placeholder="Role" />
                  <input className={field} value={x.company} onChange={(ev) => setExp(i, { company: ev.target.value })} placeholder="Company" />
                  <div className="flex gap-2">
                    <input className={field} value={x.period} onChange={(ev) => setExp(i, { period: ev.target.value })} placeholder="2022 - 2024" />
                    {experience.length > 1 && <button onClick={() => setExperience((p) => p.filter((_, idx) => idx !== i))} aria-label="Remove" className="text-slate-500 hover:text-[var(--qp-risk)]"><Trash2 className="w-4 h-4" /></button>}
                  </div>
                </div>
                <textarea className={`${field} min-h-[56px]`} value={x.details} onChange={(ev) => setExp(i, { details: ev.target.value })} placeholder="What you did and achieved." />
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <label className={labelCls}>Skills (separate with commas)</label>
            <input className={field} value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Customer service, MS Office, Filing" />
          </div>
        </div>

        {/* Live preview (this is what prints) */}
        <div className="space-y-3">
          <div className="qp-no-print flex flex-wrap gap-2">
            <button onClick={copyCv} className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--qp-primary)]">
              {copied ? <><CheckCircle2 className="w-4 h-4 text-[var(--qp-safe)]" /><span>Copied</span></> : <><Copy className="w-4 h-4" /><span>Copy CV text</span></>}
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[var(--qp-primary)] text-[var(--qp-primary-ink)] text-xs font-medium transition-all hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--qp-primary)]">
              <Printer className="w-4 h-4" /><span>Print / save as PDF</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100">
            <h1 className="text-xl font-bold">{name || 'Your name'}</h1>
            {headline && <p className="text-sm text-[var(--qp-primary)] font-medium">{headline}</p>}
            {(email || phone || location) && (
              <p className="text-xs text-slate-400 mt-1">{[email, phone, location].filter(Boolean).join('  •  ')}</p>
            )}
            {summary && <><h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-4 mb-1">Profile</h2><p className="text-sm text-slate-200 leading-relaxed">{summary}</p></>}
            {education.some((e) => e.qualification || e.institution) && (
              <><h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-4 mb-1">Education</h2>
                {education.filter((e) => e.qualification || e.institution).map((e, i) => (
                  <p key={i} className="text-sm text-slate-200">{[e.qualification, e.institution, e.year].filter(Boolean).join(', ')}</p>
                ))}</>
            )}
            {experience.some((x) => x.role || x.company) && (
              <><h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-4 mb-1">Experience</h2>
                {experience.filter((x) => x.role || x.company).map((x, i) => (
                  <div key={i} className="mb-2">
                    <p className="text-sm font-semibold text-slate-100">{[x.role, x.company, x.period].filter(Boolean).join(', ')}</p>
                    {x.details && <p className="text-sm text-slate-300">{x.details}</p>}
                  </div>
                ))}</>
            )}
            {skillList.length > 0 && (
              <><h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-4 mb-1">Skills</h2>
                <p className="text-sm text-slate-200">{skillList.join(', ')}</p></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CvBuilder;
