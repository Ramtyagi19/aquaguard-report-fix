import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { FileUp, UploadCloud, X, CheckCircle2, Info } from "lucide-react";
import { toast } from "sonner";
import sonarScan from "@/assets/sonar-scan.jpg";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { scanMeta, supportedFormats } from "@/lib/mock-data";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload Side-Scan Sonar — AquaGuard AI" },
      {
        name: "description",
        content:
          "Drop a side-scan sonar file (XTF, JSF, SEGY, GeoTIFF, PNG, JPG) and launch simulated AI anomaly analysis.",
      },
      { property: "og:title", content: "Upload Side-Scan Sonar — AquaGuard AI" },
      {
        property: "og:description",
        content: "Ingest a sonar swath and start automated debris and anomaly detection.",
      },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<{ name: string; size: string } | null>(null);

  const accept = (f?: File) => {
    const name = f?.name ?? "SSS_20260904_MRM_Line12.xtf";
    const size = f ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : "48.6 MB";
    setFile({ name, size });
    toast.success("Sonar file staged", { description: name });
  };

  return (
    <AppShell
      title="Upload Sonar Imagery"
      subtitle="Ingest a side-scan swath for automated anomaly detection"
    >
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="space-y-6">
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              accept(e.dataTransfer.files?.[0]);
            }}
            className={`surface-panel grid-graticule flex cursor-pointer flex-col items-center justify-center px-6 py-16 text-center transition-colors ${
              dragging ? "border-primary bg-primary/10" : "hover:border-primary/50"
            }`}
          >
            <span className="relative grid size-16 place-items-center rounded-full bg-primary/12 ring-1 ring-primary/30">
              <span className="absolute inset-0 rounded-full bg-primary/20 ping-ring" />
              <UploadCloud className="size-7 text-primary" />
            </span>
            <h2 className="mt-5 text-lg font-semibold">Drag & drop your sonar file</h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Or click to browse. Raw sonar records and exported waterfall imagery are both
              supported by the ingest service.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {supportedFormats.map((f) => (
                <span
                  key={f}
                  className="rounded-md border border-border bg-surface-2/70 px-2 py-1 font-mono text-[11px] text-muted-foreground"
                >
                  .{f.toLowerCase()}
                </span>
              ))}
            </div>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(e) => accept(e.target.files?.[0] ?? undefined)}
            />
          </div>

          {file && (
            <div className="surface-panel overflow-hidden">
              <div className="flex items-center gap-3 border-b border-border p-4">
                <span className="grid size-10 place-items-center rounded-lg bg-sonar/12 ring-1 ring-sonar/30">
                  <FileUp className="size-5 text-sonar" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {file.size} · staged for inference
                  </p>
                </div>
                <span className="hidden items-center gap-1.5 text-xs text-success sm:flex">
                  <CheckCircle2 className="size-4" /> Validated
                </span>
                <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                  <X className="size-4" />
                </Button>
              </div>
              <div className="grid gap-4 p-4 sm:grid-cols-2">
                <img
                  src={sonarScan}
                  alt="Preview of the staged side-scan sonar swath"
                  width={1280}
                  height={960}
                  loading="lazy"
                  className="h-44 w-full rounded-lg border border-border object-cover"
                />
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Sonar", scanMeta.sonar],
                    ["Swath", scanMeta.swath],
                    ["Line length", scanMeta.lineLength],
                    ["Altitude", scanMeta.altitude],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="label-mono">{k}</dt>
                      <dd className="mt-0.5 text-xs">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}

          <div className="surface-panel space-y-4 p-5">
            <h2 className="text-base font-semibold">Survey metadata</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="area">Survey area</Label>
                <Input id="area" defaultValue={scanMeta.area} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vessel">Survey vessel</Label>
                <Input id="vessel" defaultValue={scanMeta.vessel} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="operator">Operating cell</Label>
                <Input id="operator" defaultValue={scanMeta.operator} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date">Acquisition date</Label>
                <Input id="date" defaultValue={scanMeta.date} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              disabled={!file}
              onClick={() => navigate({ to: "/processing" })}
            >
              Analyze Sonar
            </Button>
            <Button size="lg" variant="outline" onClick={() => accept()}>
              Use demo sonar file
            </Button>
            {!file && (
              <p className="text-xs text-muted-foreground">
                Stage a file to enable analysis.
              </p>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="surface-panel p-5">
            <h2 className="text-base font-semibold">Ingest checklist</h2>
            <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
              {[
                "Along-track imagery with nadir line intact",
                "Slant-range corrected or raw (auto-corrected on ingest)",
                "Navigation channel present for geotagging",
                "Max file size 2 GB per survey line",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-primary/25 bg-primary/8 p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-primary">
              <Info className="size-4" /> Prototype notice
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              No file is uploaded or processed. Selecting any file replays a scripted analysis
              over the bundled demo swath so the full workflow can be demonstrated.
            </p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
