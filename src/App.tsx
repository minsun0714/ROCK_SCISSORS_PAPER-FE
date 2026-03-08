import { Link, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import ProfileDropdown from "@/components/ProfileDropdown";
import { LoginModalProvider } from "@/features/auth/LoginModalContext";
import PresenceProvider from "@/features/presence/PresenceProvider";
import { startGoogleLogin } from "@/service/authService";
import { useHeartbeat, useMyProfileQuery } from "@/features/user/hooks";

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
        <Toaster position="bottom-right" richColors />
      </LoginModalProvider>
    </PresenceProvider>
  );
}

export default App;
