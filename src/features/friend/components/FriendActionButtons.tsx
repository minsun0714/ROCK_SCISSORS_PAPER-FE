import { UserCheck, UserPlus } from "lucide-react";
import { useLoginModal } from "@/features/auth/LoginModalContext";
import { useMyProfileQuery } from "@/features/user/hooks";
import type { FriendResponse } from "@/service/friendService";
import {
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
  useRejectFriendRequestMutation,
  useSendFriendRequestMutation,
} from "@/features/friend/hooks";

function FriendActionButtons({
  friend,
  invalidateKey,
}: {
  friend: FriendResponse;
  invalidateKey: string;
}) {
  const { isLoggedIn, requireLogin } = useLoginModal();
  const { data: myProfile } = useMyProfileQuery();
  const { mutate: sendRequest, isPending: isSending } =
    useSendFriendRequestMutation(invalidateKey);
  const { mutate: accept, isPending: isAccepting } =
    useAcceptFriendRequestMutation(invalidateKey);
  const { mutate: reject, isPending: isRejecting } =
    useRejectFriendRequestMutation(invalidateKey);
  const { mutate: cancel, isPending: isCancelling } =
    useCancelFriendRequestMutation();

  const { friendInfo, userId } = friend;
  const friendStatus = friendInfo?.status;
  const friendRequestId = friendInfo?.friendRequestId;

  if (myProfile?.userId === userId) {
    return null;
  }

  if (friendStatus === "FRIEND") {
    return <UserCheck className="h-4 w-4 shrink-0 text-green-600" />;
  }

  if (friendStatus === "REQUESTED" && friendRequestId != null) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          cancel(friendRequestId);
        }}
        disabled={isCancelling}
        className="shrink-0 rounded bg-slate-500 px-2 py-0.5 text-xs text-white hover:bg-slate-400 disabled:opacity-50"
      >
        취소
      </button>
    );
  }

  if (friendStatus === "PENDING" && friendRequestId != null) {
    return (
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (!isLoggedIn) return requireLogin();
            accept(friendRequestId);
          }}
          disabled={isAccepting}
          className="rounded bg-green-600 px-2 py-0.5 text-xs text-white hover:bg-green-500 disabled:opacity-50"
        >
          수락
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (!isLoggedIn) return requireLogin();
            reject(friendRequestId);
          }}
          disabled={isRejecting}
          className="rounded bg-red-600 px-2 py-0.5 text-xs text-white hover:bg-red-500 disabled:opacity-50"
        >
          거절
        </button>
      </div>
    );
  }

  if (!friendStatus || friendStatus === "NONE") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          if (!isLoggedIn) return requireLogin();
          sendRequest(userId);
        }}
        disabled={isSending}
        className="shrink-0 rounded bg-indigo-600 p-1 text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        <UserPlus className="h-3.5 w-3.5" />
      </button>
    );
  }

  return null;
}

export default FriendActionButtons;
