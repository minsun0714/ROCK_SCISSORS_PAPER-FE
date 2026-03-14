import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import type { BattleRoundHistoryResponse } from "@/service/battleHistoryService";
import { moveEmoji, resultBadge } from "@/features/battle/utils/battleResult";

type BattleHistoryItemProps = {
  round: BattleRoundHistoryResponse;
};

function BattleHistoryItem({ round }: BattleHistoryItemProps) {
  const badge = resultBadge[round.battleResult];
  const myEmoji = round.myMove ? moveEmoji[round.myMove] : "❓";
  const opponentEmoji = round.opponentMove ? moveEmoji[round.opponentMove] : "❓";
  const date = new Date(round.playedAt).toLocaleDateString("ko-KR");

  return (
    <li className="flex items-center gap-3 bg-card px-4 py-3">
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarImage src={round.profileImageUrl ?? undefined} />
        <AvatarFallback className="text-xs">
          {round.nickname?.charAt(0) ?? "?"}
        </AvatarFallback>
      </Avatar>

      {/* 모바일: 2줄 */}
      <div className="flex flex-1 flex-col gap-1 sm:hidden">
        <div className="flex items-center justify-between">
          <span className="truncate text-sm font-medium">{round.nickname}</span>
          <span className="shrink-0 text-xs text-muted-foreground">{date}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base">
            {myEmoji} vs {opponentEmoji}
          </span>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
      </div>

      {/* 데스크톱: 1줄 */}
      <span className="hidden flex-1 truncate text-sm font-medium sm:inline">{round.nickname}</span>
      <span className="hidden text-lg sm:inline" title={`${round.myMove ?? "?"} vs ${round.opponentMove ?? "?"}`}>
        {myEmoji} vs {opponentEmoji}
      </span>
      <Badge className="hidden sm:inline-flex" variant={badge.variant}>{badge.label}</Badge>
      <span className="hidden text-xs text-muted-foreground sm:inline">{date}</span>
    </li>
  );
}

export default BattleHistoryItem;
