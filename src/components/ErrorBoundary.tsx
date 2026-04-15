import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends (Component as any) {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if ((this.state as any).hasError) {
      let errorMessage = "Something went wrong.";
      try {
        const message = (this.state as any).error?.message;
        if (typeof message === 'string' && message.trim() !== '' && message !== 'undefined' && !message.includes('undefined') && message.startsWith('{')) {
          const parsedError = JSON.parse(message);
          if (parsedError.error && (parsedError.error.includes('permission-denied') || parsedError.error.includes('Missing or insufficient permissions'))) {
            errorMessage = "You don't have permission to access this data. If this is a remixed app, please ensure you have accepted the Firebase terms in the setup UI.";
          }
        }
      } catch (e) {
        // Not a JSON error message or parsing failed
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-zinc-950 text-white">
          <h2 className="text-2xl font-bold mb-4 text-rose-500">Oops!</h2>
          <p className="text-zinc-400 max-w-md mb-6">
            {errorMessage}
          </p>
          <button
            className="px-6 py-2 bg-brand-500 text-zinc-950 font-bold rounded-full hover:bg-brand-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return (this.props as any).children;
  }
}

export default ErrorBoundary;
