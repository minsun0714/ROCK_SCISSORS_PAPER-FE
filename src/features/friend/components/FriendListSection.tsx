import { useCallback, useEffect, useRef } from "react";
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
      {title && <h2 className="mb-3 text-lg font-semibold text-slate-900">{title}</h2>}

      <input
        type="text"
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        placeholder="친구 검색"
        className="mb-3 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />

      {isPending && <p className="text-center text-sm text-slate-500">불러오는 중...</p>}

      {isError && <p className="text-center text-sm text-red-500">목록을 불러오지 못했습니다.</p>}

      {!isPending && !isError && friends.length === 0 && (
        <p className="text-center text-sm text-slate-500">{emptyMessage}</p>
      )}

      {friends.length > 0 && (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200">
          {friends.map((friend) => (
            <FriendListItem key={friend.userId} friend={friend} invalidateKey={invalidateKey} />
          ))}
        </ul>
      )}

      {isFetchingNextPage && (
        <p className="mt-2 text-center text-sm text-slate-500">더 불러오는 중...</p>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default FriendListSection;
