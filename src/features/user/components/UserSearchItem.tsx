import { Link } from "react-router-dom";
import { CircleUserRound, Swords, UserCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { usePresence } from "@/features/presence/usePresence";
import { presenceColorClass } from "@/features/presence/presenceColorClass";
import type { UserSearchResponse } from "@/service/userService";

function UserSearchItem({ user }: { user: UserSearchResponse }) {
  const { ref, presenceStatus } = usePresence(user.userId);
  const status = presenceStatus ?? user.presenceStatus;

  return (
    <li ref={ref}>
      <Link
        to={`/users/${user.userId}`}
        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent"
      >
        <div className="relative">
          <Avatar className="h-10 w-10">
            {user.profileImageUrl && <AvatarImage src={user.profileImageUrl} alt={user.nickname} />}
            <AvatarFallback>
              <CircleUserRound className="h-5 w-5 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${presenceColorClass(status)}`}
          />
        </div>
        <div className="flex flex-1 items-center justify-between">
          <span className="text-sm font-medium">{user.nickname}</span>
          <div className="flex items-center gap-1.5">
            {status === "IN_BATTLE" && (
              <Swords className="h-4 w-4 text-amber-500" />
            )}
            {user.friendStatus === "FRIEND" && (
              <Badge variant="secondary" className="gap-1">
                <UserCheck className="h-3 w-3" />
                친구
              </Badge>
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
