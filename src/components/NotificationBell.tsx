import { useEffect, useRef, useState } from "react";
import { Bell, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Notification } from "@/features/notification/useNotifications";

function NotificationBell({
  notifications,
  hasUnread,
  onOpen,
  onClearAll,
}: {
  notifications: Notification[];
  hasUnread: boolean;
  onOpen: () => void;
  onClearAll: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) onOpen();
  };

  return (
    <div className="relative" ref={panelRef}>
      <Button variant="ghost" size="icon" onClick={handleToggle} className="relative">
        <Bell className="h-5 w-5" />
        {hasUnread && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 mt-2 w-80 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold">알림</CardTitle>
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearAll} className="h-auto px-2 py-1 text-xs text-muted-foreground">
                모두 삭제
              </Button>
            )}
          </CardHeader>
          <CardContent className="max-h-72 overflow-y-auto p-0">
            {notifications.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">알림이 없습니다.</p>
            ) : (
              <ul>
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className="flex items-start gap-3 border-t px-4 py-3"
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      {notification.data?.profileImageUrl && (
                        <AvatarImage src={notification.data.profileImageUrl as string} />
                      )}
                      <AvatarFallback>
                        <UserRound className="h-5 w-5 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm">{notification.message}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString("ko-KR")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default NotificationBell;
