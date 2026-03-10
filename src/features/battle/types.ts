export type BattleParticipantPreview = {
  userId?: number;
  nickname?: string;
  profileImageUrl?: string | null;
};

export type BattleRouteState = {
  role: "creator" | "invitee";
  requestId?: string | number;
  battleStatus?: string | null;
  opponent?: BattleParticipantPreview;
};
