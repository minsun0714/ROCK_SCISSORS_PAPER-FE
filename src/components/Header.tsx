import { Link } from "react-router-dom";
import NotificationBell from "@/components/NotificationBell";
import ProfileDropdown from "@/components/ProfileDropdown";
import { Button } from "@/components/ui/button";
import type { Notification } from "@/features/notification/hooks";
import { startGoogleLogin } from "@/service/authService";

type HeaderProps = {
  isPending: boolean;
  isLoggedIn: boolean;
  notifications: Notification[];
  hasUnread: boolean;
  onOpenNotifications: () => void;
  onClearNotifications: () => void;
  profileImageUrl?: string | null;
};

function Header({
  isPending,
  isLoggedIn,
  notifications,
  hasUnread,
  onOpenNotifications,
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
              onClearAll={onClearNotifications}
            />
            <ProfileDropdown profileImageUrl={profileImageUrl} />
          </div>
        ) : (
          <Button onClick={startGoogleLogin}>Google로 로그인</Button>
        )}
      </div>
    </header>
  );
}

export default Header;
