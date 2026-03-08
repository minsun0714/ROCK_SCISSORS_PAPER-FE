import { useCallback, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import FriendListItem from "@/features/friend/components/FriendListItem";
import type { FriendResponse } from "@/service/friendService";

type FriendListSectionProps = {
  friends: FriendResponse[];
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isPending: boolean;
  isError: boolean;
  invalidateKey: string;
  title?: string;
  emptyMessage?: string;
};

function FriendListSection({
  friends,
  keyword,
  onKeywordChange,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isPending,
  isError,
  invalidateKey,
  title,
  emptyMessage = "목록이 비어있습니다.",
}: FriendListSectionProps) {
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
    <div className="w-full max-w-xl">
      {title && <h2 className="mb-3 text-lg font-semibold">{title}</h2>}

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="검색"
          className="pl-9"
        />
      </div>

      {isPending && <p className="text-center text-sm text-muted-foreground">불러오는 중...</p>}

      {isError && <p className="text-center text-sm text-destructive">목록을 불러오지 못했습니다.</p>}

      {!isPending && !isError && friends.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">{emptyMessage}</p>
      )}

      {friends.length > 0 && (
        <ul className="divide-y overflow-hidden rounded-lg border">
          {friends.map((friend) => (
            <FriendListItem key={friend.userId} friend={friend} invalidateKey={invalidateKey} />
          ))}
        </ul>
      )}

      {isFetchingNextPage && (
        <p className="mt-3 text-center text-sm text-muted-foreground">더 불러오는 중...</p>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default FriendListSection;
