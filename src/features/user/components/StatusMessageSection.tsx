import { Pencil } from "lucide-react";

type StatusMessageSectionProps = {
  statusMessage: string;
  onEditClick?: () => void;
};

function StatusMessageSection({ statusMessage, onEditClick }: StatusMessageSectionProps) {
  return (
    <section className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">상태 메시지</h2>
        {onEditClick && (
          <button
            type="button"
            onClick={onEditClick}
            className="text-slate-400 hover:text-slate-600"
            aria-label="상태 메시지 편집"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-slate-600">{statusMessage || "상태 메시지가 없습니다."}</p>
    </section>
  );
}

export default StatusMessageSection;
