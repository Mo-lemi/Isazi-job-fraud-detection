import React from 'react';

interface State {
  hasError: boolean;
}

/**
 * App-wide error boundary. If any component throws during render, this catches
 * it and shows a calm recovery screen instead of a blank white page. Inline
 * styles are used so the fallback still renders even if the stylesheet or theme
 * tokens are the thing that failed.
 */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Logged for debugging; no user data is sent anywhere.
    console.error('Qhaphela UI error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0f172a',
            color: '#f1f5f9',
            fontFamily: 'system-ui, sans-serif',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '28rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Something went wrong.
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              Qhaphela hit an unexpected error and stopped this screen to keep you safe. Nothing you
              entered was sent anywhere. Please reload to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: '#083E7D',
                color: '#ffffff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reload Qhaphela
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
