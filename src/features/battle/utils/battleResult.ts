import type { BattleResult } from "@/service/battleHistoryService";

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
