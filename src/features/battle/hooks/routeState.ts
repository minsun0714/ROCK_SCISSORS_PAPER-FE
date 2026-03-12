import type { BattleParticipantPreview, BattleRouteState } from "@/features/battle/types";

export const toBattleRouteState = (
  role: BattleRouteState["role"],
  requestId: string | number | undefined,
  battleStatus: string | undefined,
  opponent?: BattleParticipantPreview,
): BattleRouteState => ({
  role,
  requestId,
  battleStatus: battleStatus ?? null,
  opponent,
});