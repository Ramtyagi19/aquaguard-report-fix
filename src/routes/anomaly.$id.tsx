import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, FileText, Map as MapIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import sonarScan from "@/assets/sonar-scan.jpg";
import { detections, hazardBg, scanMeta } from "@/lib/mock-data";

export const Route = createFileRoute("/anomaly/$id")({
  head: () => ({
    meta: [
      { title: "Anomaly Details — AquaGuard AI" },
      {
        name: "description",
        content:
          "Full detection record for a single sonar anomaly: classification, confidence, hazard level, geotag, dimensions and recommended action.",
      },
      { property: "og:title", content: "Anomaly Details — AquaGuard AI" },
      {
        property: "og:description",
        content: "Single-target sonar anomaly record with geotag and recommended action.",
      },
    ],
  }),
  component: AnomalyDetails,
  notFoundComponent: () => {
    const { id } = Route.useParams();
    return (
      <AppShell title="Anomaly not found" subtitle={`No detection record for ${id}`}>
        <div className="surface-panel p-6">
          <p className="text-sm text-muted-foreground">
            This anomaly is not part of the current survey dataset.
          </p>
          <Button className="mt-4" asChild>
            <Link to="/results">Back to detections</Link>
          </Button>
        </div>
      </AppShell>
    );
  },
});

function AnomalyDetails() {
  const { id } = Route.useParams();
  const d = detections.find((x) => x.id === id);
  if (!d) throw notFound();

  const facts: Array<[string, string]> = [
    ["Object classification", d.label],
    ["Confidence score", `${d.confidence}%`],
    ["Hazard level", d.hazard],
    ["Latitude", d.lat.toFixed(4)],
    ["Longitude", d.lon.toFixed(4)],
    ["Estimated dimensions", d.dimensions],
    ["Water depth", d.depth],
    ["Acoustic shadow", d.acousticShadow],
    ["Review status", d.status],
    ["Scan ID", scanMeta.id],
    ["Scan date", scanMeta.date],
  ];

  return (
    <AppShell
      title={`${d.label} · ${d.id}`}
      subtitle={`${scanMeta.area} · ${scanMeta.date}`}
      actions={
        <>
          <Button variant="outline" asChild>
            <Link to="/results">
              <ArrowLeft className="size-4" /> Detections
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/map">
              <MapIcon className="size-4" /> Show on map
            </Link>
          </Button>
          <Button asChild>
            <Link to="/report">
              <FileText className="size-4" /> Report
            </Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="surface-panel overflow-hidden">
          <div className="relative">
            <img
              src={sonarScan}
              alt={`Sonar return for ${d.label} anomaly ${d.id}`}
              className="h-full w-full object-cover"
            />
            <span
              className="absolute rounded border-2 border-primary bg-primary/10"
              style={{
                left: `${d.box.x}%`,
                top: `${d.box.y}%`,
                width: `${d.box.w}%`,
                height: `${d.box.h}%`,
              }}
            />
          </div>
        </div>

        <div className="surface-panel p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="label-mono">Detection record</p>
            <span className={`rounded-full border px-2 py-0.5 text-xs ${hazardBg[d.hazard]}`}>
              {d.hazard} hazard
            </span>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="surface-panel mt-5 grid gap-5 p-5 md:grid-cols-2">
        <div>
          <p className="label-mono">Analyst notes</p>
          <p className="mt-2 text-sm text-muted-foreground">{d.notes}</p>
        </div>
        <div>
          <p className="label-mono">Recommended action</p>
          <p className="mt-2 text-sm text-muted-foreground">{d.action}</p>
        </div>
      </div>
    </AppShell>
  );
}
