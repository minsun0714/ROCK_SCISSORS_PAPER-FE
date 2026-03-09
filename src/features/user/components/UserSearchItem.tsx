import { Swords, UserCheck, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useLoginModal } from "@/features/auth/hooks";
import { useSendBattleRequestMutation } from "@/features/battle/hooks";
import { usePresence } from "@/features/presence/hooks";
import { presenceColorClass } from "@/features/presence/presenceColorClass";
import type { UserSearchResponse } from "@/service/userService";

function UserSearchItem({ user }: { user: UserSearchResponse }) {
  const { ref, presenceStatus } = usePresence<HTMLLIElement>(user.userId);
  const status = presenceStatus ?? user.presenceStatus;
  const { isLoggedIn, requireLogin } = useLoginModal();
  const { mutate: sendBattle, isPending: isSendingBattle } = useSendBattleRequestMutation();

  return (
    <li ref={ref} className="flex items-center">
      <Link
        to={`/users/${user.userId}`}
        className="flex flex-1 items-center gap-3 px-4 py-3 transition-colors hover:bg-accent"
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
          {status === "IN_BATTLE" && <Swords className="w-4 h-4 text-amber-500" />}
        </div>
      </Link>
      {user.friendStatus === "FRIEND" && (
        <>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-1.5 px-3">
            <Badge variant="secondary" className="gap-1">
              <UserCheck className="w-3 h-3" />
              친구
            </Badge>
            <Button
              size="sm"
              onClick={() => {
                if (!isLoggedIn) return requireLogin();
                sendBattle(user.userId);
              }}
              disabled={isSendingBattle}
              className="gap-1 px-2 text-xs h-7"
            >
              <Swords className="h-3.5 w-3.5" />
              대전 신청
            </Button>
          </div>
        </>
      )}
    </li>
  );
}

export default UserSearchItem;
