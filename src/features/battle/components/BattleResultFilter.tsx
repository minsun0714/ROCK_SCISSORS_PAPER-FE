import { Button } from "@/shared/components/ui/button";
import type { BattleResult } from "@/service/battleHistoryService";

const RESULT_FILTERS: { label: string; value: BattleResult | undefined }[] = [
  { label: "전체", value: undefined },
  { label: "승", value: "WIN" },
  { label: "패", value: "LOSE" },
  { label: "무", value: "DRAW" },
];

type BattleResultFilterProps = {
  value: BattleResult | undefined;
  onChange: (value: BattleResult | undefined) => void;
};

function BattleResultFilter({ value, onChange }: BattleResultFilterProps) {
  return (
    <div className="flex gap-1.5">
      {RESULT_FILTERS.map((filter) => (
        <Button
          key={filter.label}
          size="sm"
          variant={value === filter.value ? "default" : "outline"}
          onClick={() => onChange(filter.value)}
          className="h-7 px-3 text-xs"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}

export default BattleResultFilter;
