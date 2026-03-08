import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatusMessageSectionProps = {
  statusMessage: string;
  onEditClick?: () => void;
};

function StatusMessageSection({ statusMessage, onEditClick }: StatusMessageSectionProps) {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>상태 메시지</CardTitle>
        {onEditClick && (
          <Button variant="ghost" size="icon" onClick={onEditClick} className="h-8 w-8">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {statusMessage || "상태 메시지가 없습니다."}
        </p>
      </CardContent>
    </Card>
  );
}

export default StatusMessageSection;
