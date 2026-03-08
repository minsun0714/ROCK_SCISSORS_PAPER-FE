import { Link } from "react-router-dom";
import { CircleUserRound, Swords } from "lucide-react";
import { usePresence } from "@/features/presence/usePresence";
import { presenceColorClass } from "@/features/presence/presenceColorClass";
import FriendActionButtons from "@/features/friend/components/FriendActionButtons";
import type { FriendResponse } from "@/service/friendService";

function FriendListItem({
  friend,
  invalidateKey,
}: {
  friend: FriendResponse;
  invalidateKey: string;
}) {
  const { ref, presenceStatus } = usePresence(friend.userId);
  const status = presenceStatus ?? friend.presenceStatus;

  return (
    <li ref={ref}>
      <Link
        to={`/users/${friend.userId}`}
        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50"
      >
        <div className="relative">
          {friend.profileImageUrl ? (
            <img
              src={friend.profileImageUrl}
              alt={friend.nickname}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <CircleUserRound className="h-10 w-10 text-slate-400" />
          )}
          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${presenceColorClass(status)}`}
          />
        </div>
        <div className="flex flex-1 items-center justify-between">
          <span className="text-sm font-medium text-slate-900">{friend.nickname}</span>
          <div className="flex items-center gap-1.5">
            {status === "IN_BATTLE" && (
              <Swords className="h-4 w-4 text-orange-500" />
            )}
            <FriendActionButtons friend={friend} invalidateKey={invalidateKey} />
          </div>
        </div>
      </Link>
    </li>
  );
}

export default FriendListItem;
