import { Trophy, XCircle, Minus, Swords } from "lucide-react";
import type { BattleRoundStatResponse } from "@/service/battleHistoryService";

type BattleStatCardProps = {
  data: BattleRoundStatResponse | undefined;
  isPending: boolean;
};

function BattleStatCard({ data, isPending }: BattleStatCardProps) {
  if (isPending) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        전적을 불러오는 중...
      </p>
    );
  }

  if (!data) return null;

  const stats = [
    { label: "전체", value: data.totalCount, icon: Swords, color: "text-slate-700" },
    { label: "승", value: data.winCount, icon: Trophy, color: "text-emerald-600" },
    { label: "패", value: data.loseCount, icon: XCircle, color: "text-rose-500" },
    { label: "무", value: data.drawCount, icon: Minus, color: "text-amber-500" },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 rounded-lg bg-muted/50 py-3">
            <Icon className={`h-5 w-5 ${color}`} />
            <span className={`font-display text-2xl ${color}`}>{value}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
      {data.totalCount > 0 && (
        <p className="mt-2 text-center text-sm text-muted-foreground">
          승률 {Math.round(data.winRate * 100)}%
        </p>
      )}
    </div>
  );
}

export default BattleStatCard;
