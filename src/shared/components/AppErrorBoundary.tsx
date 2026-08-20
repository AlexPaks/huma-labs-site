import { Component, type ErrorInfo, type ReactNode } from "react";
import { getCurrentDocumentLanguage } from "../../i18n/language";
import { getMessage } from "../../i18n/messages";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  public state: AppErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled application error", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const language = getCurrentDocumentLanguage();

      return (
        <div
          role="alert"
          className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 text-center text-[var(--color-primary)]"
        >
          <div className="space-y-3">
            <p className="font-display text-2xl">
              {getMessage("system", "errorBoundary.brand", undefined, language)}
            </p>
            <p>{getMessage("system", "errorBoundary.title", undefined, language)}</p>
            <p className="text-sm text-[var(--color-secondary)]">
              {getMessage("system", "errorBoundary.body", undefined, language)}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
