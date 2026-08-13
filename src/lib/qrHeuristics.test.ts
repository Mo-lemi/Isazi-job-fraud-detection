import { describe, it, expect } from 'vitest';
import { analyseQr } from './qrHeuristics';

describe('analyseQr', () => {
  it('flags a URL shortener as hiding the destination', () => {
    const r = analyseQr('https://bit.ly/fake-job');
    expect(r.isUrl).toBe(true);
    expect(r.host).toBe('bit.ly');
    expect(r.warnings.some((w) => w.includes('shortened link'))).toBe(true);
  });

  it('flags a non-https link', () => {
    const r = analyseQr('http://example.co.za/apply');
    expect(r.warnings.some((w) => w.includes('not secure'))).toBe(true);
  });

  it('flags a raw IP-address host', () => {
    const r = analyseQr('http://192.168.1.10/login');
    expect(r.warnings.some((w) => w.includes('raw IP address'))).toBe(true);
  });

  it('flags a punycode lookalike domain', () => {
    const r = analyseQr('https://xn--pple-43d.com');
    expect(r.warnings.some((w) => w.includes('lookalike'))).toBe(true);
  });

  it('returns no warnings for a normal https company URL', () => {
    const r = analyseQr('https://careers.standardbank.co.za/vacancy/123');
    expect(r.isUrl).toBe(true);
    expect(r.warnings).toHaveLength(0);
  });

  it('treats plain text (not a link) as not a URL', () => {
    const r = analyseQr('Call 0821234567 to apply for this job');
    expect(r.isUrl).toBe(false);
    expect(r.host).toBeUndefined();
  });
});
