import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/shared/api/apiClient";

export const NotificationEventType = {
  FRIEND_REQUESTED: "FRIEND_REQUESTED",
  FRIEND_REQUEST_ACCEPTED: "FRIEND_REQUEST_ACCEPTED",
  FRIEND_REQUEST_REJECTED: "FRIEND_REQUEST_REJECTED",
  FRIEND_REQUEST_CANCELLED: "FRIEND_REQUEST_CANCELLED",
  BATTLE_REQUESTED: "BATTLE_REQUESTED",
  BATTLE_REQUEST_ACCEPTED: "BATTLE_REQUEST_ACCEPTED",
  BATTLE_REQUEST_REJECTED: "BATTLE_REQUEST_REJECTED",
  BATTLE_REQUEST_CANCELLED: "BATTLE_REQUEST_CANCELLED",
} as const;

export type NotificationEventType =
  (typeof NotificationEventType)[keyof typeof NotificationEventType];

type FriendRequestNotificationData = {
  senderId: number;
  nickname: string;
  profileImageUrl: string | null;
  requestId: number;
};

export type BattleRequestNotificationData = {
  requestId?: number | null;
  id?: number | null;
  battleRequestId?: number | null;
  battleId?: string | number | null;
  roomId?: string | number | null;
  battleRoomId?: string | number | null;
  senderId?: number | null;
  nickname?: string | null;
  profileImageUrl?: string | null;
  status?: string | null;
};

type NotificationData = FriendRequestNotificationData | BattleRequestNotificationData;

export type Notification = {
  id: string;
  type: NotificationEventType;
  message: string;
  data?: NotificationData;
  createdAt: string;
};

export const useNotifications = (isLoggedIn: boolean) => {
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const rawToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    const url = `${API_BASE_URL}/subscribe?token=${encodeURIComponent(rawToken)}`;
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    const invalidateFriendQueries = (...extra: string[][]) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["userSearch"] });
      for (const key of extra) {
        queryClient.invalidateQueries({ queryKey: key });
      }
    };

    // ── 친구 요청 ──

    eventSource.addEventListener(NotificationEventType.FRIEND_REQUESTED, (event: MessageEvent) => {
      const data: FriendRequestNotificationData = JSON.parse(event.data);
      const notification: Notification = {
        id: crypto.randomUUID(),
        type: NotificationEventType.FRIEND_REQUESTED,
        message: `${data.nickname}님이 친구 요청을 보냈습니다.`,
        data,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [notification, ...prev]);
      setHasUnread(true);
      invalidateFriendQueries(["myPendingRequests"]);
    });

    eventSource.addEventListener(
      NotificationEventType.FRIEND_REQUEST_ACCEPTED,
      (event: MessageEvent) => {
        const data: FriendRequestNotificationData = JSON.parse(event.data);
        const notification: Notification = {
          id: crypto.randomUUID(),
          type: NotificationEventType.FRIEND_REQUEST_ACCEPTED,
          message: `${data.nickname}님이 친구 요청을 수락했습니다.`,
          data,
          createdAt: new Date().toISOString(),
        };
        setNotifications((prev) => [notification, ...prev]);
        setHasUnread(true);
        invalidateFriendQueries(["myReceivedRequests"], ["myFriends"]);
      },
    );

    eventSource.addEventListener(
      NotificationEventType.FRIEND_REQUEST_REJECTED,
      (event: MessageEvent) => {
        const data: FriendRequestNotificationData = JSON.parse(event.data);
        const notification: Notification = {
          id: crypto.randomUUID(),
          type: NotificationEventType.FRIEND_REQUEST_REJECTED,
          message: `${data.nickname}님이 친구 요청을 거절했습니다.`,
          data,
          createdAt: new Date().toISOString(),
        };
        setNotifications((prev) => [notification, ...prev]);
        setHasUnread(true);
        invalidateFriendQueries(["myReceivedRequests"]);
      },
    );

    eventSource.addEventListener(
      NotificationEventType.FRIEND_REQUEST_CANCELLED,
      (event: MessageEvent) => {
        const data: FriendRequestNotificationData = JSON.parse(event.data);
        setNotifications((prev) =>
          prev.filter(
            (n) =>
              !(
                n.type === NotificationEventType.FRIEND_REQUESTED &&
                n.data?.senderId === data.senderId
              ),
          ),
        );
        invalidateFriendQueries(["myPendingRequests"]);
      },
    );

    // ── 배틀 요청 ──

    eventSource.addEventListener(NotificationEventType.BATTLE_REQUESTED, (event: MessageEvent) => {
      const data: BattleRequestNotificationData = JSON.parse(event.data);
      console.log("[SSE] BATTLE_REQUESTED data:", data);
      const notification: Notification = {
        id: crypto.randomUUID(),
        type: NotificationEventType.BATTLE_REQUESTED,
        message: `${data.nickname ?? "상대방"}님이 대전을 신청했습니다.`,
        data,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [notification, ...prev]);
      setHasUnread(true);
      invalidateFriendQueries(["myFriends"]);
    });

    eventSource.addEventListener(
      NotificationEventType.BATTLE_REQUEST_ACCEPTED,
      (event: MessageEvent) => {
        const data: BattleRequestNotificationData = JSON.parse(event.data);
        const notification: Notification = {
          id: crypto.randomUUID(),
          type: NotificationEventType.BATTLE_REQUEST_ACCEPTED,
          message: `${data.nickname ?? "상대방"}님이 대전방에 입장했습니다.`,
          data,
          createdAt: new Date().toISOString(),
        };
        setNotifications((prev) => [notification, ...prev]);
        setHasUnread(true);
      },
    );

    eventSource.addEventListener(
      NotificationEventType.BATTLE_REQUEST_REJECTED,
      (event: MessageEvent) => {
        const data: BattleRequestNotificationData = JSON.parse(event.data);
        const notification: Notification = {
          id: crypto.randomUUID(),
          type: NotificationEventType.BATTLE_REQUEST_REJECTED,
          message: `${data.nickname ?? "상대방"}님이 대전을 거절했습니다.`,
          data,
          createdAt: new Date().toISOString(),
        };
        setNotifications((prev) => [notification, ...prev]);
        setHasUnread(true);
      },
    );

    eventSource.addEventListener(
      NotificationEventType.BATTLE_REQUEST_CANCELLED,
      (event: MessageEvent) => {
        const data: BattleRequestNotificationData = JSON.parse(event.data);
        setNotifications((prev) =>
          prev.filter(
            (notification) =>
              !(
                notification.type === NotificationEventType.BATTLE_REQUESTED &&
                notification.data &&
                "requestId" in notification.data &&
                notification.data.requestId === data.requestId
              ),
          ),
        );
      },
    );

    // EventSource는 onerror 시 자동 재연결하므로 close() 호출하지 않음

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [isLoggedIn, queryClient]);

  const markAsRead = () => setHasUnread(false);
  const dismissNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId));
  };
  const clearAll = () => {
    setNotifications([]);
    setHasUnread(false);
  };

  return { notifications, hasUnread, markAsRead, dismissNotification, clearAll };
};
