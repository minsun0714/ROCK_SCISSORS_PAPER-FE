import { useLoginModal } from "@/features/auth/LoginModalContext";
import type { FriendStatus } from "@/service/userService";
import {
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useSendFriendRequestMutation,
} from "@/features/friend/hooks";

type FriendStatusSectionProps = {
  userId: string;
  targetUserId: number;
  friendStatus: FriendStatus;
  friendRequestId?: number | null;
};

function FriendStatusSection({
  userId,
  targetUserId,
  friendStatus,
  friendRequestId,
}: FriendStatusSectionProps) {
  const { isLoggedIn, requireLogin } = useLoginModal();
  const { mutate: sendRequest, isPending: isSending } = useSendFriendRequestMutation(userId);
  const { mutate: accept, isPending: isAccepting } = useAcceptFriendRequestMutation(userId);
  const { mutate: reject, isPending: isRejecting } = useRejectFriendRequestMutation(userId);


  return (
    <section className="w-full max-w-xl p-4 bg-white border shadow-sm rounded-xl border-slate-200">
      {friendStatus === "NONE" && (
        <button
          type="button"
          onClick={() => { if (!isLoggedIn) return requireLogin(); sendRequest(targetUserId); }}
          disabled={isSending}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:bg-indigo-300"
        >
          {isSending ? "요청 중..." : "친구 신청"}
        </button>
      )}

      {friendStatus === "PENDING" && friendRequestId != null && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => { if (!isLoggedIn) return requireLogin(); accept(friendRequestId); }}
            disabled={isAccepting}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-500 disabled:bg-green-300"
          >
            {isAccepting ? "수락 중..." : "수락"}
          </button>
          <button
            type="button"
            onClick={() => { if (!isLoggedIn) return requireLogin(); reject(friendRequestId); }}
            disabled={isRejecting}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500 disabled:bg-red-300"
          >
            {isRejecting ? "거절 중..." : "거절"}
          </button>
        </div>
      )}

      {friendStatus === "REQUESTED" && (
        <p className="text-sm text-center text-slate-500">요청 대기중</p>
      )}

      {friendStatus === "FRIEND" && (
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700 ring-1 ring-green-200">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            친구
          </span>
          <button
            type="button"
            className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500"
          >
            대전 신청
          </button>
        </div>
      )}
    </section>
  );
}

export default FriendStatusSection;
