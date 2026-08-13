/**
 * Pure heuristics for a decoded QR payload. Extracted from the QR scanner so it
 * can be unit-tested without a browser. No warning here is proof of anything -
 * these are signals to make the user check, never a verdict.
 */
export interface QrAnalysis {
  text: string;
  isUrl: boolean;
  host?: string;
  warnings: string[];
}

export const SHORTENERS = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd',
  'buff.ly', 'rebrand.ly', 'cutt.ly', 'shorturl.at',
];

export function analyseQr(text: string): QrAnalysis {
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
  if (url.protocol !== 'https:') {
    warnings.push('This link is not secure (no https). Be careful entering any details.');
  }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    warnings.push('The link points to a raw IP address rather than a normal website name.');
  }
  if (host.startsWith('xn--') || host.includes('.xn--')) {
    warnings.push('The website name uses special characters that can be used to imitate a real company (a lookalike domain).');
  }
  if (SHORTENERS.includes(host.toLowerCase())) {
    warnings.push('This is a shortened link, so the real destination is hidden until you open it.');
  }
  return { text, isUrl: true, host, warnings };
}
