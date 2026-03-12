import type { ReactNode } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import SimpleErrorBoundary from "@/shared/components/error/SimpleErrorBoundary";
import { Button } from "@/shared/components/ui/button";

type ApiQueryBoundaryProps = {
  children: ReactNode;
};

function ApiErrorFallback({ onRetry, error }: { onRetry: () => void; error: Error }) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-xl flex-col items-center justify-center gap-3 px-4 py-10 text-center">
      <p className="text-base font-semibold text-foreground">서버 요청에 실패했습니다.</p>
      <p className="text-sm text-muted-foreground">잠시 후 다시 시도해 주세요.</p>
      <p className="max-w-md text-xs text-muted-foreground">{error.message}</p>
      <Button onClick={onRetry} size="lg">
        다시 시도
      </Button>
    </main>
  );
}

function ApiQueryBoundary({ children }: ApiQueryBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <SimpleErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ApiErrorFallback error={error} onRetry={resetErrorBoundary} />
          )}
        >
          {children}
        </SimpleErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

export default ApiQueryBoundary;
