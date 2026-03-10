import { Copy, Crown, ShieldCheck, Sparkles, Swords, TimerReset, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCancelBattleRequestMutation } from "@/features/battle/hooks";
import type { BattleRouteState } from "@/features/battle/types";
import { useMyProfileQuery } from "@/features/user/hooks";
import { cancelBattleRequestOnExit } from "@/service/battleService";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

const waitingSteps = ["대전방 생성 완료", "상대에게 초대 알림 전송", "상대 입장 대기"];

const joinedSteps = ["대전방 생성 완료", "초대 수락 완료", "양쪽 플레이어 입장"];

function BattleRoom() {
  const { battleId } = useParams<{ battleId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: myProfile } = useMyProfileQuery({ throwOnError: false });
  const { mutate: cancelBattleRequest, isPending: isCancellingBattleRequest } =
    useCancelBattleRequestMutation();
  const routeState = location.state as BattleRouteState | null;
  const role = routeState?.role;
  const opponent = routeState?.opponent;
  const requestId = routeState?.requestId ?? battleId ?? undefined;
  const canCancelBattle = role !== "invitee";
  const hasCancelledOnExitRef = useRef(false);
  const pageTitle = role === "invitee" ? "대전방에 입장했습니다" : "대전방이 열렸습니다";
  const pageDescription =
    role === "invitee"
      ? `${opponent?.nickname ?? "상대방"}님과 바로 대기 상태에 들어갔습니다.`
      : `${opponent?.nickname ?? "상대방"}님의 수락을 기다리는 중입니다.`;
  const statusLabel = role === "invitee" ? "양측 준비 완료" : "수락 대기 중";
  const steps = role === "invitee" ? joinedSteps : waitingSteps;

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
    if (!requestId) {
      toast.error("취소할 대전 요청 정보를 찾지 못했습니다.");
      return;
    }

    cancelBattleRequest(requestId, {
      onSuccess: () => {
        hasCancelledOnExitRef.current = true;
        navigate("/");
      },
    });
  };

  useEffect(() => {
    if (!canCancelBattle || !requestId) {
      return;
    }

    const cancelOnExit = () => {
      if (hasCancelledOnExitRef.current) {
        return;
      }

      hasCancelledOnExitRef.current = true;
      cancelBattleRequestOnExit(requestId);
    };

    const handlePopState = () => {
      cancelOnExit();
    };

    const handlePageHide = () => {
      cancelOnExit();
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [canCancelBattle, requestId]);

  return (
    <main className="relative isolate min-h-[calc(100vh-56px)] overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.18),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(244,114,182,0.18),_transparent_25%),linear-gradient(180deg,_#fff7fb_0%,_#fffdfa_48%,_#ffffff_100%)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-4rem] top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-3rem] top-32 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="absolute bottom-[-4rem] left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-rose-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <Card className="border border-white/60 bg-white/80 shadow-[0_30px_80px_-40px_rgba(76,29,149,0.35)] backdrop-blur">
          <CardHeader className="gap-4 sm:flex sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <Badge variant="secondary" className="w-fit gap-1.5 bg-primary/10 text-primary">
                <Sparkles className="h-3 w-3" />
                Battle Lobby
              </Badge>
              <div className="space-y-1">
                <CardTitle className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
                  {pageTitle}
                </CardTitle>
                <CardDescription className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  {pageDescription}
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="h-auto rounded-full border-primary/20 px-3 py-1 text-primary"
              >
                방 번호 {battleId ?? "-"}
              </Badge>
              <Badge
                variant="outline"
                className="h-auto rounded-full border-amber-200 bg-amber-50 px-3 py-1 text-amber-700"
              >
                {statusLabel}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="grid gap-4 lg:grid-cols-[1.3fr_0.8fr]">
            <section className="rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(91,33,182,0.96),rgba(190,24,93,0.82))] p-5 text-white shadow-xl shadow-primary/15 sm:p-6">
              <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <article className="rounded-[1.5rem] bg-white/12 p-4 backdrop-blur-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <Avatar className="h-14 w-14 border border-white/30">
                      <AvatarImage src={myProfile?.profileImageUrl ?? undefined} />
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
                    손 모양을 고를 준비를 마쳤습니다. 상대가 들어오면 같은 방에서 바로 대전을 이어갈
                    수 있습니다.
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

            <section className="grid gap-4">
              <Card className="border border-slate-200/80 bg-white/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    입장 상태
                  </CardTitle>
                  <CardDescription>
                    지금 구현 범위는 방 생성과 수락 후 동일 방 진입까지입니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {steps.map((step, index) => (
                    <div
                      key={step}
                      className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-3 py-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{step}</p>
                        <p className="text-xs text-slate-500">
                          {index < 2 || role === "invitee" ? "완료" : "진행 중"}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border border-slate-200/80 bg-white/90">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-900">
                    <Crown className="h-4 w-4 text-amber-500" />
                    다음 라운드 준비
                  </CardTitle>
                  <CardDescription>
                    방 번호를 기준으로 웹소켓 게임 상태를 붙이면 이어서 구현하기 좋습니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
                  <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(250,245,255,0.95),rgba(255,244,235,0.95))] px-4 py-3">
                    상대 수락 이후에는 같은 `battleId`를 공유하므로, 다음 단계에서 선택 제출과 결과
                    브로드캐스트를 이 값에 묶으면 됩니다.
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-slate-500">
                    <TimerReset className="h-4 w-4" />
                    현재 페이지는 로비 상태를 보여주는 대기형 UI입니다.
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2 bg-transparent">
                  <Button onClick={handleCopyRoomLink} className="gap-1.5">
                    <Copy className="h-4 w-4" />방 링크 복사
                  </Button>
                  {canCancelBattle && (
                    <Button
                      variant="destructive"
                      onClick={handleCancelBattle}
                      disabled={isCancellingBattleRequest}
                      className="gap-1.5"
                    >
                      <X className="h-4 w-4" />
                      {isCancellingBattleRequest ? "취소 중..." : "대전 취소"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </section>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default BattleRoom;
