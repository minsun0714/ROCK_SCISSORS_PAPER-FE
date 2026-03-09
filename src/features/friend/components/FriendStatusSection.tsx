import { Swords } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLoginModal } from "@/features/auth/LoginModalContext";
import { useSendBattleRequestMutation } from "@/features/battle/hooks";
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
  const { mutate: sendBattle, isPending: isSendingBattle } = useSendBattleRequestMutation();

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        {friendStatus === "NONE" && (
          <Button
            className="w-full"
            onClick={() => { if (!isLoggedIn) return requireLogin(); sendRequest(targetUserId); }}
            disabled={isSending}
          >
            {isSending ? "요청 중..." : "친구 신청"}
          </Button>
        )}

        {friendStatus === "PENDING" && friendRequestId != null && (
          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={() => { if (!isLoggedIn) return requireLogin(); accept(friendRequestId); }}
              disabled={isAccepting}
            >
              {isAccepting ? "수락 중..." : "수락"}
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => { if (!isLoggedIn) return requireLogin(); reject(friendRequestId); }}
              disabled={isRejecting}
            >
              {isRejecting ? "거절 중..." : "거절"}
            </Button>
          </div>
        )}

        {friendStatus === "REQUESTED" && (
          <p className="text-center text-sm text-muted-foreground">요청 대기중</p>
        )}

        {friendStatus === "FRIEND" && (
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              친구
            </Badge>
            <Button
              variant="secondary"
              className="gap-1.5"
              onClick={() => { if (!isLoggedIn) return requireLogin(); sendBattle(targetUserId); }}
              disabled={isSendingBattle}
            >
              <Swords className="h-4 w-4" />
              {isSendingBattle ? "신청 중..." : "대전 신청"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default FriendStatusSection;
