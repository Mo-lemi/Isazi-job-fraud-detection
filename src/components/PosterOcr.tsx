import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { ScanText, Upload, ShieldAlert, RefreshCw } from 'lucide-react';

/**
 * Poster / flyer OCR (Prompt 4 sections 12-19). Reads the text off a photo of a
 * job poster in the browser (Tesseract.js; the OCR engine and language data load
 * from a CDN on first use). The extracted text can then be checked for scam
 * signals through the same model service that powers the scanner. The image is
 * processed on the device and is not uploaded anywhere.
 */

interface ScoreLite {
  tier: 'LOW' | 'MEDIUM' | 'HIGH';
  score: number;
  reasons: string[];
}

export const PosterOcr: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'reading' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('');
  const [scoring, setScoring] = useState(false);
  const [result, setResult] = useState<ScoreLite | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setStatus('reading');
    setProgress(0);
    setText('');
    setResult(null);
    setScanError(null);
    try {
      const { data } = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100));
        },
      });
      setText((data.text || '').trim());
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  const checkText = async () => {
    if (!text.trim()) return;
    setScoring(true);
    setScanError(null);
    try {
      const resp = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (resp.ok) {
        const d = await resp.json();
        setResult({ tier: d.tier, score: d.score, reasons: (d.rule_reasons || []).map((r: { reason: string }) => r.reason).slice(0, 4) });
      } else {
        setScanError('Could not check this text right now.');
      }
    } catch {
      setScanError('Cannot reach the Qhaphela model service.');
    } finally {
      setScoring(false);
    }
  };

  const tierColor = (t: ScoreLite['tier']) =>
    t === 'HIGH' ? 'text-[var(--qp-risk)]' : t === 'MEDIUM' ? 'text-[var(--qp-warn)]' : 'text-[var(--qp-safe)]';
  const tierLabel = (t: ScoreLite['tier']) => (t === 'HIGH' ? 'HIGH RISK' : t === 'MEDIUM' ? 'MEDIUM RISK' : 'LOW RISK');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-2">
        <ScanText className="w-5 h-5 text-[var(--qp-primary)]" aria-hidden="true" />
        <h2 className="text-lg font-bold text-slate-100">Read a job poster</h2>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed mb-4">
        Photograph a printed job poster or flyer and upload it. Qhaphela reads the text on your device,
        then you can check it for scam signals. The first read downloads the reader, so it may take a
        few seconds.
      </p>

      <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[var(--qp-primary)] text-[var(--qp-primary-ink)] text-sm font-medium cursor-pointer transition-all hover:brightness-110 focus-within:ring-2 focus-within:ring-[var(--qp-primary)]">
        <Upload className="w-4 h-4" aria-hidden="true" />
        <span>Upload poster image</span>
        <input type="file" accept="image/*" onChange={onFile} className="sr-only" />
      </label>

      {status === 'reading' && (
        <p className="mt-3 text-sm text-slate-400">Reading text... {progress > 0 ? `${progress}%` : ''}</p>
      )}
      {status === 'error' && (
        <p className="mt-3 text-sm text-[var(--qp-risk)]">Could not read that image. Try a clearer, well-lit photo.</p>
      )}

      {status === 'done' && (
        <div className="mt-4 space-y-3">
          {text ? (
            <>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Text found</p>
                <p className="text-sm text-slate-200 whitespace-pre-wrap bg-slate-950 border border-slate-800 rounded-lg p-3 max-h-48 overflow-y-auto">{text}</p>
              </div>
              <button
                onClick={checkText}
                disabled={scoring}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--qp-primary)] text-[var(--qp-primary-ink)] text-sm font-medium transition-all hover:brightness-110 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--qp-primary)]"
              >
                <RefreshCw aria-hidden="true" className={`w-4 h-4 ${scoring ? 'animate-spin motion-reduce:animate-none' : ''}`} />
                <span>{scoring ? 'Checking...' : 'Check this poster for red flags'}</span>
              </button>
            </>
          ) : (
            <p className="text-sm text-slate-300">No readable text was found in that image. Try a clearer, straight-on photo.</p>
          )}

          {scanError && <p className="text-sm text-[var(--qp-risk)]">{scanError}</p>}

          {result && (
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className={`w-5 h-5 ${tierColor(result.tier)}`} aria-hidden="true" />
                <span className={`font-bold ${tierColor(result.tier)}`}>{tierLabel(result.tier)}</span>
                <span className="text-sm text-slate-400 font-mono">{result.score}/100</span>
              </div>
              {result.reasons.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {result.reasons.map((r, i) => (
                    <li key={i} className="text-sm text-slate-300">• {r}</li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-slate-500 italic mt-2">
                Based on the text read from the poster. A real-looking poster can still be a scam - always verify the employer.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PosterOcr;
