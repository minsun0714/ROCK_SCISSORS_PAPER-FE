import { Check } from "lucide-react";
import type { BattleRouteState } from "@/features/battle/types";

type BattleProgressBarProps = {
  role: BattleRouteState["role"] | undefined;
  steps: string[];
  isGameStarted: boolean;
};

function BattleProgressBar({ role, steps, isGameStarted }: BattleProgressBarProps) {
  const completedCount = isGameStarted || role === "invitee" ? steps.length : 2;

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
        const isDone = index < completedCount;
        const isCurrent = index === completedCount;

        return (
          <div key={step} className="flex flex-1 items-center gap-2">
            <div className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  isDone
                    ? "bg-primary text-white"
                    : isCurrent
                      ? "border-2 border-primary bg-white text-primary"
                      : "border border-slate-200 bg-slate-50 text-slate-400"
                }`}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </div>
              <span
                className={`hidden text-xs sm:inline ${
                  isDone
                    ? "font-medium text-slate-900"
                    : isCurrent
                      ? "font-medium text-primary"
                      : "text-slate-400"
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-4 shrink-0 rounded-full ${
                  index < completedCount - 1 ? "bg-primary" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default BattleProgressBar;
