import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useUpdateMyStatusMessageMutation } from "@/features/user/hooks";

function Ping() {
  const [statusMessage, setStatusMessage] = useState("");
  const [resultMessage, setResultMessage] = useState("");

  const {
    mutate: updateStatus,
    isPending: isUpdateStatusPending,
    resultMessage: updateStatusResultMessage,
    setResultMessage: setUpdateStatusResultMessage,
  } = useUpdateMyStatusMessageMutation();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = statusMessage.trim();
    if (!trimmed) {
      setResultMessage("상태 메시지를 입력해주세요.");
      return;
    }

    setResultMessage("");
    setUpdateStatusResultMessage("");
    updateStatus({ statusMessage: trimmed });
  };

  const handleStatusMessageChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setStatusMessage(value);
  };

  const displayMessage = resultMessage || updateStatusResultMessage;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-2xl flex-col items-center justify-center gap-4 px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900">Ping 페이지</h1>
      <form className="flex w-full max-w-xl flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
        <input
          value={statusMessage}
          onChange={handleStatusMessageChange}
          placeholder="상태 메시지를 입력하세요"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={isUpdateStatusPending}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {isUpdateStatusPending ? "저장 중..." : "상태 메시지 저장"}
        </button>
      </form>
      {displayMessage && (
        <p className="w-full max-w-xl rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
          {displayMessage}
        </p>
      )}
    </main>
  );
}

export default Ping;
