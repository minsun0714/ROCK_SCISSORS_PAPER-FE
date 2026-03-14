import { useCallback, useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import UserSearchItem from "@/features/user/components/UserSearchItem";
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
    <main className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-3xl flex-col items-center px-4 py-10">
      <h1 className="mb-8 font-display text-4xl tracking-tight text-primary">가위바위보 게임</h1>

      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="유저 검색 (2글자 이상)"
          className="pl-9"
        />
      </div>

      <div className="mt-6 w-full">
        {isPending && <p className="text-center text-sm text-muted-foreground">검색 중...</p>}

        {isError && (
          <p className="text-center text-sm text-destructive">검색에 실패했습니다.</p>
        )}

        {!isPending && !isError && users.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">검색 결과가 없습니다.</p>
        )}

        {users.length > 0 && (
          <ul className="divide-y overflow-hidden rounded-lg border">
            {users.map((user) => (
              <UserSearchItem key={user.userId} user={user} />
            ))}
          </ul>
        )}

        {isFetchingNextPage && (
          <p className="mt-3 text-center text-sm text-muted-foreground">더 불러오는 중...</p>
        )}

        <div ref={bottomRef} />
      </div>
    </main>
  );
}

export default Home;
