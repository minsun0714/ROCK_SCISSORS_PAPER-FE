import { Bell, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  type Notification,
  NotificationEventType,
} from "@/features/notification/hooks";
import { useAcceptBattleRequestMutation, useRejectBattleRequestMutation } from "@/features/battle/hooks";
import {
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
} from "@/features/friend/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

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

  const { mutate: acceptFriend, isPending: isAcceptingFriend } =
    useAcceptFriendRequestMutation("notifications");
  const { mutate: rejectFriend, isPending: isRejectingFriend } =
    useRejectFriendRequestMutation("notifications");
  const { mutate: acceptBattle, isPending: isAcceptingBattle } =
    useAcceptBattleRequestMutation();
  const { mutate: rejectBattle, isPending: isRejectingBattle } =
    useRejectBattleRequestMutation();

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
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="h-auto px-2 py-1 text-xs text-muted-foreground"
              >
                모두 삭제
              </Button>
            )}
          </CardHeader>
          <CardContent className="max-h-72 overflow-y-auto p-0">
            {notifications.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">
                알림이 없습니다.
              </p>
            ) : (
              <ul>
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onAcceptFriend={acceptFriend}
                    onRejectFriend={rejectFriend}
                    isAcceptingFriend={isAcceptingFriend}
                    isRejectingFriend={isRejectingFriend}
                    onAcceptBattle={acceptBattle}
                    onRejectBattle={rejectBattle}
                    isAcceptingBattle={isAcceptingBattle}
                    isRejectingBattle={isRejectingBattle}
                  />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  onAcceptFriend,
  onRejectFriend,
  isAcceptingFriend,
  isRejectingFriend,
  onAcceptBattle,
  onRejectBattle,
  isAcceptingBattle,
  isRejectingBattle,
}: {
  notification: Notification;
  onAcceptFriend: (requestId: number) => void;
  onRejectFriend: (requestId: number) => void;
  isAcceptingFriend: boolean;
  isRejectingFriend: boolean;
  onAcceptBattle: (requestId: number) => void;
  onRejectBattle: (requestId: number) => void;
  isAcceptingBattle: boolean;
  isRejectingBattle: boolean;
}) {
  const { type, data, message, createdAt } = notification;
  const requestId = data && "requestId" in data ? data.requestId : null;
  const showFriendActions =
    type === NotificationEventType.FRIEND_REQUESTED && requestId != null;
  const showBattleActions =
    type === NotificationEventType.BATTLE_REQUESTED && requestId != null;

  return (
    <li className="border-t px-4 py-3">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={data?.profileImageUrl?.toString() || undefined} />
          <AvatarFallback>
            <UserRound className="h-5 w-5 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm">{message}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {new Date(createdAt).toLocaleString("ko-KR")}
          </p>
        </div>
      </div>
      {showFriendActions && (
        <div className="mt-2 flex gap-2">
          <Button
            size="sm"
            onClick={() => onAcceptFriend(requestId)}
            disabled={isAcceptingFriend}
            className="h-7 flex-1 text-xs"
          >
            {isAcceptingFriend ? "수락 중..." : "수락"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onRejectFriend(requestId)}
            disabled={isRejectingFriend}
            className="h-7 flex-1 text-xs"
          >
            {isRejectingFriend ? "거절 중..." : "거절"}
          </Button>
        </div>
      )}
      {showBattleActions && (
        <div className="mt-2 flex gap-2">
          <Button
            size="sm"
            onClick={() => onAcceptBattle(requestId)}
            disabled={isAcceptingBattle}
            className="h-7 flex-1 text-xs"
          >
            {isAcceptingBattle ? "수락 중..." : "수락"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onRejectBattle(requestId)}
            disabled={isRejectingBattle}
            className="h-7 flex-1 text-xs"
          >
            {isRejectingBattle ? "거절 중..." : "거절"}
          </Button>
        </div>
      )}
    </li>
  );
}

export default NotificationBell;
