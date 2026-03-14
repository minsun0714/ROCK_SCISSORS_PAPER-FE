import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import type { BattleRoundHistoryResponse } from "@/service/battleHistoryService";
import { deriveResult, moveEmoji, resultBadge } from "@/features/battle/utils/battleResult";

type BattleHistoryItemProps = {
  round: BattleRoundHistoryResponse;
};

function BattleHistoryItem({ round }: BattleHistoryItemProps) {
  const result = deriveResult(round);
  const badge = resultBadge[result];
  const myEmoji = round.myMove ? moveEmoji[round.myMove] : "❓";
  const opponentEmoji = round.opponentMove ? moveEmoji[round.opponentMove] : "❓";

  return (
    <li className="flex flex-col gap-1.5 bg-card px-4 py-3 sm:flex-row sm:items-center sm:gap-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={round.profileImageUrl ?? undefined} />
          <AvatarFallback className="text-xs">
            {round.nickname?.charAt(0) ?? "?"}
          </AvatarFallback>
        </Avatar>
        <span className="flex-1 truncate text-sm font-medium">{round.nickname}</span>
        <span className="text-xs text-muted-foreground sm:hidden">
          {new Date(round.playedAt).toLocaleDateString("ko-KR")}
        </span>
      </div>
      <div className="flex items-center gap-2 pl-12 sm:ml-auto sm:pl-0">
        <span className="text-lg" title={`${round.myMove ?? "?"} vs ${round.opponentMove ?? "?"}`}>
          {myEmoji} vs {opponentEmoji}
        </span>
        <Badge variant={badge.variant}>{badge.label}</Badge>
        <span className="hidden text-xs text-muted-foreground sm:inline">
          {new Date(round.playedAt).toLocaleDateString("ko-KR")}
        </span>
      </div>
    </li>
  );
}

export default BattleHistoryItem;
