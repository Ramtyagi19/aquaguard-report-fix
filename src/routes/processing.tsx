import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Loader2, Cpu, ArrowRight } from "lucide-react";
import sonarScan from "@/assets/sonar-scan.jpg";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { pipelineStages, scanMeta } from "@/lib/mock-data";

export const Route = createFileRoute("/processing")({
  head: () => ({
    meta: [
      { title: "Analysis Pipeline — AquaGuard AI" },
      {
        name: "description",
        content:
          "Live view of the simulated AquaGuard AI pipeline: preprocessing, noise reduction, detection, classification, confidence scoring and geotagging.",
      },
      { property: "og:title", content: "Analysis Pipeline — AquaGuard AI" },
      {
        property: "og:description",
        content: "Watch the sonar analysis pipeline run stage by stage.",
      },
    ],
  }),
  component: Processing,
});

function Processing() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(4);

  useEffect(() => {
    const tick = setInterval(() => {
      setProgress((p) => Math.min(100, p + 2));
    }, 60);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    setStage(Math.min(pipelineStages.length, Math.floor(progress / (100 / pipelineStages.length))));
  }, [progress]);

  const done = progress >= 100;

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => navigate({ to: "/results" }), 1200);
    return () => clearTimeout(t);
  }, [done, navigate]);

  return (
    <AppShell
      title="Running Analysis"
      subtitle={`${scanMeta.id} · ${scanMeta.area}`}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="surface-panel relative overflow-hidden">
          <div className="relative">
            <img
              src={sonarScan}
              alt="Side-scan sonar swath being analysed"
              width={1280}
              height={960}
              className="h-[360px] w-full object-cover opacity-90"
            />
            <div className="pointer-events-none absolute inset-0">
              <div className="sonar-sweep h-24 w-full bg-gradient-to-b from-transparent via-primary/45 to-transparent" />
            </div>
            <div className="absolute inset-0 grid-graticule opacity-30" />
            <span className="absolute left-4 top-4 rounded-md bg-abyss/80 px-2 py-1 font-mono text-[11px] text-primary">
              {done ? "INFERENCE COMPLETE" : "INFERENCE RUNNING"}
            </span>
          </div>
          <div className="space-y-3 p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                {done ? (
                  <Check className="size-4 text-success" />
                ) : (
                  <Loader2 className="size-4 animate-spin text-primary" />
                )}
                {done ? "Analysis complete" : pipelineStages[Math.min(stage, 5)]?.label}
              </span>
              <span className="font-mono tabular-nums text-primary">{progress}%</span>
            </div>
            <Progress value={progress} />
            <p className="text-xs text-muted-foreground">
              GPU worker aq-infer-03 · 1280 px tiles · 42 tiles/s
            </p>
          </div>
        </section>

        <section className="surface-panel p-5">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Cpu className="size-4 text-primary" /> Pipeline stages
          </h2>
          <ol className="mt-5 space-y-1">
            {pipelineStages.map((s, i) => {
              const state = i < stage ? "done" : i === stage ? "active" : "queued";
              return (
                <li
                  key={s.key}
                  className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                    state === "active"
                      ? "border-primary/40 bg-primary/8"
                      : state === "done"
                        ? "border-border bg-surface-2/50"
                        : "border-transparent"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-mono ${
                      state === "done"
                        ? "bg-success/15 text-success"
                        : state === "active"
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {state === "done" ? (
                      <Check className="size-3.5" />
                    ) : state === "active" ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{s.label}</span>
                    <span className="block text-xs text-muted-foreground">{s.detail}</span>
                  </span>
                  <span className="ml-auto label-mono shrink-0">
                    {state === "done" ? "ok" : state === "active" ? "run" : "queued"}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button disabled={!done} asChild={done}>
              {done ? (
                <Link to="/results">
                  View detections <ArrowRight className="size-4" />
                </Link>
              ) : (
                <span>Waiting for inference…</span>
              )}
            </Button>
            <Button variant="outline" asChild>
              <Link to="/upload">Cancel</Link>
            </Button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
