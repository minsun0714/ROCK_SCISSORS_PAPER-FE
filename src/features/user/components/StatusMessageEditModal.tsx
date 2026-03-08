import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUpdateMyStatusMessageMutation } from "@/features/user/hooks";

type StatusMessageEditModalProps = {
  currentMessage: string;
  onClose: () => void;
};

function StatusMessageEditModal({ currentMessage, onClose }: StatusMessageEditModalProps) {
  const [statusMessage, setStatusMessage] = useState(currentMessage);
  const {
    mutate: updateStatus,
    isPending,
    resultMessage,
  } = useUpdateMyStatusMessageMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = statusMessage.trim();
    if (!trimmed) return;

    updateStatus(
      { statusMessage: trimmed },
      { onSuccess: () => onClose() },
    );
  };

  const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setStatusMessage(value);
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>상태 메시지 편집</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            value={statusMessage}
            onChange={handleChange}
            placeholder="상태 메시지를 입력하세요"
            autoFocus
          />
          {resultMessage && (
            <p className="text-sm text-destructive">{resultMessage}</p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default StatusMessageEditModal;
