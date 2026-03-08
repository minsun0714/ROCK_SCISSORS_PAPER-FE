import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CircleUserRound, UserCheck, Swords } from "lucide-react";
import { usePresence } from "@/features/presence/usePresence";
import type { PresenceStatus } from "@/service/userService";
import type { UserSearchResponse } from "@/service/userService";
import { useUserSearchQuery } from "@/features/user/hooks";

const presenceColorClass = (status: PresenceStatus) => {
  switch (status) {
    case "ONLINE":
      return "bg-green-500";
    case "IN_BATTLE":
      return "bg-orange-500";
    case "OFFLINE":
      return "bg-slate-300";
  }
};

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

function Home() {
  const [keyword, setKeyword] = useState("");
  const { users, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } =
    useUserSearchQuery(keyword);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node) return;

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });

      observerRef.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-3xl flex-col items-center px-4 py-8">
      <h1 className="mb-6 text-4xl font-bold text-slate-900">가위바위보 게임</h1>

      <div className="w-full max-w-md">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="유저 검색 (2글자 이상)"
          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="mt-4 w-full max-w-md">
        {isPending && <p className="text-center text-sm text-slate-500">검색 중...</p>}

        {isError && (
          <p className="text-center text-sm text-red-500">검색에 실패했습니다.</p>
        )}

        {!isPending && !isError && users.length === 0 && (
          <p className="text-center text-sm text-slate-500">검색 결과가 없습니다.</p>
        )}

        {users.length > 0 && (
          <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200">
            {users.map((user) => (
              <UserSearchItem key={user.userId} user={user} />
            ))}
          </ul>
        )}

        {isFetchingNextPage && (
          <p className="mt-2 text-center text-sm text-slate-500">더 불러오는 중...</p>
        )}

        <div ref={bottomRef} />
      </div>
    </main>
  );
}

export default Home;
