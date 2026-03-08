import { useEffect, useRef, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { LoginModalProvider } from "@/features/auth/LoginModalContext";
import PresenceProvider from "@/features/presence/PresenceProvider";
import { logout, startGoogleLogin } from "@/service/authService";
import { useHeartbeat, useMyProfileQuery } from "@/features/user/hooks";

function ProfileDropdown({ profileImageUrl }: { profileImageUrl?: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button type="button" onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="프로필"
            className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-200"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-500">
            MY
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          <Link
            to="/my"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <User className="h-4 w-4" />
            마이페이지
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}

function App() {
  useHeartbeat();

  const { data: myProfile, isPending } = useMyProfileQuery();
  const isLoggedIn = !!myProfile;

  return (
    <PresenceProvider>
      <LoginModalProvider isLoggedIn={isLoggedIn}>
        <header className="sticky top-0 z-10 flex w-full items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
          <Link to="/" className="text-lg font-bold text-slate-900 no-underline">
            RSP
          </Link>
          {isPending ? null : isLoggedIn ? (
            <ProfileDropdown profileImageUrl={myProfile.profileImageUrl} />
          ) : (
            <button
              type="button"
              onClick={startGoogleLogin}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Google로 로그인
            </button>
          )}
        </header>
        <Outlet />
      </LoginModalProvider>
    </PresenceProvider>
  );
}

export default App;
