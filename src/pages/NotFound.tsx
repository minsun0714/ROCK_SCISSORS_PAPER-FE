import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";

function NotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-3xl flex-col items-center justify-center gap-3 px-4 py-10 text-center">
      <p className="text-xs font-medium text-muted-foreground">404</p>
      <h1 className="font-display text-lg font-semibold text-foreground">페이지를 찾을 수 없습니다.</h1>
      <p className="text-sm text-muted-foreground">입력한 주소가 잘못되었거나 페이지가 이동되었습니다.</p>
      <Button render={<Link to="/" />} size="lg">
        홈으로 이동
      </Button>
    </main>
  );
}

export default NotFound;
