import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { LoginModalContext } from "@/features/auth/hooks/useLoginModal";
import { startGoogleLogin } from "@/service/authService";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

type LoginModalProviderProps = {
  isLoggedIn: boolean;
  children: ReactNode;
};

export function LoginModalProvider({ isLoggedIn, children }: LoginModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const requireLogin = useCallback(() => {
    if (!isLoggedIn) {
      setIsOpen(true);
    }
  }, [isLoggedIn]);

  return (
    <LoginModalContext.Provider value={{ isLoggedIn, requireLogin }}>
      {children}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>로그인이 필요합니다</DialogTitle>
            <DialogDescription>이 기능을 사용하려면 로그인해주세요.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button onClick={startGoogleLogin} className="w-full">
              Google로 로그인
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full">
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LoginModalContext.Provider>
  );
}
