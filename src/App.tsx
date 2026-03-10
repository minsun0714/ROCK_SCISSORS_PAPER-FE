import { Toaster } from "sonner";
import { Outlet } from "react-router-dom";
import { LoginModalProvider } from "@/features/auth/LoginModalContext";
import { useNotifications } from "@/features/notification/hooks";
import PresenceProvider from "@/features/presence/PresenceProvider";
import { useHeartbeat, useMyProfileQuery } from "@/features/user/hooks";
import ApiQueryBoundary from "@/shared/components/error/ApiQueryBoundary";
import Header from "@/widgets/Header";

function App() {
  const { data: myProfile, isPending } = useMyProfileQuery({ throwOnError: false });
  const isLoggedIn = !!myProfile;

  useHeartbeat(isLoggedIn);
  const { notifications, hasUnread, markAsRead, dismissNotification, clearAll } =
    useNotifications(isLoggedIn);

  return (
    <PresenceProvider>
      <LoginModalProvider isLoggedIn={isLoggedIn}>
        <Header
          isPending={isPending}
          isLoggedIn={isLoggedIn}
          notifications={notifications}
          hasUnread={hasUnread}
          onOpenNotifications={markAsRead}
          onDismissNotification={dismissNotification}
          onClearNotifications={clearAll}
          profileImageUrl={myProfile?.profileImageUrl}
        />
        <ApiQueryBoundary>
          <Outlet />
        </ApiQueryBoundary>
        <Toaster position="bottom-right" richColors />
      </LoginModalProvider>
    </PresenceProvider>
  );
}

export default App;
