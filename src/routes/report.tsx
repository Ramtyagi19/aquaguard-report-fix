import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FileJson, FileText, Map as MapIcon, ScanSearch } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  activeDetections,
  detections,
  hazardBg,
  scanMeta,
  type Detection,
} from "@/lib/mock-data";
import { AlertTriangle, Gauge, ScanLine } from "lucide-react";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Survey Report — AquaGuard AI" },
      {
        name: "description",
        content:
          "Downloadable AquaGuard AI survey report: scan summary, total anomalies, classification, confidence, hazard level, coordinates and dimensions.",
      },
      { property: "og:title", content: "Survey Report — AquaGuard AI" },
      {
        property: "og:description",
        content:
          "Full sonar survey report with detection table and CSV / JSON export of all anomalies.",
      },
    ],
  }),
  component: ReportPage,
});

const csvHeaders = [
  "scan_id",
  "scan_date",
  "anomaly_id",
  "classification",
  "confidence_percent",
  "hazard_level",
  "latitude",
  "longitude",
  "estimated_dimensions",
  "depth",
  "status",
] as const;

function toCsv(rows: Detection[]) {
  const body = rows.map((d) =>
    [
      scanMeta.id,
      scanMeta.date,
      d.id,
      d.label,
      d.confidence,
      d.hazard,
      d.lat,
      d.lon,
      d.dimensions,
      d.depth,
      d.status,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(","),
  );
  return [csvHeaders.join(","), ...body].join("\n");
}

function download(filename: string, contents: string, type: string) {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function ReportPage() {
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  const avgConfidence = Math.round(
    activeDetections.reduce((sum, d) => sum + d.confidence, 0) / activeDetections.length,
  );
  const highRisk = detections.filter(
    (d) => d.hazard === "Critical" || d.hazard === "High",
  ).length;

  const handleCsv = () =>
    download(`aquaguard-${scanMeta.id}.csv`, toCsv(detections), "text/csv;charset=utf-8");

  const handleJson = () =>
    download(
      `aquaguard-${scanMeta.id}.json`,
      JSON.stringify(
        {
          report: "AquaGuard AI — Sonar Anomaly Survey Report",
          scan: scanMeta,
          totals: {
            anomaliesDetected: detections.length,
            actionable: activeDetections.length,
            highRisk,
            averageConfidence: avgConfidence,
          },
          detections,
        },
        null,
        2,
      ),
      "application/json",
    );

  const handleGenerate = () => {
    setGeneratedAt(new Date().toLocaleString());
    if (typeof window !== "undefined") window.print();
  };

  return (
    <AppShell
      title="Survey Report"
      subtitle={`AquaGuard AI · Scan ${scanMeta.id} · ${scanMeta.date}`}
      actions={
        <>
          <Button variant="outline" onClick={handleCsv}>
            <Download className="size-4" /> Download CSV
          </Button>
          <Button variant="outline" onClick={handleJson}>
            <FileJson className="size-4" /> Download JSON
          </Button>
          <Button onClick={handleGenerate}>
            <FileText className="size-4" /> Generate Report
          </Button>
        </>
      }
    >
      <div className="surface-panel flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="label-mono">AquaGuard AI · Marine Anomaly Intelligence</p>
          <h2 className="mt-1 font-display text-2xl font-bold">
            Side-scan sonar anomaly report
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {scanMeta.area} · {scanMeta.vessel} · {scanMeta.operator}
          </p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p className="font-mono text-sm text-foreground">{scanMeta.id}</p>
          <p>Scan date {scanMeta.date}</p>
          {generatedAt && <p>Report generated {generatedAt}</p>}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total anomalies detected"
          value={detections.length}
          hint={`${activeDetections.length} actionable after filtering`}
          icon={ScanSearch}
        />
        <StatCard
          label="High-risk anomalies"
          value={highRisk}
          hint="Critical + High hazard classes"
          icon={AlertTriangle}
          tone="critical"
        />
        <StatCard
          label="Average confidence"
          value={avgConfidence}
          unit="%"
          hint="Across actionable detections"
          icon={Gauge}
          tone="success"
        />
        <StatCard
          label="Survey line length"
          value={scanMeta.lineLength}
          hint={`${scanMeta.sonar} · swath ${scanMeta.swath}`}
          icon={ScanLine}
          tone="sonar"
        />
      </div>

      <div className="surface-panel mt-5 p-5">
        <p className="label-mono">Scan summary</p>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted-foreground">Scan ID</dt>
            <dd className="font-mono">{scanMeta.id}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Scan date</dt>
            <dd>{scanMeta.date}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Survey area</dt>
            <dd>{scanMeta.area}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Vessel</dt>
            <dd>{scanMeta.vessel}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Sonar system</dt>
            <dd>{scanMeta.sonar}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Tow altitude</dt>
            <dd>{scanMeta.altitude}</dd>
          </div>
        </dl>
      </div>

      <div className="surface-panel mt-5 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Anomaly ID</TableHead>
              <TableHead>Object classification</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Hazard level</TableHead>
              <TableHead>Latitude</TableHead>
              <TableHead>Longitude</TableHead>
              <TableHead>Estimated dimensions</TableHead>
              <TableHead>Scan date / ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detections.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-mono text-xs">
                  <Link to="/anomaly/$id" params={{ id: d.id }} className="hover:text-primary">
                    {d.id}
                  </Link>
                </TableCell>
                <TableCell className="font-medium">{d.label}</TableCell>
                <TableCell className="tabular-nums">{d.confidence}%</TableCell>
                <TableCell>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs ${hazardBg[d.hazard]}`}
                  >
                    {d.hazard}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs">{d.lat.toFixed(4)}</TableCell>
                <TableCell className="font-mono text-xs">{d.lon.toFixed(4)}</TableCell>
                <TableCell className="text-xs">{d.dimensions}</TableCell>
                <TableCell className="text-xs">
                  {scanMeta.date} · <span className="font-mono">{scanMeta.id}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleCsv}>
          <Download className="size-4" /> Download CSV
        </Button>
        <Button variant="outline" onClick={handleJson}>
          <FileJson className="size-4" /> Download JSON
        </Button>
        <Button onClick={handleGenerate}>
          <FileText className="size-4" /> Generate Report
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/map">
            <MapIcon className="size-4" /> Back to map
          </Link>
        </Button>
      </div>
    </AppShell>
  );
}
