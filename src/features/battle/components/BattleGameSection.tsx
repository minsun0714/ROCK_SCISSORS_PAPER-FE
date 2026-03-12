import { RotateCcw } from "lucide-react";
import type { Move } from "@/features/battle/hooks/useBattleWebSocket";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

type BattleGameSectionProps = {
  phase: string;
  myMove: Move | null;
  roundResult: {
    myMove?: Move;
    opponentMove?: Move;
    result?: string;
    roundNumber?: number;
  } | null;
  moveTimer: number | null;
  onSelectMove: (move: Move) => void;
  onRetry: () => void;
};

const MOVE_TIMEOUT = 30;

const MOVES: { value: Move; label: string; icon: React.ReactNode }[] = [
  {
    value: "ROCK",
    label: "바위",
    icon: <span className="text-4xl">✊</span>,
  },
  {
    value: "SCISSORS",
    label: "가위",
    icon: <span className="text-4xl">✌️</span>,
  },
  {
    value: "PAPER",
    label: "보",
    icon: <span className="text-4xl">🖐️</span>,
  },
];

const moveEmoji: Record<string, string> = {
  ROCK: "✊",
  SCISSORS: "✌️",
  PAPER: "🖐️",
};

const resultLabel: Record<string, { text: string; color: string }> = {
  WIN: { text: "승리!", color: "text-emerald-600" },
  LOSE: { text: "패배", color: "text-red-500" },
  DRAW: { text: "무승부", color: "text-amber-500" },
};

function BattleGameSection({
  phase,
  myMove,
  roundResult,
  moveTimer,
  onSelectMove,
  onRetry,
}: BattleGameSectionProps) {
  return (
    <Card className="border border-white/60 bg-white/80 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="font-display text-2xl tracking-tight text-slate-900">
          {phase === "waiting" && "상대방을 기다리는 중..."}
          {phase === "playing" && "손 모양을 선택하세요!"}
          {phase === "result" &&
            `${roundResult?.roundNumber ? `라운드 ${roundResult.roundNumber} ` : ""}결과`}
          {phase === "connecting" && "연결 중..."}
          {phase === "closed" && "상대방이 퇴장했습니다"}
          {phase === "disconnected" && "연결이 끊어졌습니다"}
        </CardTitle>

        {moveTimer != null && (phase === "playing" || phase === "waiting") && (
          <div className="mx-auto mt-3 flex flex-col items-center gap-2">
            <p
              className={`font-display text-3xl tabular-nums ${moveTimer <= 10 ? "text-red-500" : "text-slate-900"}`}
            >
              {moveTimer}초
            </p>
            <div className="h-1.5 w-36 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${moveTimer <= 10 ? "bg-red-500" : "bg-primary"}`}
                style={{ width: `${(moveTimer / MOVE_TIMEOUT) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {phase === "result" && roundResult ? (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <span className="text-6xl">
                  {moveEmoji[roundResult.myMove ?? ""] ?? "❓"}
                </span>
                <p className="text-sm font-medium text-slate-600">나</p>
              </div>

              <span className="font-display text-2xl text-slate-400">VS</span>

              <div className="flex flex-col items-center gap-2">
                <span className="text-6xl">
                  {moveEmoji[roundResult.opponentMove ?? ""] ?? "❓"}
                </span>
                <p className="text-sm font-medium text-slate-600">상대</p>
              </div>
            </div>

            {roundResult.result && (
              <p
                className={`font-display text-3xl ${resultLabel[roundResult.result]?.color ?? "text-slate-900"}`}
              >
                {resultLabel[roundResult.result]?.text ?? roundResult.result}
              </p>
            )}

            <Button onClick={onRetry} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              다시 하기
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            {phase === "waiting" && myMove && (
              <p className="text-sm text-slate-500">
                선택: <span className="text-xl">{moveEmoji[myMove]}</span>
              </p>
            )}

            <div className="flex justify-center gap-4">
              {MOVES.map(({ value, label, icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onSelectMove(value)}
                  disabled={phase !== "playing"}
                  className={`flex h-28 w-28 flex-col items-center justify-center gap-2 rounded-2xl border-2 transition-all ${
                    myMove === value
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-slate-200 bg-white hover:border-primary/50 hover:shadow-md"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {icon}
                  <span className="text-sm font-medium text-slate-700">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BattleGameSection;
