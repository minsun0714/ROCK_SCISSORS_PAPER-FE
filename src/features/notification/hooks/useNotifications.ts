import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/service/apiClient";

export type Notification = {
  id: string;
  type: string;
  message: string;
  data?: Record<string, unknown>;
  createdAt: string;
};

type FriendRequestNotificationData = {
  senderId: number;
  nickname: string;
  profileImageUrl: string | null;
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

    eventSource.addEventListener("FRIEND_REQUESTED", (event: MessageEvent) => {
      const data: FriendRequestNotificationData = JSON.parse(event.data);
      const notification: Notification = {
        id: crypto.randomUUID(),
        type: "FRIEND_REQUESTED",
        message: `${data.nickname}님이 친구 요청을 보냈습니다.`,
        data,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [notification, ...prev]);
      setHasUnread(true);
      invalidateFriendQueries(["myPendingRequests"]);
    });

    eventSource.addEventListener("FRIEND_REQUEST_ACCEPTED", (event: MessageEvent) => {
      const data: FriendRequestNotificationData = JSON.parse(event.data);
      const notification: Notification = {
        id: crypto.randomUUID(),
        type: "FRIEND_REQUEST_ACCEPTED",
        message: `${data.nickname}님이 친구 요청을 수락했습니다.`,
        data,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [notification, ...prev]);
      setHasUnread(true);
      invalidateFriendQueries(["myReceivedRequests"], ["myFriends"]);
    });

    eventSource.addEventListener("FRIEND_REQUEST_REJECTED", (event: MessageEvent) => {
      const data: FriendRequestNotificationData = JSON.parse(event.data);
      const notification: Notification = {
        id: crypto.randomUUID(),
        type: "FRIEND_REQUEST_REJECTED",
        message: `${data.nickname}님이 친구 요청을 거절했습니다.`,
        data,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [notification, ...prev]);
      setHasUnread(true);
      invalidateFriendQueries(["myReceivedRequests"]);
    });

    eventSource.addEventListener("FRIEND_REQUEST_CANCELLED", (event: MessageEvent) => {
      const data: FriendRequestNotificationData = JSON.parse(event.data);
      setNotifications((prev) =>
        prev.filter((n) => !(n.type === "FRIEND_REQUESTED" && n.data?.senderId === data.senderId)),
      );
      invalidateFriendQueries(["myPendingRequests"]);
    });

    // EventSource는 onerror 시 자동 재연결하므로 close() 호출하지 않음

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [isLoggedIn, queryClient]);

  const markAsRead = () => setHasUnread(false);
  const clearAll = () => {
    setNotifications([]);
    setHasUnread(false);
  };

  return { notifications, hasUnread, markAsRead, clearAll };
};
