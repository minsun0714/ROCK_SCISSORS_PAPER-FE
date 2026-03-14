import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";

function RouteErrorBoundary() {
  const error = useRouteError();

  const status = isRouteErrorResponse(error) ? error.status : 500;
  const title = status === 404 ? "페이지를 찾을 수 없습니다." : "요청 처리 중 오류가 발생했습니다.";
  const message =
    status === 404
      ? "입력한 주소가 잘못되었거나 페이지가 이동되었습니다."
      : "잠시 후 다시 시도해 주세요.";

  return (
    <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-3xl flex-col items-center justify-center gap-3 px-4 py-10 text-center">
      <p className="text-xs font-medium text-muted-foreground">{status}</p>
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button render={<Link to="/" />} size="lg">
        홈으로 이동
      </Button>
    </main>
  );
}

export default RouteErrorBoundary;
