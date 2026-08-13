import React, { useState } from 'react';
import { Target, RefreshCw, CheckCircle2, PlusCircle, Upload } from 'lucide-react';

interface MatchResult {
  match_percent: number;
  matched: string[];
  missing: string[];
  note?: string;
}

interface CvMatchProps {
  /** The posting the CV is compared against (the text that was just scored). */
  jobText: string;
}

/**
 * CV match against the scanned posting (Prompt 3 section 31 / roadmap B).
 *
 * Calls the same model service that powers scoring (/api/match). The percentage
 * and the matched/missing terms come straight from that comparison - never
 * invented. If the posting states no requirements, the service says so and we
 * show that honestly instead of a fake number. The CV text is sent once for the
 * comparison and not stored.
 */
export const CvMatch: React.FC<CvMatchProps> = ({ jobText }) => {
  const [cvText, setCvText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Match from pasted text.
  const check = async () => {
    if (!cvText.trim() || !jobText.trim()) return;
    setLoading(true);
    setError(null);
    setFileName(null);
    try {
      const resp = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cv_text: cvText, job_text: jobText }),
      });
      if (resp.ok) {
        setResult(await resp.json());
      } else {
        const data = await resp.json().catch(() => ({}));
        setError(data.error || `Match service returned ${resp.status}`);
      }
    } catch {
      setError('Cannot reach the Qhaphela model service.');
    } finally {
      setLoading(false);
    }
  };

  // Match from an uploaded file (PDF, Word, or text). The file is sent to the
  // model service, which extracts the text; it is not stored.
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;
    if (!jobText.trim()) {
      setError('Scan a job posting first, then upload your CV.');
      return;
    }
    setLoading(true);
    setError(null);
    setFileName(file.name);
    try {
      const fd = new FormData();
      fd.append('cv_file', file);
      fd.append('job_text', jobText);
      const resp = await fetch('/api/match-file', { method: 'POST', body: fd });
      if (resp.ok) {
        setResult(await resp.json());
      } else {
        const data = await resp.json().catch(() => ({}));
        setError(data.error || `Could not read that file (${resp.status}). Try a PDF, Word or text file.`);
      }
    } catch {
      setError('Cannot reach the Qhaphela model service.');
    } finally {
      setLoading(false);
    }
  };

  const tierColor =
    result == null
      ? ''
      : result.match_percent >= 70
      ? 'text-[var(--qp-safe)]'
      : result.match_percent >= 40
      ? 'text-[var(--qp-warn)]'
      : 'text-[var(--qp-risk)]';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-5 h-5 text-[var(--qp-primary)]" aria-hidden="true" />
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">How well does your CV match this job?</h3>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        Paste your CV to see how it lines up with this posting&apos;s stated requirements. Your CV is
        compared once and not stored.
      </p>

      {/* Upload a CV file in any common format (PDF, Word, text). */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <label className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[var(--qp-primary)] text-[var(--qp-primary-ink)] text-sm font-medium cursor-pointer transition-all hover:brightness-110 focus-within:ring-2 focus-within:ring-[var(--qp-primary)]">
          <Upload className="w-4 h-4" aria-hidden="true" />
          <span>Upload CV file</span>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown"
            onChange={onFileChange}
            className="sr-only"
          />
        </label>
        <span className="text-xs text-slate-500">PDF, Word or text - or paste below</span>
      </div>
      {fileName && (
        <p className="text-xs text-slate-400 mb-2">
          Uploaded: <span className="text-slate-200">{fileName}</span>
        </p>
      )}

      <textarea
        value={cvText}
        onChange={(e) => setCvText(e.target.value)}
        placeholder="...or paste your CV text here"
        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-[var(--qp-primary)] outline-none font-sans leading-relaxed min-h-[96px]"
      />

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-slate-500">
          {jobText.trim() ? '' : 'Scan a job posting first.'}
        </span>
        <button
          onClick={check}
          disabled={loading || !cvText.trim() || !jobText.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--qp-primary)] text-[var(--qp-primary-ink)] text-sm font-medium transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--qp-primary)]"
        >
          <RefreshCw aria-hidden="true" className={`w-4 h-4 ${loading ? 'animate-spin motion-reduce:animate-none' : ''}`} />
          <span>{loading ? 'Checking...' : 'Check CV match'}</span>
        </button>
      </div>

      {error && (
        <p className="mt-3 text-xs text-[var(--qp-risk)]">{error}</p>
      )}

      {result && !error && (
        <div className="mt-5 pt-4 border-t border-slate-800 space-y-4">
          {result.matched.length === 0 && result.missing.length === 0 ? (
            // The posting stated no specific requirements to match against.
            <p className="text-sm text-slate-300">
              {result.note || 'This posting does not state specific requirements, so a CV match cannot be calculated.'}
            </p>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold font-mono ${tierColor}`}>{result.match_percent}%</span>
                <span className="text-sm text-slate-400">match with this posting&apos;s requirements</span>
              </div>

              {result.matched.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--qp-safe)]" aria-hidden="true" /> Requirements you match
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.matched.map((m) => (
                      <span key={m} className="text-xs px-2 py-0.5 rounded bg-[var(--qp-safe-soft)] text-[var(--qp-safe)] border border-[var(--qp-safe)]">{m}</span>
                    ))}
                  </div>
                </div>
              )}

              {result.missing.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <PlusCircle className="w-3.5 h-3.5 text-[var(--qp-warn)]" aria-hidden="true" /> Mentioned in the posting - add these only if you genuinely have them
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missing.map((m) => (
                      <span key={m} className="text-xs px-2 py-0.5 rounded bg-[var(--qp-warn-soft)] text-[var(--qp-warn)] border border-[var(--qp-warn)]">{m}</span>
                    ))}
                  </div>
                </div>
              )}

              {result.note && <p className="text-xs text-slate-500">{result.note}</p>}
              <p className="text-xs text-slate-500 italic">
                Never add skills or qualifications you do not actually have.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CvMatch;
