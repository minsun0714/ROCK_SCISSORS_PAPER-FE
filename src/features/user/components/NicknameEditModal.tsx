import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { useUpdateMyNicknameMutation } from "@/features/user/hooks/useUpdateMyNicknameMutation";

type NicknameEditModalProps = {
  currentNickname: string;
  onClose: () => void;
};

function NicknameEditModal({ currentNickname, onClose }: NicknameEditModalProps) {
  const [nickname, setNickname] = useState(currentNickname);
  const {
    mutate: updateNickname,
    isPending,
    resultMessage,
  } = useUpdateMyNicknameMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = nickname.trim();
    if (!trimmed) return;
    if (trimmed === currentNickname) {
      onClose();
      return;
    }

    updateNickname(
      { nickname: trimmed },
      { onSuccess: () => onClose() },
    );
  };

  const handleChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setNickname(value);
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>닉네임 변경</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            value={nickname}
            onChange={handleChange}
            placeholder="새 닉네임을 입력하세요"
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
              {isPending ? "변경 중..." : "변경"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NicknameEditModal;
