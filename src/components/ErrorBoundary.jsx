import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#121416] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
            <span className="text-red-500 text-4xl font-black">!</span>
          </div>
          <h1 className="text-[#0dcaf0] text-2xl font-black uppercase tracking-tighter mb-2">
            Engine Halt Detected
          </h1>
          <p className="text-slate-500 text-sm max-w-md uppercase tracking-widest font-bold">
            Zirocraft Runtime encountered a critical error.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-8 py-3 bg-[#0dcaf0] text-black font-black rounded-xl hover:scale-105 transition-transform"
          >
            REBOOT MODULE
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
