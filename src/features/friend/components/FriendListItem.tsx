import { Swords, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import FriendActionButtons from "@/features/friend/components/FriendActionButtons";
import { usePresence } from "@/features/presence/hooks";
import { presenceColorClass } from "@/features/presence/presenceColorClass";
import type { FriendResponse } from "@/service/friendService";

function FriendListItem({
  friend,
  invalidateKey,
}: {
  friend: FriendResponse;
  invalidateKey: string;
}) {
  const { ref, presenceStatus } = usePresence<HTMLLIElement>(friend.userId);
  const status = presenceStatus ?? friend.presenceStatus;

  return (
    <li ref={ref}>
      <Link
        to={`/users/${friend.userId}`}
        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent"
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
            <FriendActionButtons friend={friend} invalidateKey={invalidateKey} />
          </div>
        </div>
      </Link>
    </li>
  );
}

export default FriendListItem;
