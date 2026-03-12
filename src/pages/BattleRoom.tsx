import { toast } from "sonner";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BattleGameSection from "@/features/battle/components/BattleGameSection";
import BattleHeroSection from "@/features/battle/components/BattleHeroSection";
import BattleLobbyHeader from "@/features/battle/components/BattleLobbyHeader";
import BattleSidebar from "@/features/battle/components/BattleSidebar";
import { useBattleWebSocket } from "@/features/battle/hooks/useBattleWebSocket";
import type { BattleRouteState } from "@/features/battle/types";
import { useMyProfileQuery } from "@/features/user/hooks";
import { Card, CardContent } from "@/shared/components/ui/card";

const waitingSteps = ["대전방 생성 완료", "상대에게 초대 알림 전송", "상대 입장 대기"];

const joinedSteps = ["대전방 생성 완료", "초대 수락 완료", "양쪽 플레이어 입장"];

function BattleRoom() {
  const { battleId } = useParams<{ battleId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: myProfile } = useMyProfileQuery({ throwOnError: false });
  const routeState = location.state as BattleRouteState | null;
  const role = routeState?.role;
  const opponent = routeState?.opponent;
  const pageTitle = role === "invitee" ? "대전방에 입장했습니다" : "대전방이 열렸습니다";
  const pageDescription =
    role === "invitee"
      ? `${opponent?.nickname ?? "상대방"}님과 바로 대기 상태에 들어갔습니다.`
      : `${opponent?.nickname ?? "상대방"}님의 수락을 기다리는 중입니다.`;
  const statusLabel = role === "invitee" ? "양측 준비 완료" : "수락 대기 중";
  const steps = role === "invitee" ? joinedSteps : waitingSteps;

  const { phase, myMove, roundResult, sendMove, sendRetry } =
    useBattleWebSocket(battleId, myProfile?.userId);

  const handleCopyRoomLink = async () => {
    if (!battleId) {
      return;
    }

    try {
      await navigator.clipboard.writeText(`${window.location.origin}/battles/${battleId}`);
      toast.success("배틀 링크를 복사했습니다.");
    } catch {
      toast.error("링크 복사에 실패했습니다.");
    }
  };

  const handleCancelBattle = () => {
    navigate("/");
  };

  return (
    <main className="relative isolate min-h-[calc(100vh-56px)] overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.18),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(244,114,182,0.18),_transparent_25%),linear-gradient(180deg,_#fff7fb_0%,_#fffdfa_48%,_#ffffff_100%)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-4rem] top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-3rem] top-32 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="absolute bottom-[-4rem] left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-rose-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <Card className="border border-white/60 bg-white/80 shadow-[0_30px_80px_-40px_rgba(76,29,149,0.35)] backdrop-blur">
          <BattleLobbyHeader
            battleId={battleId}
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            statusLabel={statusLabel}
          />

          <CardContent className="grid gap-4 lg:grid-cols-[1.3fr_0.8fr]">
            <div className="flex flex-col gap-4">
              <BattleHeroSection
                role={role}
                myProfileImageUrl={myProfile?.profileImageUrl}
                opponent={opponent}
              />

              <BattleGameSection
                phase={phase}
                myMove={myMove}
                roundResult={roundResult}
                onSelectMove={sendMove}
                onRetry={sendRetry}
              />
            </div>

            <BattleSidebar
              role={role}
              steps={steps}
              canCancelBattle
              isCancellingBattleRequest={false}
              onCopyRoomLink={handleCopyRoomLink}
              onCancelBattle={handleCancelBattle}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default BattleRoom;
