import React, { useState, useEffect } from 'react';
import { Globe, Settings, Sun, Moon, XCircle, Type } from 'lucide-react';

interface HeaderProps {
  activeTab: 'scanner' | 'academy' | 'simulator' | 'api' | 'install' | 'recovery' | 'verify' | 'qr';
  setActiveTab: (tab: 'scanner' | 'academy' | 'simulator' | 'api' | 'install' | 'recovery' | 'verify' | 'qr') => void;
  apiStatus: 'online' | 'offline' | 'checking';
}

// Theme choices persist here. 'system' means no explicit choice: the palette
// then follows the OS via prefers-color-scheme (handled entirely in index.css),
// and updates live when the OS theme changes.
type ThemeChoice = 'light' | 'dark' | 'system';
const THEME_KEY = 'qhaphela-theme';

function osPrefersDark(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Apply a choice by setting the body class the CSS keys off. 'system' removes
// both classes so the prefers-color-scheme media query takes over.
function applyThemeChoice(choice: ThemeChoice) {
  const body = document.body;
  body.classList.remove('light', 'dark');
  if (choice === 'light') body.classList.add('light');
  else if (choice === 'dark') body.classList.add('dark');
}

function storedChoice(): ThemeChoice {
  const v = typeof localStorage !== 'undefined' ? localStorage.getItem(THEME_KEY) : null;
  return v === 'light' || v === 'dark' ? v : 'system';
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [showSettings, setShowSettings] = useState(false);

  // The effective theme (what the user actually sees) drives the icon. It is
  // the explicit choice, or the OS preference when the choice is 'system'.
  const [isDark, setIsDark] = useState(true);
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    const choice = storedChoice();
    applyThemeChoice(choice);
    setIsDark(choice === 'system' ? osPrefersDark() : choice === 'dark');

    // When following the OS, keep the icon in sync as the OS theme flips.
    // (The colours already follow it via CSS; this only tracks the glyph.)
    if (choice === 'system' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = () => setIsDark(mq.matches);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    }
  }, []);

  // Larger text for low-vision users and small phones. Scales the root font
  // size, which every rem-based size in the app follows.
  useEffect(() => {
    const large = typeof localStorage !== 'undefined' && localStorage.getItem('qhaphela-textsize') === 'large';
    setLargeText(large);
    document.documentElement.classList.toggle('qp-large-text', large);
  }, []);

  const toggleTextSize = () => {
    const next = !largeText;
    setLargeText(next);
    document.documentElement.classList.toggle('qp-large-text', next);
    localStorage.setItem('qhaphela-textsize', next ? 'large' : 'normal');
  };

  const toggleTheme = () => {
    // Flip to the opposite of what is currently shown, and make it an explicit
    // sticky choice so it survives reloads and beats the OS preference.
    const next: ThemeChoice = isDark ? 'light' : 'dark';
    applyThemeChoice(next);
    localStorage.setItem(THEME_KEY, next);
    setIsDark(next === 'dark');
  };

  const closeApp = () => {
    if (window.confirm('Are you sure you want to close the app?')) {
      // Browsers often block scripts from closing tabs the script did not open,
      // so attempt window.close() first, then fall back to a closed screen.
      window.close();
      document.body.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:center; height:100vh; background-color:#0B1120; color:white; font-family:sans-serif;">
          <div style="text-align:center;">
            <h2 style="font-size:24px; font-weight:bold; margin-bottom:8px;">Qhaphela is closed.</h2>
            <p style="color:#94a3b8;">You can safely close this browser tab.</p>
          </div>
        </div>
      `;
    }
    setShowSettings(false);
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      {/* Top Row: Brand & Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Official Shield Logo */}
          <img src="/icons/logo-mark.png" alt="Qhaphela" className="w-8 h-8 object-contain" />
          <span className="font-bold tracking-widest text-lg text-slate-100 uppercase">
            QHAPHELA: KNOW BEFORE YOU APPLY!
          </span>
        </div>

        <div className="flex items-center gap-3 relative">
           <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded px-3 py-1 cursor-pointer hover:bg-slate-800/80 transition-colors">
              <span className="text-xs text-slate-300">English</span>
              <Globe className="w-3.5 h-3.5 text-slate-400" />
           </div>

           {/* Theme toggle: always visible in the header, no longer buried in
               settings. Icon shows the mode you switch TO. */}
           <button
             onClick={toggleTheme}
             className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
             aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
             title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
           >
             {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
           </button>

           {/* Settings Toggle Button */}
           <button
             onClick={() => setShowSettings(!showSettings)}
             className={`p-1.5 rounded-md transition-colors ${showSettings ? 'bg-slate-800 text-slate-200' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
             aria-label="Settings"
           >
             <Settings className="w-4 h-4" />
           </button>

           {/* Settings Dropdown Menu */}
           {showSettings && (
             <div className="absolute right-0 top-10 mt-2 w-52 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
               <button
                 onClick={toggleTextSize}
                 className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
               >
                 <Type className="w-4 h-4" />
                 <span>Text size: {largeText ? 'Large' : 'Normal'}</span>
               </button>
               <button
                 onClick={closeApp}
                 className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors border-t border-slate-800 mt-1"
               >
                 <XCircle className="w-4 h-4" />
                 <span>Close App</span>
               </button>
             </div>
           )}
        </div>
      </div>

      {/* Bottom Row: Flat Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'scanner', label: 'Overview' },
            { id: 'academy', label: 'Red Flags' },
            { id: 'verify', label: 'Verify a Recruiter' },
            { id: 'qr', label: 'Scan a QR' },
            { id: 'install', label: 'How to Install' },
            { id: 'recovery', label: 'Been scammed?' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              aria-current={activeTab === tab.id ? 'page' : undefined}
              className={`whitespace-nowrap pb-3 pt-1 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
