import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

type FallbackRenderProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

type SimpleErrorBoundaryProps = {
  children: ReactNode;
  fallbackRender: (props: FallbackRenderProps) => ReactNode;
  onReset?: () => void;
  resetKeys?: unknown[];
};

type SimpleErrorBoundaryState = {
  error: Error | null;
};

class SimpleErrorBoundary extends Component<SimpleErrorBoundaryProps, SimpleErrorBoundaryState> {
  state: SimpleErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): SimpleErrorBoundaryState {
    return { error };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Keep this hook for diagnostics integration later if needed.
    console.error("Error caught by SimpleErrorBoundary:", _error, _errorInfo);
  }

  componentDidUpdate(prevProps: SimpleErrorBoundaryProps) {
    const { resetKeys } = this.props;

    if (!resetKeys || !prevProps.resetKeys) {
      return;
    }

    const didResetKeysChange =
      resetKeys.length !== prevProps.resetKeys.length ||
      resetKeys.some((key, index) => !Object.is(key, prevProps.resetKeys![index]));

    if (didResetKeysChange && this.state.error) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = () => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return this.props.fallbackRender({
        error: this.state.error,
        resetErrorBoundary: this.resetErrorBoundary,
      });
    }

    return this.props.children;
  }
}

export default SimpleErrorBoundary;
