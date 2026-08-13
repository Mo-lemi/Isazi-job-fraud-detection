import React, { useState } from 'react';
import jsQR from 'jsqr';
import { QrCode, Upload, Copy, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

/**
 * QR code scanner (Prompt 4). Decodes a QR from an uploaded image entirely in
 * the browser (jsQR on a canvas) - the image never leaves the device. It shows
 * the real destination and honest heuristic warnings, and never auto-opens an
 * unknown link. Absence of a warning is not a claim that the destination is
 * safe: a QR can point to a real company site and still be part of a scam.
 */

interface Decoded {
  text: string;
  isUrl: boolean;
  host?: string;
  warnings: string[];
}

const SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 'rebrand.ly', 'cutt.ly', 'shorturl.at'];

function analyse(text: string): Decoded {
  const warnings: string[] = [];
  let url: URL | null = null;
  try {
    url = new URL(text);
  } catch {
    /* not a URL */
  }
  if (!url || !/^https?:$/.test(url.protocol)) {
    return { text, isUrl: false, warnings };
  }
  const host = url.hostname;
  if (url.protocol !== 'https:') warnings.push('This link is not secure (no https). Be careful entering any details.');
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) warnings.push('The link points to a raw IP address rather than a normal website name.');
  if (host.startsWith('xn--') || host.includes('.xn--')) warnings.push('The website name uses special characters that can be used to imitate a real company (a lookalike domain).');
  if (SHORTENERS.includes(host.toLowerCase())) warnings.push('This is a shortened link, so the real destination is hidden until you open it.');
  return { text, isUrl: true, host, warnings };
}

export const QrScan: React.FC = () => {
  const [decoded, setDecoded] = useState<Decoded | null>(null);
  const [status, setStatus] = useState<'idle' | 'reading' | 'nofound' | 'done' | 'error'>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setFileName(file.name);
    setStatus('reading');
    setDecoded(null);
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) { setStatus('error'); return; }
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(data.data, data.width, data.height);
        URL.revokeObjectURL(img.src);
        if (!code || !code.data) { setStatus('nofound'); return; }
        setDecoded(analyse(code.data));
        setStatus('done');
      } catch {
        setStatus('error');
      }
    };
    img.onerror = () => setStatus('error');
    img.src = URL.createObjectURL(file);
  };

  const copyLink = async () => {
    if (!decoded) return;
    try {
      await navigator.clipboard.writeText(decoded.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard blocked; the text is shown for manual copy */
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <QrCode className="w-5 h-5 text-[var(--qp-primary)]" aria-hidden="true" />
          <h2 className="text-lg font-bold text-slate-100">Scan a recruitment QR code</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          Saw a QR code on a job poster, flyer or WhatsApp image? Don&apos;t open it straight away.
          Upload the image and Qhaphela will show you exactly where it leads first. The image is read
          on your own device and is not uploaded anywhere.
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <label className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[var(--qp-primary)] text-[var(--qp-primary-ink)] text-sm font-medium cursor-pointer transition-all hover:brightness-110 focus-within:ring-2 focus-within:ring-[var(--qp-primary)]">
            <Upload className="w-4 h-4" aria-hidden="true" />
            <span>Upload QR image</span>
            <input type="file" accept="image/*" onChange={onFile} className="sr-only" />
          </label>
          {fileName && <span className="text-xs text-slate-400">{fileName}</span>}
        </div>
      </div>

      {status === 'reading' && (
        <p className="text-sm text-slate-400">Reading image...</p>
      )}
      {status === 'nofound' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-sm text-slate-300">
          No QR code was found in this image. Try a clearer or more zoomed-in photo of just the QR code.
        </div>
      )}
      {status === 'error' && (
        <div className="bg-[var(--qp-risk-soft)] border border-[var(--qp-risk)] rounded-xl p-5 text-sm text-[var(--qp-risk)]">
          That file could not be read as an image. Try a PNG or JPG photo of the QR code.
        </div>
      )}

      {status === 'done' && decoded && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Where this QR code leads</h3>
            {decoded.isUrl ? (
              <>
                <p className="text-xs text-slate-400">Website</p>
                <p className="text-lg font-semibold text-slate-100">{decoded.host}</p>
                <p className="text-xs text-slate-400 break-all mt-1">{decoded.text}</p>
              </>
            ) : (
              <>
                <p className="text-xs text-slate-400">This QR code is not a web link. It contains this text:</p>
                <p className="text-sm text-slate-100 break-all mt-1 bg-slate-950 border border-slate-800 rounded-lg p-3">{decoded.text}</p>
              </>
            )}
          </div>

          {decoded.warnings.length > 0 ? (
            <div className="bg-[var(--qp-warn-soft)] border border-[var(--qp-warn)] rounded-lg p-4 space-y-2">
              {decoded.warnings.map((w, i) => (
                <p key={i} className="flex items-start gap-2 text-sm text-[var(--qp-warn)]">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{w}</span>
                </p>
              ))}
            </div>
          ) : decoded.isUrl ? (
            <p className="text-sm text-slate-300">No obvious link warnings - but this does not prove the destination is safe.</p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--qp-primary)]"
            >
              {copied
                ? <><CheckCircle2 className="w-4 h-4 text-[var(--qp-safe)]" aria-hidden="true" /><span>Copied</span></>
                : <><Copy className="w-4 h-4" aria-hidden="true" /><span>Copy link</span></>}
            </button>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-slate-500 italic pt-2 border-t border-slate-800">
            <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              Before opening this link, check that the website really belongs to the employer named on
              the poster. A QR code appearing on a real-looking poster can still be a scam.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrScan;
