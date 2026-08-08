import React from 'react';
import { Download, Globe, FolderOpen, ToggleRight } from 'lucide-react';

export const InstallGuide: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <Download className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-slate-100 uppercase tracking-wider font-mono">
            How to Install the Qhaphela Extension
          </h2>
        </div>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Qhaphela runs directly in your browser to scan job boards for red flags. It is compatible with <strong>Google Chrome, Microsoft Edge, Brave,</strong> and other Chromium-based browsers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
              <FolderOpen className="w-4 h-4 text-emerald-400" />
              <span>Step 1: Get the Files</span>
            </div>
            <p className="text-xs text-slate-400">
              Download the Qhaphela source code and extract the <strong>.zip</strong> file to a folder on your computer. Keep track of where you saved it.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-5 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Step 2: Open Extensions</span>
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              Open your browser and type the following into your address bar, then press Enter:
              <ul className="mt-1 space-y-1 ml-2">
                <li>• <strong>Chrome/Brave:</strong> <code className="bg-slate-800 px-1 py-0.5 rounded text-blue-300">chrome://extensions/</code></li>
                <li>• <strong>Microsoft Edge:</strong> <code className="bg-slate-800 px-1 py-0.5 rounded text-blue-300">edge://extensions/</code></li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-5 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
              <ToggleRight className="w-4 h-4 text-emerald-400" />
              <span>Step 3: Developer Mode</span>
            </div>
            <p className="text-xs text-slate-400">
              Find the toggle switch for <strong>Developer mode</strong> and turn it on. In Chrome and Brave, this is in the top-right corner. In Edge, it is in the bottom-left sidebar.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-5 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Step 4: Load Unpacked</span>
            </div>
            <p className="text-xs text-slate-400">
              Click the <strong>Load unpacked</strong> button that appears. Select the <code>extension</code> folder from the files you extracted in Step 1.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};