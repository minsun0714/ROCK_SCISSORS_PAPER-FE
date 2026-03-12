import { Swords, UserRound } from "lucide-react";
import type { BattleRouteState } from "@/features/battle/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";

type BattleHeroSectionProps = {
  role: BattleRouteState["role"] | undefined;
  myProfileImageUrl?: string | null;
  opponent?: BattleRouteState["opponent"];
};

function BattleHeroSection({ role, myProfileImageUrl, opponent }: BattleHeroSectionProps) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(91,33,182,0.96),rgba(190,24,93,0.82))] p-5 text-white shadow-xl shadow-primary/15 sm:p-6">
      <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <article className="rounded-[1.5rem] bg-white/12 p-4 backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-3">
            <Avatar className="h-14 w-14 border border-white/30">
              <AvatarImage src={myProfileImageUrl ?? undefined} />
              <AvatarFallback className="bg-white/15 text-white">
                <UserRound className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/65">you</p>
              <p className="font-display text-2xl">플레이어 1</p>
            </div>
          </div>
          <p className="text-sm leading-6 text-white/80">
            손 모양을 고를 준비를 마쳤습니다. 상대가 들어오면 같은 방에서 바로 대전을 이어갈 수
            있습니다.
          </p>
        </article>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-white/10 shadow-lg shadow-black/10">
          <Swords className="h-7 w-7" />
        </div>

        <article className="rounded-[1.5rem] border border-dashed border-white/30 bg-black/10 p-4 backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-3">
            <Avatar className="h-14 w-14 border border-white/20">
              <AvatarImage src={opponent?.profileImageUrl ?? undefined} />
              <AvatarFallback className="bg-white/15 text-white">
                <UserRound className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/65">opponent</p>
              <p className="font-display text-2xl">{opponent?.nickname ?? "대기 중"}</p>
            </div>
          </div>
          <p className="text-sm leading-6 text-white/80">
            {role === "invitee"
              ? "상대와 같은 대전방에 입장했습니다. 이제 실시간 선택 UI를 연결하면 바로 게임을 시작할 수 있습니다."
              : "알림에서 수락 버튼을 누르면 이 방으로 바로 입장합니다. 현재 단계에서는 로비 입장 흐름까지 연결되어 있습니다."}
          </p>
        </article>
      </div>
    </section>
  );
}

export default BattleHeroSection;
