import { Toaster } from "sonner";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import { LoginModalProvider } from "@/features/auth/LoginModalContext";
import { useNotifications } from "@/features/notification/hooks";
import PresenceProvider from "@/features/presence/PresenceProvider";
import { useHeartbeat, useMyProfileQuery } from "@/features/user/hooks";

function App() {
  const { data: myProfile, isPending } = useMyProfileQuery();
  const isLoggedIn = !!myProfile;

  useHeartbeat(isLoggedIn);
  const { notifications, hasUnread, markAsRead, clearAll } = useNotifications(isLoggedIn);

  return (
    <PresenceProvider>
      <LoginModalProvider isLoggedIn={isLoggedIn}>
        <Header
          isPending={isPending}
          isLoggedIn={isLoggedIn}
          notifications={notifications}
          hasUnread={hasUnread}
          onOpenNotifications={markAsRead}
          onClearNotifications={clearAll}
          profileImageUrl={myProfile?.profileImageUrl}
        />
        <Outlet />
        <Toaster position="bottom-right" richColors />
      </LoginModalProvider>
    </PresenceProvider>
  );
}

export default App;
