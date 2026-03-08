import { Link, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import NotificationBell from "@/components/NotificationBell";
import ProfileDropdown from "@/components/ProfileDropdown";
import { Button } from "@/components/ui/button";
import { LoginModalProvider } from "@/features/auth/LoginModalContext";
import { useNotifications } from "@/features/notification/useNotifications";
import PresenceProvider from "@/features/presence/PresenceProvider";
import { startGoogleLogin } from "@/service/authService";
import { useHeartbeat, useMyProfileQuery } from "@/features/user/hooks";

function App() {
  const { data: myProfile, isPending } = useMyProfileQuery();
  const isLoggedIn = !!myProfile;

  useHeartbeat(isLoggedIn);
  const { notifications, hasUnread, markAsRead, clearAll } = useNotifications(isLoggedIn);

  return (
    <PresenceProvider>
      <LoginModalProvider isLoggedIn={isLoggedIn}>
        <header className="sticky top-0 z-10 border-b bg-background shadow-sm">
          <div className="mx-auto flex w-full max-w-xl items-center justify-between px-4 py-3">
            <Link to="/" className="font-display text-xl tracking-tight text-primary no-underline">
              RSP
            </Link>
            {isPending ? null : isLoggedIn ? (
              <div className="flex items-center gap-3">
                <NotificationBell
                  notifications={notifications}
                  hasUnread={hasUnread}
                  onOpen={markAsRead}
                  onClearAll={clearAll}
                />
                <ProfileDropdown profileImageUrl={myProfile.profileImageUrl} />
              </div>
            ) : (
              <Button onClick={startGoogleLogin}>
                Google로 로그인
              </Button>
            )}
          </div>
        </header>
        <Outlet />
        <Toaster position="bottom-right" richColors />
      </LoginModalProvider>
    </PresenceProvider>
  );
}

export default App;
