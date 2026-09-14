import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, FileText, Map as MapIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import sonarScan from "@/assets/sonar-scan.jpg";
import { detections, hazardBg, scanMeta } from "@/lib/mock-data";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Detection Results — AquaGuard AI" },
      {
        name: "description",
        content:
          "Per-target detection results from the latest side-scan sonar survey: classification, confidence, hazard level and geotag.",
      },
      { property: "og:title", content: "Detection Results — AquaGuard AI" },
      {
        property: "og:description",
        content: "Classified sonar anomalies with confidence and hazard scoring.",
      },
    ],
  }),
  component: Results,
});

function Results() {
  return (
    <AppShell
      title="Detection Results"
      subtitle={`Scan ${scanMeta.id} · ${scanMeta.area}`}
      actions={
        <>
          <Button variant="outline" asChild>
            <Link to="/map">
              <MapIcon className="size-4" /> View on map
            </Link>
          </Button>
          <Button asChild>
            <Link to="/report">
              <FileText className="size-4" /> Generate report
            </Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <div className="surface-panel overflow-hidden">
          <div className="relative">
            <img
              src={sonarScan}
              alt="Side-scan sonar waterfall with detected anomaly bounding boxes"
              className="h-full w-full object-cover"
            />
            {detections.map((d) => (
              <span
                key={d.id}
                className="absolute rounded border-2 border-primary/80 bg-primary/10"
                style={{
                  left: `${d.box.x}%`,
                  top: `${d.box.y}%`,
                  width: `${d.box.w}%`,
                  height: `${d.box.h}%`,
                }}
              >
                <span className="label-mono absolute -top-5 left-0 whitespace-nowrap text-primary">
                  {d.label} {d.confidence}%
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="surface-panel p-5">
          <p className="label-mono">Survey summary</p>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Scan ID</dt>
              <dd className="font-mono">{scanMeta.id}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Date</dt>
              <dd>{scanMeta.date}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Vessel</dt>
              <dd>{scanMeta.vessel}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Sonar</dt>
              <dd>{scanMeta.sonar}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Line length</dt>
              <dd>{scanMeta.lineLength}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Targets returned</dt>
              <dd>{detections.length}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="surface-panel mt-5 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Classification</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Hazard</TableHead>
              <TableHead>Latitude</TableHead>
              <TableHead>Longitude</TableHead>
              <TableHead>Dimensions</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detections.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-mono text-xs">{d.id}</TableCell>
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
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/results/$id" params={{ id: d.id }}>
                      Open <ArrowUpRight className="size-3.5" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppShell>
  );
}
