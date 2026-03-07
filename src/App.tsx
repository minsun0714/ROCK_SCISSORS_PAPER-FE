import { Link, Outlet } from "react-router-dom";
import { startGoogleLogin } from "@/service/authService";
import PresenceProvider from "@/features/presence/PresenceProvider";
import { useHeartbeat, useMyProfileQuery } from "@/features/user/hooks";

function App() {
  useHeartbeat();

  const { data: myProfile, isPending } = useMyProfileQuery();
  const isLoggedIn = !!myProfile;

  return (
    <PresenceProvider>
      <header className="sticky top-0 z-10 flex w-full items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <Link to="/" className="text-lg font-bold text-slate-900 no-underline">
          RSP
        </Link>
        {isPending ? null : isLoggedIn ? (
          <Link to="/my">
            {myProfile.profileImageUrl ? (
              <img
                src={myProfile.profileImageUrl}
                alt="프로필"
                className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-200"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-500">
                MY
              </div>
            )}
          </Link>
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
    </PresenceProvider>
  );
}

export default App;
