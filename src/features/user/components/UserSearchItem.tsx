import { Link } from "react-router-dom";
import { CircleUserRound, UserCheck, Swords } from "lucide-react";
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
        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50"
      >
        <div className="relative">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.nickname}
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
          <span className="text-sm font-medium text-slate-900">
            {user.nickname}
          </span>
          <div className="flex items-center gap-1.5">
            {status === "IN_BATTLE" && (
              <Swords className="h-4 w-4 text-orange-500" />
            )}
            {user.friendStatus === "FRIEND" && (
              <UserCheck className="h-4 w-4 text-green-600" />
            )}
            {user.friendStatus === "REQUESTED" && (
              <span className="text-xs text-slate-400">요청됨</span>
            )}
            {user.friendStatus === "PENDING" && (
              <span className="text-xs text-amber-500">수락 대기</span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}

export default UserSearchItem;
