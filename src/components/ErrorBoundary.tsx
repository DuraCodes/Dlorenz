import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleResetCache = () => {
    try {
      localStorage.removeItem('dlorenz_cms_partners');
      localStorage.removeItem('dlorenz_cms_projects');
      localStorage.removeItem('dlorenz_cms_team');
      localStorage.removeItem('dlorenz_cms_config');
    } catch (e) {
      console.error('Failed to clear cache:', e);
    }
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#111216] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#4EFE32]/20 border border-[#4EFE32] flex items-center justify-center text-[#4EFE32] mb-4">
            !
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-wide font-condensed">Something went wrong</h2>
          <p className="text-sm text-[#A0A6B2] mt-2 max-w-md">
            An unexpected state was encountered. You can reload or reset the application state below.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-full bg-[#4EFE32] text-[#121212] font-bold text-xs uppercase tracking-wider font-condensed hover:bg-[#43e629] transition-all cursor-pointer shadow-lg"
            >
              Reload Application
            </button>
            <button
              onClick={this.handleResetCache}
              className="px-6 py-2.5 rounded-full bg-[#1A1C22] text-[#A0A6B2] hover:text-white border border-[#262933] hover:border-[#4EFE32] font-bold text-xs uppercase tracking-wider font-condensed transition-all cursor-pointer"
            >
              Reset Cache &amp; Restart
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}




