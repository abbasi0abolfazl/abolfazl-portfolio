import React from 'react';

// Prevents a render error in any single section from blanking the entire site.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Caught by ErrorBoundary:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-center px-4">
            <h1 className="text-xl font-semibold text-foreground">Something went wrong.</h1>
            <p className="text-sm text-muted-foreground">Please refresh the page to try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              Reload
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
