import { Link } from "react-router-dom";
import { Swords, UserCheck, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLoginModal } from "@/features/auth/LoginModalContext";
import { useSendBattleRequestMutation } from "@/features/battle/hooks";
import { usePresence } from "@/features/presence/usePresence";
import { presenceColorClass } from "@/features/presence/presenceColorClass";
import type { UserSearchResponse } from "@/service/userService";

function UserSearchItem({ user }: { user: UserSearchResponse }) {
  const { ref, presenceStatus } = usePresence(user.userId);
  const status = presenceStatus ?? user.presenceStatus;
  const { isLoggedIn, requireLogin } = useLoginModal();
  const { mutate: sendBattle, isPending: isSendingBattle } = useSendBattleRequestMutation();

  return (
    <li ref={ref}>
      <Link
        to={`/users/${user.userId}`}
        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent"
      >
        <div className="relative">
          <Avatar className="w-10 h-10">
            {user.profileImageUrl && <AvatarImage src={user.profileImageUrl} alt={user.nickname} />}
            <AvatarFallback>
              <UserRound className="w-5 h-5 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${presenceColorClass(status)}`}
          />
        </div>
        <div className="flex items-center justify-between flex-1">
          <span className="text-sm font-medium">{user.nickname}</span>
          <div className="flex items-center gap-1.5">
            {status === "IN_BATTLE" && (
              <Swords className="w-4 h-4 text-amber-500" />
            )}
            {user.friendStatus === "FRIEND" && (
              <>
                <Badge variant="secondary" className="gap-1">
                  <UserCheck className="w-3 h-3" />
                  친구
                </Badge>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isLoggedIn) return requireLogin();
                    sendBattle(user.userId);
                  }}
                  disabled={isSendingBattle}
                  className="gap-1 px-2 text-xs h-7"
                >
                  <Swords className="h-3.5 w-3.5" />
                  대전
                </Button>
              </>
            )}
            {user.friendStatus === "REQUESTED" && (
              <Badge variant="outline" className="text-muted-foreground">요청됨</Badge>
            )}
            {user.friendStatus === "PENDING" && (
              <Badge variant="outline" className="text-muted-foreground">수락 대기</Badge>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}

export default UserSearchItem;
