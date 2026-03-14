import { useCallback, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import type { BattleResult, BattleRoundHistoryResponse, Paginated } from "@/service/battleHistoryService";
import type { InfiniteData } from "@tanstack/react-query";
import BattleHistoryItem from "@/features/battle/components/BattleHistoryItem";
import BattleResultFilter from "@/features/battle/components/BattleResultFilter";

type BattleHistorySectionProps = {
  data: InfiniteData<Paginated<BattleRoundHistoryResponse>> | undefined;
  isPending: boolean;
  isError: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  keyword: string;
  onKeywordChange: (value: string) => void;
  resultFilter: BattleResult | undefined;
  onResultFilterChange: (value: BattleResult | undefined) => void;
};

function BattleHistorySection({
  data,
  isPending,
  isError,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  keyword,
  onKeywordChange,
  resultFilter,
  onResultFilterChange,
}: BattleHistorySectionProps) {
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

  const rounds = data?.pages.flatMap((page) => page.content) ?? [];

  return (
    <section className="w-full">
      <h2 className="mb-3 text-lg font-semibold">대전 기록</h2>

      <div className="mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="상대 닉네임 검색"
            className="pl-9"
          />
        </div>
      </div>

      <div className="mb-3">
        <BattleResultFilter value={resultFilter} onChange={onResultFilterChange} />
      </div>

      {isPending && (
        <p className="text-center text-sm text-muted-foreground">불러오는 중...</p>
      )}

      {isError && (
        <p className="text-center text-sm text-destructive">대전 기록을 불러오지 못했습니다.</p>
      )}

      {!isPending && !isError && rounds.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">대전 기록이 없습니다.</p>
      )}

      {rounds.length > 0 && (
        <div className="custom-scrollbar max-h-96 overflow-y-auto rounded-lg border">
          <ul className="divide-y">
            {rounds.map((round, idx) => (
              <BattleHistoryItem key={`${round.opponentId}-${idx}`} round={round} />
            ))}
          </ul>

          {isFetchingNextPage && (
            <p className="py-3 text-center text-sm text-muted-foreground">더 불러오는 중...</p>
          )}

          <div ref={bottomRef} />
        </div>
      )}
    </section>
  );
}

export default BattleHistorySection;
