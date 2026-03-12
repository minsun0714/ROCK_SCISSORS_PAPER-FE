import { Sparkles } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

type BattleLobbyHeaderProps = {
  battleId?: string;
  pageTitle: string;
  pageDescription: string;
  statusLabel: string;
};

function BattleLobbyHeader({
  battleId,
  pageTitle,
  pageDescription,
  statusLabel,
}: BattleLobbyHeaderProps) {
  return (
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
  );
}

export default BattleLobbyHeader;
