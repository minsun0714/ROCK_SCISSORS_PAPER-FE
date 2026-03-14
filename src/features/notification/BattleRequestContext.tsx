import { createContext, useCallback, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import type {
  BattleRequestNotificationData,
  Notification,
} from "@/features/notification/hooks";
import { NotificationEventType } from "@/features/notification/hooks";

type PendingBattleRequest = {
  notificationId: string;
  data: BattleRequestNotificationData;
};

type BattleRequestContextValue = {
  getPendingBattleRequest: (senderUserId: number) => PendingBattleRequest | null;
  dismissNotification: (notificationId: string) => void;
  isBattleRejected: (requestId: string | number) => boolean;
};

const BattleRequestContext = createContext<BattleRequestContextValue>({
  getPendingBattleRequest: () => null,
  dismissNotification: () => {},
  isBattleRejected: () => false,
});

export function BattleRequestProvider({
  notifications,
  onDismiss,
  children,
}: {
  notifications: Notification[];
  onDismiss: (notificationId: string) => void;
  children: ReactNode;
}) {
  const battleRequests = useMemo(() => {
    return notifications.filter(
      (n) => n.type === NotificationEventType.BATTLE_REQUESTED && n.data,
    );
  }, [notifications]);

  const rejectedRequests = useMemo(() => {
    return notifications.filter(
      (n) => n.type === NotificationEventType.BATTLE_REQUEST_REJECTED && n.data,
    );
  }, [notifications]);

  const getPendingBattleRequest = useCallback(
    (senderUserId: number): PendingBattleRequest | null => {
      const found = battleRequests.find(
        (n) => n.data && "senderId" in n.data && n.data.senderId === senderUserId,
      );
      if (!found || !found.data) return null;
      return {
        notificationId: found.id,
        data: found.data as BattleRequestNotificationData,
      };
    },
    [battleRequests],
  );

  const isBattleRejected = useCallback(
    (requestId: string | number): boolean => {
      return rejectedRequests.some(
        (n) =>
          n.data &&
          "requestId" in n.data &&
          String(n.data.requestId) === String(requestId),
      );
    },
    [rejectedRequests],
  );

  return (
    <BattleRequestContext.Provider value={{ getPendingBattleRequest, dismissNotification: onDismiss, isBattleRejected }}>
      {children}
    </BattleRequestContext.Provider>
  );
}

export const useBattleRequest = () => useContext(BattleRequestContext);
