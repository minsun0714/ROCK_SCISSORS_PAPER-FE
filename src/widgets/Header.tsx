import { Link } from "react-router-dom";
import NotificationBell from "@/features/notification/components/NotificationBell";
import type { Notification } from "@/features/notification/hooks";
import ProfileDropdown from "@/features/user/components/ProfileDropdown";
import { startGoogleLogin } from "@/service/authService";
import { Button } from "@/shared/components/ui/button";

type HeaderProps = {
  isPending: boolean;
  isLoggedIn: boolean;
  notifications: Notification[];
  hasUnread: boolean;
  onOpenNotifications: () => void;
  onDismissNotification: (notificationId: string) => void;
  onClearNotifications: () => void;
  profileImageUrl?: string | null;
};

function Header({
  isPending,
  isLoggedIn,
  notifications,
  hasUnread,
  onOpenNotifications,
  onDismissNotification,
  onClearNotifications,
  profileImageUrl,
}: HeaderProps) {
  return (
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
              onOpen={onOpenNotifications}
              onDismissNotification={onDismissNotification}
              onClearAll={onClearNotifications}
            />
            <ProfileDropdown profileImageUrl={profileImageUrl} />
          </div>
        ) : (
          <Button onClick={startGoogleLogin}>Google 로그인</Button>
        )}
      </div>
    </header>
  );
}

export default Header;
