import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AnalyticsContextProvider } from "../analytics/AnalyticsContext";
import { ConceptProvider } from "../concepts/conceptMode";
import { LanguageProvider } from "../i18n/language";
import { AppErrorBoundary } from "../shared/components/AppErrorBoundary";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <ConceptProvider>
          <LanguageProvider>
            <AnalyticsContextProvider>{children}</AnalyticsContextProvider>
          </LanguageProvider>
        </ConceptProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}
