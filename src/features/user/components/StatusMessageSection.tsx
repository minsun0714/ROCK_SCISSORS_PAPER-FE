import type { ChangeEvent, FormEvent } from "react";

type StatusMessageSectionProps = {
  statusMessage: string;
  isPending: boolean;
  onStatusMessageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function StatusMessageSection({
  statusMessage,
  isPending,
  onStatusMessageChange,
  onSubmit,
}: StatusMessageSectionProps) {
  return (
    <section className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-slate-800">상태 메시지</h2>
      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
        <input
          value={statusMessage}
          onChange={onStatusMessageChange}
          placeholder="상태 메시지를 입력하세요"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {isPending ? "저장 중..." : "상태 메시지 저장"}
        </button>
      </form>
    </section>
  );
}

export default StatusMessageSection;
