import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
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

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">상태 메시지 편집</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            value={statusMessage}
            onChange={handleChange}
            placeholder="상태 메시지를 입력하세요"
            autoFocus
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />
          {resultMessage && (
            <p className="text-sm text-red-500">{resultMessage}</p>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:bg-indigo-300"
            >
              {isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StatusMessageEditModal;
