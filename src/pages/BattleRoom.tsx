import { Copy, Home, X } from "lucide-react";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BattleGameSection from "@/features/battle/components/BattleGameSection";
import BattleHeroSection from "@/features/battle/components/BattleHeroSection";
import BattleLobbyHeader from "@/features/battle/components/BattleLobbyHeader";
import BattleProgressBar from "@/features/battle/components/BattleProgressBar";
import { useCancelBattleRequestMutation } from "@/features/battle/hooks/useCancelBattleRequestMutation";
import { useBattleWebSocket } from "@/features/battle/hooks/useBattleWebSocket";
import type { BattleRouteState } from "@/features/battle/types";
import { useMyProfileQuery } from "@/features/user/hooks";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

const LOBBY_TIMEOUT = 5 * 60;
const MOVE_TIMEOUT = 30;

const waitingSteps = ["대전방 생성", "초대 알림 전송", "상대 입장 대기"];

const joinedSteps = ["대전방 생성", "초대 수락", "양쪽 입장"];

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

function BattleRoom() {
  const { battleId } = useParams<{ battleId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: myProfile } = useMyProfileQuery({ throwOnError: false });
  const routeState = location.state as BattleRouteState | null;
  const role = routeState?.role;
  const requestId = routeState?.requestId;
  const opponent = routeState?.opponent;
  const steps = role === "invitee" ? joinedSteps : waitingSteps;
  const { mutate: cancelBattleRequest } = useCancelBattleRequestMutation();

  const { phase, myMove, roundResult, closedMessage, sendMove, sendRetry } =
    useBattleWebSocket(battleId, myProfile?.userId ?? undefined);

  const isLobby = phase === "connecting" || phase === "lobby";

  const opponentName = opponent?.nickname ?? "상대방";
  const pageTitle = isLobby
    ? role === "invitee"
      ? "대전방에 입장했습니다"
      : "대전방이 열렸습니다"
    : "대전이 시작되었습니다";
  const pageDescription = isLobby
    ? role === "invitee"
      ? `${opponentName}님과 바로 대기 상태에 들어갔습니다.`
      : `${opponentName}님의 수락을 기다리는 중입니다.`
    : `${opponentName}님과 대전 중입니다.`;
  const statusLabel = isLobby
    ? role === "invitee"
      ? "양측 준비 완료"
      : "수락 대기 중"
    : "대전 진행 중";

  const getInitialRemaining = useCallback(() => {
    if (!battleId) return LOBBY_TIMEOUT;
    const key = `battle_lobby_start_${battleId}`;
    const saved = sessionStorage.getItem(key);
    if (saved) {
      const elapsed = Math.floor((Date.now() - Number(saved)) / 1000);
      return Math.max(0, LOBBY_TIMEOUT - elapsed);
    }
    sessionStorage.setItem(key, String(Date.now()));
    return LOBBY_TIMEOUT;
  }, [battleId]);

  const [remainingSeconds, setRemainingSeconds] = useState(getInitialRemaining);

  useEffect(() => {
    if (!isLobby) {
      if (battleId) sessionStorage.removeItem(`battle_lobby_start_${battleId}`);
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLobby, battleId]);

  const handleTimeout = useCallback(() => {
    toast.error("대기 시간이 초과되었습니다.");
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (isLobby && remainingSeconds === 0) {
      handleTimeout();
    }
  }, [isLobby, remainingSeconds, handleTimeout]);

  const isMovePhase = phase === "playing" || phase === "waiting";
  const moveTimerKey = battleId ? `battle_move_start_${battleId}` : null;

  const getInitialMoveRemaining = useCallback(() => {
    if (!moveTimerKey) return MOVE_TIMEOUT;
    const saved = sessionStorage.getItem(moveTimerKey);
    if (saved) {
      const elapsed = Math.floor((Date.now() - Number(saved)) / 1000);
      return Math.max(0, MOVE_TIMEOUT - elapsed);
    }
    sessionStorage.setItem(moveTimerKey, String(Date.now()));
    return MOVE_TIMEOUT;
  }, [moveTimerKey]);

  const [moveSeconds, setMoveSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (!isMovePhase) {
      if (moveTimerKey) sessionStorage.removeItem(moveTimerKey);
      setMoveSeconds(null);
      return;
    }

    setMoveSeconds(getInitialMoveRemaining());

    const interval = setInterval(() => {
      setMoveSeconds((prev) => {
        if (prev == null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isMovePhase, moveTimerKey, getInitialMoveRemaining]);

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
    if (requestId != null && role === "creator") {
      cancelBattleRequest(requestId);
    }
    navigate("/");
  };

  return (
    <main className="relative isolate min-h-[calc(100vh-56px)] overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_35%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.18),transparent_25%),linear-gradient(180deg,#fff7fb_0%,#fffdfa_48%,#ffffff_100%)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-12 top-32 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="absolute -bottom-16 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-rose-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <Card className="border border-white/60 bg-white/80 shadow-[0_30px_80px_-40px_rgba(76,29,149,0.35)] backdrop-blur">
          <BattleLobbyHeader
            battleId={battleId}
            pageTitle={pageTitle}
            pageDescription={pageDescription}
            statusLabel={statusLabel}
          />

          <CardContent className="flex flex-col gap-5">
            <BattleProgressBar role={role} steps={steps} isGameStarted={!isLobby} />

            <BattleHeroSection
              role={role}
              myProfileImageUrl={myProfile?.profileImageUrl}
              opponent={opponent}
            />

            {isLobby ? (
              <Card className="border border-white/60 bg-white/80 backdrop-blur">
                <CardContent className="flex flex-col items-center gap-4 py-8">
                  <p className="text-sm text-slate-500">상대방 입장을 기다리는 중...</p>
                  <p className="font-display text-4xl tabular-nums tracking-tight text-slate-900">
                    {formatTime(remainingSeconds)}
                  </p>
                  <div className="h-2 w-48 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-1000"
                      style={{
                        width: `${(remainingSeconds / LOBBY_TIMEOUT) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    시간이 초과되면 자동으로 홈 화면으로 돌아갑니다
                  </p>
                </CardContent>
              </Card>
            ) : phase === "closed" ? (
              <Card className="border border-white/60 bg-white/80 backdrop-blur">
                <CardContent className="flex flex-col items-center gap-4 py-8">
                  <p className="font-display text-2xl text-slate-900">
                    {closedMessage ?? "대전이 종료되었습니다."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <BattleGameSection
                phase={phase}
                myMove={myMove}
                roundResult={roundResult}
                moveTimer={moveSeconds}
                onSelectMove={sendMove}
                onRetry={sendRetry}
              />
            )}

            <div className="flex flex-wrap justify-center gap-2">
              {phase === "closed" || phase === "disconnected" ? (
                <Button size="sm" onClick={() => navigate("/")} className="gap-1.5">
                  <Home className="h-3.5 w-3.5" />
                  홈으로 돌아가기
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={handleCopyRoomLink} className="gap-1.5">
                    <Copy className="h-3.5 w-3.5" />
                    방 링크 복사
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelBattle}
                    className="gap-1.5 text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-3.5 w-3.5" />
                    대전 취소
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default BattleRoom;
