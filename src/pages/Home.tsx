import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useUserSearchQuery } from "@/features/user/hooks";

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
              <li key={user.userId}>
                <Link
                  to={`/users/${user.userId}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50"
                >
                  <img
                    src={user.profileImageUrl ?? "/default-profile.png"}
                    alt={user.nickname}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-slate-900">
                    {user.nickname}
                  </span>
                </Link>
              </li>
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
