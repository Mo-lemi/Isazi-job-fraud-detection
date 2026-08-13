import React from 'react';
import { Download, Globe, FolderOpen, ToggleRight, Info, HelpCircle, Monitor } from 'lucide-react';

const STEPS = [
  {
    icon: FolderOpen,
    title: 'Step 1: Get the files',
    body: (
      <>
        Download the Qhaphela source code and extract the <strong>.zip</strong> file to a folder on
        your computer. Remember where you saved it.
      </>
    ),
  },
  {
    icon: Globe,
    title: 'Step 2: Open extensions',
    body: (
      <>
        Type this into your browser&apos;s address bar and press Enter:
        <ul className="mt-1 space-y-1 ml-2">
          <li>• <strong>Chrome / Brave:</strong> <code className="bg-slate-800 px-1 py-0.5 rounded text-[var(--qp-primary)]">chrome://extensions/</code></li>
          <li>• <strong>Microsoft Edge:</strong> <code className="bg-slate-800 px-1 py-0.5 rounded text-[var(--qp-primary)]">edge://extensions/</code></li>
        </ul>
      </>
    ),
  },
  {
    icon: ToggleRight,
    title: 'Step 3: Developer mode',
    body: (
      <>
        Turn on <strong>Developer mode</strong>. In Chrome and Brave it is in the top-right corner;
        in Edge it is in the bottom-left sidebar.
      </>
    ),
  },
  {
    icon: Download,
    title: 'Step 4: Load unpacked',
    body: (
      <>
        Click <strong>Load unpacked</strong> and select the <code className="bg-slate-800 px-1 py-0.5 rounded text-[var(--qp-primary)]">extension</code> folder
        from the files you extracted in Step 1.
      </>
    ),
  },
];

const TROUBLESHOOTING = [
  {
    q: 'The panel does not appear on a job page.',
    a: 'It only shows on real job postings. Refresh the page, and make sure the page is an actual vacancy (not a search results list). On ordinary pages Qhaphela stays hidden on purpose.',
  },
  {
    q: 'The panel shows but there is no score.',
    a: 'Scoring runs through the Qhaphela model service on your computer. If it is not running, the panel says so. See the technical setup (README) to start it, then refresh the job page.',
  },
  {
    q: 'I updated the code but nothing changed.',
    a: 'Go back to the extensions page and click the reload icon on the Qhaphela card. The browser caches the extension until you reload it.',
  },
  {
    q: 'I do not want to install anything.',
    a: 'Use the web app instead - open the Overview tab and paste a job posting or message. No installation needed.',
  },
];

export const InstallGuide: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <Download className="w-6 h-6 text-[var(--qp-primary)]" aria-hidden="true" />
          <h2 className="text-xl font-bold text-slate-100 uppercase tracking-wider font-mono">
            How to install the Qhaphela extension
          </h2>
        </div>
        <p className="text-sm text-slate-300 mb-4 leading-relaxed">
          Qhaphela runs in your browser and checks job pages for red flags. It works on{' '}
          <strong>Google Chrome, Microsoft Edge, Brave</strong> and other Chromium-based browsers.
        </p>

        <div className="flex items-start gap-2.5 text-sm text-slate-300 bg-slate-950 border border-slate-800 rounded-lg p-3 mb-2">
          <Monitor className="w-4 h-4 text-[var(--qp-safe)] shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            The steps below are the <strong>same on Windows, macOS, Linux and ChromeOS</strong> - the
            browser handles the install, not the operating system.
          </span>
        </div>

        <div className="flex items-start gap-2.5 text-xs text-slate-400 bg-slate-950 border border-slate-800 rounded-lg p-3">
          <Info className="w-4 h-4 text-[var(--qp-warn)] shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            <strong>Before you start:</strong> this build scores jobs through the Qhaphela model
            service running on your own computer (see the technical setup in the project README).
            Prefer not to set that up? The <strong>web app</strong> gives you the same check with
            nothing to install.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-slate-100 font-semibold mb-1">
                <Icon className="w-4 h-4 text-[var(--qp-safe)]" aria-hidden="true" />
                <span>{step.title}</span>
              </div>
              <div className="text-xs text-slate-400 leading-relaxed">{step.body}</div>
            </div>
          );
        })}
      </div>

      {/* Troubleshooting */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-4 h-4 text-[var(--qp-warn)]" aria-hidden="true" />
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Troubleshooting</h3>
        </div>
        <ul className="space-y-4">
          {TROUBLESHOOTING.map((item) => (
            <li key={item.q}>
              <p className="text-sm font-semibold text-slate-100">{item.q}</p>
              <p className="text-sm text-slate-300 leading-relaxed">{item.a}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
