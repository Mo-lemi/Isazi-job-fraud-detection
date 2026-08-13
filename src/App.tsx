import React, { useState, useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { Header } from './components/Header';
import { FraudScanner } from './components/FraudScanner';
import { RedFlagAcademy } from './components/RedFlagAcademy';
import { ExtensionSimulator } from './components/ExtensionSimulator';
import { InstallGuide } from './components/InstallGuide';
import { ApiDocs } from './components/ApiDocs';
import { ScamRecovery } from './components/ScamRecovery';
import { GoldenRules } from './components/GoldenRules';
import { SafeReplies } from './components/SafeReplies';
import { QrScan } from './components/QrScan';
import { PosterOcr } from './components/PosterOcr';
import { RecentChecks } from './components/RecentChecks';
import { CvBuilder } from './components/CvBuilder';
import { AwarenessPoster } from './components/AwarenessPoster';

// Every view needs a level-one heading. Screen reader users navigate by
// heading structure, and this page had none at all, so there was no way to
// tell which view was open or to jump to its content. Visually hidden,
// because the design already communicates this sighted-only.
const VIEW_TITLES: Record<string, string> = {
  scanner: 'Job posting fraud scanner',
  academy: 'Red flag academy',
  simulator: 'Chrome extension preview',
  api: 'API documentation',
  recovery: 'Scam recovery help',
  verify: 'Verify a recruiter safely',
  qr: 'Scan a QR code',
  cv: 'Build a CV',
  poster: 'Awareness poster',
};

export function App() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'academy' | 'simulator' | 'api' | 'install' | 'recovery' | 'verify' | 'qr' | 'cv' | 'poster'>('scanner');
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  useEffect(() => {
    fetch('/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          setApiStatus('online');
        } else {
          setApiStatus('offline');
        }
      })
      .catch(() => setApiStatus('offline'));
  }, []);

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between">
      
      {/* Lets a keyboard user reach the content without tabbing the whole
          navigation first. Hidden until focused. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-slate-100 focus:text-slate-900 focus:font-medium"
      >
        Skip to main content
      </a>

      <div>
        <Header activeTab={activeTab} setActiveTab={setActiveTab} apiStatus={apiStatus} />

        <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="sr-only">{VIEW_TITLES[activeTab]}</h1>
          {activeTab === 'scanner' && <><RecentChecks /><FraudScanner /><GoldenRules /></>}
          {activeTab === 'academy' && <RedFlagAcademy />}
          {activeTab === 'simulator' && <ExtensionSimulator />}
          {activeTab === 'api' && <ApiDocs />}
          {activeTab === 'install' && <InstallGuide />}
          {activeTab === 'verify' && <SafeReplies />}
          {activeTab === 'qr' && <div className="space-y-6"><QrScan /><PosterOcr /></div>}
          {activeTab === 'cv' && <CvBuilder />}
          {activeTab === 'poster' && <AwarenessPoster />}
          {activeTab === 'recovery' && <ScamRecovery />}
        </main>
      </div>

      <footer className="border-t border-slate-800 bg-slate-950/60 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>QHAPHELA - Job Posting Fraud Reader & Red Flag Academy</span>
          <span className="text-slate-600">South African Deception Pattern Detection • XAI SHAP Scoring Engine</span>
        </div>
      </footer>

    </div>
    </MotionConfig>
  );
}

export default App;
