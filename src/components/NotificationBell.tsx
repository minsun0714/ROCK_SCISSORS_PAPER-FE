import { useEffect, useRef, useState } from "react";
import { Bell, CircleUserRound } from "lucide-react";
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
      <button type="button" onClick={handleToggle} className="relative cursor-pointer p-1">
        <Bell className="h-5 w-5 text-slate-700" />
        {hasUnread && (
          <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2">
            <span className="text-sm font-semibold text-slate-900">알림</span>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                모두 삭제
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-400">알림이 없습니다.</p>
            ) : (
              <ul>
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className="flex items-start gap-3 border-b border-slate-50 px-4 py-3 last:border-b-0"
                  >
                    {notification.data?.profileImageUrl ? (
                      <img
                        src={notification.data.profileImageUrl as string}
                        alt=""
                        className="h-8 w-8 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <CircleUserRound className="h-8 w-8 shrink-0 text-slate-400" />
                    )}
                    <div>
                      <p className="text-sm text-slate-700">{notification.message}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {new Date(notification.createdAt).toLocaleString("ko-KR")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
