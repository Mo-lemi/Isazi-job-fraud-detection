import React, { useState, useEffect, useCallback } from 'react';
import { History, Trash2 } from 'lucide-react';

/**
 * Recent checks (Prompt 3 section 67). A privacy-safe local history: it stores
 * ONLY the time, risk tier and score of each scan - never the posting text,
 * which can contain personal information. Lives in localStorage on this device
 * and can be cleared at any time. Renders nothing when empty.
 */
interface Entry {
  t: number;
  tier: 'LOW' | 'MEDIUM' | 'HIGH';
  score: number;
}

const KEY = 'qhaphela-recent';

function load(): Entry[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function relTime(t: number): string {
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 60) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return new Date(t).toLocaleDateString();
}

const tierText = (tier: Entry['tier']) =>
  tier === 'HIGH' ? 'text-[var(--qp-risk)]' : tier === 'MEDIUM' ? 'text-[var(--qp-warn)]' : 'text-[var(--qp-safe)]';
const tierLabel = (tier: Entry['tier']) =>
  tier === 'HIGH' ? 'HIGH RISK' : tier === 'MEDIUM' ? 'MEDIUM RISK' : 'LOW RISK';

export const RecentChecks: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);

  const refresh = useCallback(() => setEntries(load()), []);

  useEffect(() => {
    refresh();
    window.addEventListener('qhaphela-recent-updated', refresh);
    return () => window.removeEventListener('qhaphela-recent-updated', refresh);
  }, [refresh]);

  const clear = () => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setEntries([]);
  };

  // The most recent entry is the check currently on screen; show the ones before it.
  const past = entries.slice(1);
  if (past.length === 0) return null;

  return (
    <div className="qp-no-print bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[var(--qp-primary)]" aria-hidden="true" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your recent checks</span>
        </div>
        <button
          onClick={clear}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Clear</span>
        </button>
      </div>
      <ul className="flex flex-wrap gap-2">
        {past.map((e, i) => (
          <li
            key={`${e.t}-${i}`}
            className="flex items-center gap-2 text-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5"
          >
            <span className={`font-semibold ${tierText(e.tier)}`}>{tierLabel(e.tier)}</span>
            <span className="text-slate-400 font-mono">{e.score}/100</span>
            <span className="text-slate-500">· {relTime(e.t)}</span>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-slate-500 mt-3">
        Kept only on this device. Only the time, risk level and score are stored - never the job text.
      </p>
    </div>
  );
};

export default RecentChecks;
