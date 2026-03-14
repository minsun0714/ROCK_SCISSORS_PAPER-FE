import type { BattleResult, BattleRoundHistoryResponse } from "@/service/battleHistoryService";

const WIN_MAP: Record<string, string> = {
  ROCK: "SCISSORS",
  SCISSORS: "PAPER",
  PAPER: "ROCK",
};

export const deriveResult = (round: BattleRoundHistoryResponse): BattleResult => {
  if (!round.myMove && !round.opponentMove) return "DRAW";
  if (!round.opponentMove) return "WIN";
  if (!round.myMove) return "LOSE";
  if (round.myMove === round.opponentMove) return "DRAW";
  if (WIN_MAP[round.myMove] === round.opponentMove) return "WIN";
  return "LOSE";
};

export const moveLabel: Record<string, string> = {
  ROCK: "바위",
  SCISSORS: "가위",
  PAPER: "보",
};

export const moveEmoji: Record<string, string> = {
  ROCK: "✊",
  SCISSORS: "✌️",
  PAPER: "🖐️",
};

export const resultBadge: Record<BattleResult, { label: string; variant: "default" | "destructive" | "secondary" }> = {
  WIN: { label: "승", variant: "default" },
  LOSE: { label: "패", variant: "destructive" },
  DRAW: { label: "무", variant: "secondary" },
};
