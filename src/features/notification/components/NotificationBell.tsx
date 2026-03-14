import { Bell, Check, Swords, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAcceptBattleRequestMutation } from "@/features/battle/hooks";
import { useRejectBattleRequestMutation } from "@/features/battle/hooks";
import { type BattleRouteState } from "@/features/battle/types";
import {
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
} from "@/features/friend/hooks";
import {
  type BattleRequestNotificationData,
  type Notification,
  NotificationEventType,
} from "@/features/notification/hooks";
import {
  type BattleRequestResponse,
  resolveBattleId,
  resolveBattleRequestId,
  resolveBattleStatus,
} from "@/service/battleService";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

function NotificationBell({
  notifications,
  hasUnread,
  onOpen,
  onDismissNotification,
  onClearAll,
}: {
  notifications: Notification[];
  hasUnread: boolean;
  onOpen: () => void;
  onDismissNotification: (notificationId: string) => void;
  onClearAll: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { mutate: acceptBattleRequest, isPending: isAcceptingBattleRequest } =
    useAcceptBattleRequestMutation();
  const { mutate: rejectBattleRequestMutate, isPending: isRejectingBattleRequest } =
    useRejectBattleRequestMutation();
  const { mutate: acceptFriend, isPending: isAcceptingFriend } =
    useAcceptFriendRequestMutation("notifications");
  const { mutate: rejectFriend, isPending: isRejectingFriend } =
    useRejectFriendRequestMutation("notifications");

  const isBattleRequestNotification = (notification: Notification) =>
    notification.type === NotificationEventType.BATTLE_REQUESTED;

  const isFriendRequestNotification = (notification: Notification) =>
    notification.type === NotificationEventType.FRIEND_REQUESTED;

  const toBattleRouteState = (data: BattleRequestNotificationData): BattleRouteState => ({
    role: "creator",
    battleStatus: resolveBattleStatus(toBattleRequestResponse(data)),
    requestId: resolveBattleRequestId(toBattleRequestResponse(data)),
    opponent: {
      userId: data.senderId ?? undefined,
      nickname: data.nickname ?? undefined,
      profileImageUrl: data.profileImageUrl ?? null,
    },
  });

  const toBattleRequestResponse = (
    data?: BattleRequestNotificationData,
  ): BattleRequestResponse | null => {
    if (!data) {
      return null;
    }

    return {
      requestId: data.requestId ?? undefined,
      id: data.id ?? undefined,
      battleRequestId: data.battleRequestId ?? undefined,
      battleId: data.battleId ?? undefined,
      roomId: data.roomId ?? undefined,
      battleRoomId: data.battleRoomId ?? undefined,
      status: data.status ?? undefined,
      battleStatus: data.status ?? undefined,
    };
  };

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

  const handleAcceptBattleRequest = (
    notificationId: string,
    data: BattleRequestNotificationData,
  ) => {
    const battleResponse = toBattleRequestResponse(data);
    const requestId = resolveBattleRequestId(battleResponse);

    if (!requestId) {
      return;
    }

    acceptBattleRequest(
      {
        requestId,
        battleId: resolveBattleId(battleResponse),
        opponentUserId: data.senderId ?? undefined,
        opponentNickname: data.nickname ?? undefined,
        opponentProfileImageUrl: data.profileImageUrl ?? null,
      },
      {
        onSuccess: () => {
          onDismissNotification(notificationId);
          setIsOpen(false);
        },
      },
    );
  };

  const handleRejectBattleRequest = (
    notificationId: string,
    data: BattleRequestNotificationData,
  ) => {
    const battleResponse = toBattleRequestResponse(data);
    const requestId = resolveBattleRequestId(battleResponse);

    if (!requestId) {
      return;
    }

    rejectBattleRequestMutate(requestId, {
      onSuccess: () => {
        onDismissNotification(notificationId);
      },
    });
  };

  const handleAcceptFriendRequest = (notificationId: string, requestId: number) => {
    acceptFriend(requestId, {
      onSuccess: () => {
        onDismissNotification(notificationId);
      },
    });
  };

  const handleRejectFriendRequest = (notificationId: string, requestId: number) => {
    rejectFriend(requestId, {
      onSuccess: () => {
        onDismissNotification(notificationId);
      },
    });
  };

  const handleEnterBattleRoom = (data: BattleRequestNotificationData) => {
    const battleId = resolveBattleId(toBattleRequestResponse(data));

    if (!battleId) {
      return;
    }

    navigate(`/battles/${battleId}`, {
      state: toBattleRouteState(data),
    });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={panelRef}>
      <Button variant="ghost" size="icon" onClick={handleToggle} className="relative">
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 mt-2 shadow-lg w-80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
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
          <CardContent className="p-0 overflow-y-auto max-h-72">
            {notifications.length === 0 ? (
              <p className="px-6 py-8 text-sm text-center text-muted-foreground">
                알림이 없습니다.
              </p>
            ) : (
              <ul>
                {notifications.map((notification: Notification) => {
                  const { id, data, message, createdAt, type } = notification;
                  const battleData = data as BattleRequestNotificationData | undefined;
                  const friendRequestId =
                    data && "requestId" in data ? (data.requestId as number) : null;

                  return (
                    <li key={id} className="flex items-start gap-3 px-4 py-3 border-t">
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarImage src={data?.profileImageUrl?.toString() || undefined} />
                        <AvatarFallback>
                          <UserRound className="w-5 h-5 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{message}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {new Date(createdAt).toLocaleString("ko-KR")}
                        </p>
                        {isFriendRequestNotification(notification) &&
                          friendRequestId != null && (
                            <div className="flex items-center gap-2 mt-3">
                              <Button
                                size="xs"
                                onClick={() => handleAcceptFriendRequest(id, friendRequestId)}
                                disabled={isAcceptingFriend}
                                className="gap-1"
                              >
                                <Check className="w-3 h-3" />
                                수락
                              </Button>
                              <Button
                                variant="destructive"
                                size="xs"
                                onClick={() => handleRejectFriendRequest(id, friendRequestId)}
                                disabled={isRejectingFriend}
                                className="gap-1"
                              >
                                <X className="w-3 h-3" />
                                거절
                              </Button>
                            </div>
                          )}
                        {isBattleRequestNotification(notification) &&
                          battleData && (
                            <div className="flex items-center gap-2 mt-3">
                              <Button
                                size="xs"
                                onClick={() => handleAcceptBattleRequest(id, battleData)}
                                disabled={isAcceptingBattleRequest}
                                className="gap-1"
                              >
                                <Check className="w-3 h-3" />
                                수락
                              </Button>
                              <Button
                                variant="destructive"
                                size="xs"
                                onClick={() => handleRejectBattleRequest(id, battleData)}
                                disabled={isRejectingBattleRequest}
                                className="gap-1"
                              >
                                <X className="w-3 h-3" />
                                거절
                              </Button>
                            </div>
                          )}
                        {type === NotificationEventType.BATTLE_REQUEST_ACCEPTED &&
                          battleData &&
                          resolveBattleId(toBattleRequestResponse(battleData)) && (
                            <div className="mt-3">
                              <Button
                                variant="secondary"
                                size="xs"
                                onClick={() => handleEnterBattleRoom(battleData)}
                                className="gap-1"
                              >
                                <Swords className="w-3 h-3" />방 보기
                              </Button>
                            </div>
                          )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default NotificationBell;
