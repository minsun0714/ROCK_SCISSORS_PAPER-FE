import { Swords, UserCheck, UserRound, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useLoginModal } from "@/features/auth/hooks";
import {
  useAcceptBattleRequestMutation,
  useRejectBattleRequestMutation,
  useSendBattleRequestMutation,
} from "@/features/battle/hooks";
import FriendActionButtons from "@/features/friend/components/FriendActionButtons";
import { useBattleRequest } from "@/features/notification/BattleRequestContext";
import { usePresence } from "@/features/presence/hooks";
import { presenceColorClass } from "@/features/presence/presenceColorClass";
import type { FriendResponse } from "@/service/friendService";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

function FriendListItem({
  friend,
  invalidateKey,
}: {
  friend: FriendResponse;
  invalidateKey: string;
}) {
  const { ref, presenceStatus } = usePresence<HTMLLIElement>(friend.userId);
  const status = presenceStatus ?? friend.presenceStatus;
  const { isLoggedIn, requireLogin } = useLoginModal();
  const { mutate: sendBattle, isPending: isSendingBattle } = useSendBattleRequestMutation();
  const { mutate: acceptBattle, isPending: isAcceptingBattle } =
    useAcceptBattleRequestMutation();
  const { mutate: rejectBattle, isPending: isRejectingBattle } =
    useRejectBattleRequestMutation();
  const { getPendingBattleRequest, dismissNotification } = useBattleRequest();
  const pendingRequest = getPendingBattleRequest(friend.userId);
  const isFriend = friend.friendInfo?.status === "FRIEND";

  const handleAccept = () => {
    if (!pendingRequest) return;
    const { notificationId, data } = pendingRequest;
    const requestId =
      data.roomId ?? data.requestId ?? data.id ?? data.battleRequestId;
    if (requestId == null) return;

    acceptBattle(
      {
        requestId,
        battleId: data.battleId != null ? String(data.battleId) : null,
        opponentUserId: data.senderId ?? undefined,
        opponentNickname: data.nickname ?? undefined,
        opponentProfileImageUrl: data.profileImageUrl ?? null,
      },
      { onSuccess: () => dismissNotification(notificationId) },
    );
  };

  const handleReject = () => {
    if (!pendingRequest) return;
    const { notificationId, data } = pendingRequest;
    const requestId =
      data.roomId ?? data.requestId ?? data.id ?? data.battleRequestId;
    if (requestId == null) return;

    rejectBattle(requestId, {
      onSuccess: () => dismissNotification(notificationId),
    });
  };

  return (
    <li ref={ref} className="flex items-center">
      <Link
        to={`/users/${friend.userId}`}
        className="flex flex-1 items-center gap-3 px-4 py-3 transition-colors hover:bg-accent"
      >
        <div className="relative">
          <Avatar className="h-10 w-10">
            {friend.profileImageUrl && (
              <AvatarImage src={friend.profileImageUrl} alt={friend.nickname} />
            )}
            <AvatarFallback>
              <UserRound className="h-5 w-5 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${presenceColorClass(status)}`}
          />
        </div>
        <div className="flex flex-1 items-center justify-between">
          <span className="text-sm font-medium">{friend.nickname}</span>
          <div className="flex items-center gap-1.5">
            {status === "IN_BATTLE" && <Swords className="h-4 w-4 text-amber-500" />}
            {!isFriend && <FriendActionButtons friend={friend} invalidateKey={invalidateKey} />}
          </div>
        </div>
      </Link>
      {isFriend && (
        <>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-1.5 px-3">
            <Badge variant="secondary" className="gap-1">
              <UserCheck className="w-3 h-3" />
              친구
            </Badge>
            {pendingRequest ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAccept}
                  disabled={isAcceptingBattle}
                  className="gap-1 px-2 text-xs h-7 border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                >
                  <Swords className="h-3 w-3" />
                  대전 수락
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReject}
                  disabled={isRejectingBattle}
                  className="gap-1 px-2 text-xs h-7"
                >
                  <X className="h-3 w-3" />
                  거절
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  if (!isLoggedIn) return requireLogin();
                  sendBattle({
                    targetUserId: friend.userId,
                    opponentNickname: friend.nickname,
                    opponentProfileImageUrl: friend.profileImageUrl,
                  });
                }}
                disabled={isSendingBattle}
                className="gap-1 px-2 text-xs h-7"
              >
                <Swords className="h-3.5 w-3.5" />
                대전 신청
              </Button>
            )}
          </div>
        </>
      )}
    </li>
  );
}

export default FriendListItem;
