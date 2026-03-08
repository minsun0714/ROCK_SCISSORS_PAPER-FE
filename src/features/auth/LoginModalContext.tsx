import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import { startGoogleLogin } from "@/service/authService";

type LoginModalContextType = {
  isLoggedIn: boolean;
  requireLogin: () => void;
};

const LoginModalContext = createContext<LoginModalContextType>({
  isLoggedIn: false,
  requireLogin: () => {},
});

export const useLoginModal = () => useContext(LoginModalContext);

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

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) setIsOpen(false);
  };

  return (
    <LoginModalContext.Provider value={{ isLoggedIn, requireLogin }}>
      {children}

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={handleBackdropClick}
        >
          <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
            <h2 className="mb-2 text-center text-lg font-semibold text-slate-900">
              로그인이 필요합니다
            </h2>
            <p className="mb-6 text-center text-sm text-slate-500">
              이 기능을 사용하려면 로그인해주세요.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={startGoogleLogin}
                className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Google로 로그인
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </LoginModalContext.Provider>
  );
}
