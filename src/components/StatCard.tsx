import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  unit,
  hint,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  icon: LucideIcon;
  tone?: "primary" | "critical" | "sonar" | "success";
}) {
  const toneMap = {
    primary: "text-primary bg-primary/12 ring-primary/30",
    critical: "text-hazard-critical bg-hazard-critical/12 ring-hazard-critical/30",
    sonar: "text-sonar bg-sonar/12 ring-sonar/30",
    success: "text-success bg-success/12 ring-success/30",
  } as const;

  return (
    <div className="surface-panel p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="label-mono">{label}</p>
        <span className={`grid size-9 place-items-center rounded-lg ring-1 ${toneMap[tone]}`}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-4 font-display text-3xl font-bold tabular-nums">
        {value}
        {unit && <span className="ml-1 text-base font-medium text-muted-foreground">{unit}</span>}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
