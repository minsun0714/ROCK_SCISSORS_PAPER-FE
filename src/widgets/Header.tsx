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
    <header className="sticky top-0 z-10 border-b shadow-sm bg-background">
      <div className="flex items-center justify-between w-full max-w-3xl px-4 py-3 mx-auto">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <img src="/logo.svg" alt="RSP" className="w-8 h-8" />
          <span className="text-xl tracking-tight font-display text-primary">RPS</span>
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
