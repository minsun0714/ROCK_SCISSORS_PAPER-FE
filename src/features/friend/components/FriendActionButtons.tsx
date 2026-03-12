import { Swords, UserCheck, UserPlus } from "lucide-react";
import { useLoginModal } from "@/features/auth/hooks";
import { useSendBattleRequestMutation } from "@/features/battle/hooks";
import {
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useRejectFriendRequestMutation,
  useSendFriendRequestMutation,
} from "@/features/friend/hooks";
import { useMyProfileQuery } from "@/features/user/hooks";
import type { FriendResponse } from "@/service/friendService";
import { Button } from "@/shared/components/ui/button";

function FriendActionButtons({
  friend,
  invalidateKey,
}: {
  friend: FriendResponse;
  invalidateKey: string;
}) {
  const { isLoggedIn, requireLogin } = useLoginModal();
  const { data: myProfile } = useMyProfileQuery();
  const { mutate: sendRequest, isPending: isSending } = useSendFriendRequestMutation(invalidateKey);
  const { mutate: accept, isPending: isAccepting } = useAcceptFriendRequestMutation(invalidateKey);
  const { mutate: reject, isPending: isRejecting } = useRejectFriendRequestMutation(invalidateKey);
  const { mutate: cancel, isPending: isCancelling } = useCancelFriendRequestMutation();
  const { mutate: sendBattle, isPending: isSendingBattle } = useSendBattleRequestMutation();

  const { friendInfo, userId } = friend;
  const friendStatus = friendInfo?.status;
  const friendRequestId = friendInfo?.friendRequestId;

  if (myProfile?.userId === userId) {
    return null;
  }

  if (friendStatus === "FRIEND") {
    return (
      <div className="flex shrink-0 items-center gap-1.5">
        <UserCheck className="h-4 w-4 text-primary" />
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            if (!isLoggedIn) return requireLogin();
            sendBattle({
              targetUserId: userId,
              opponentNickname: friend.nickname,
              opponentProfileImageUrl: friend.profileImageUrl,
            });
          }}
          disabled={isSendingBattle}
          className="h-7 gap-1 px-2 text-xs"
        >
          <Swords className="h-3.5 w-3.5" />
          대전
        </Button>
      </div>
    );
  }

  if (friendStatus === "REQUESTED" && friendRequestId != null) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          cancel(friendRequestId);
        }}
        disabled={isCancelling}
        className="h-7 px-2 text-xs"
      >
        취소
      </Button>
    );
  }

  if (friendStatus === "PENDING" && friendRequestId != null) {
    return (
      <div className="flex shrink-0 gap-1">
        <Button
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            if (!isLoggedIn) return requireLogin();
            accept(friendRequestId);
          }}
          disabled={isAccepting}
          className="h-7 px-2 text-xs"
        >
          수락
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            if (!isLoggedIn) return requireLogin();
            reject(friendRequestId);
          }}
          disabled={isRejecting}
          className="h-7 px-2 text-xs"
        >
          거절
        </Button>
      </div>
    );
  }

  if (!friendStatus || friendStatus === "NONE") {
    return (
      <Button
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          if (!isLoggedIn) return requireLogin();
          sendRequest(userId);
        }}
        disabled={isSending}
        className="h-7 w-7"
      >
        <UserPlus className="h-3.5 w-3.5" />
      </Button>
    );
  }

  return null;
}

export default FriendActionButtons;
