import { Copy, Crown, ShieldCheck, TimerReset, X } from "lucide-react";
import type { BattleRouteState } from "@/features/battle/types";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type BattleSidebarProps = {
  role: BattleRouteState["role"] | undefined;
  steps: string[];
  canCancelBattle: boolean;
  isCancellingBattleRequest: boolean;
  onCopyRoomLink: () => void;
  onCancelBattle: () => void;
};

function BattleSidebar({
  role,
  steps,
  canCancelBattle,
  isCancellingBattleRequest,
  onCopyRoomLink,
  onCancelBattle,
}: BattleSidebarProps) {
  return (
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
          <Button onClick={onCopyRoomLink} className="gap-1.5">
            <Copy className="h-4 w-4" />방 링크 복사
          </Button>
          {canCancelBattle && (
            <Button
              variant="destructive"
              onClick={onCancelBattle}
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
  );
}

export default BattleSidebar;
