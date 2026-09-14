import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ScanSearch } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import chartMap from "@/assets/chart-map.jpg";
import { detections, hazardBg, scanMeta } from "@/lib/mock-data";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Geospatial Map — AquaGuard AI" },
      {
        name: "description",
        content:
          "Geotagged sonar anomalies plotted over the survey chart with hazard level, coordinates and classification.",
      },
      { property: "og:title", content: "Geospatial Map — AquaGuard AI" },
      {
        property: "og:description",
        content: "Anomaly positions plotted across the survey area.",
      },
    ],
  }),
  component: GeoMap,
});

function GeoMap() {
  const lats = detections.map((d) => d.lat);
  const lons = detections.map((d) => d.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const pos = (d: (typeof detections)[number]) => ({
    left: `${8 + ((d.lon - minLon) / (maxLon - minLon || 1)) * 84}%`,
    top: `${88 - ((d.lat - minLat) / (maxLat - minLat || 1)) * 76}%`,
  });

  return (
    <AppShell
      title="Geospatial Map"
      subtitle={`${scanMeta.area} · ${detections.length} geotagged targets`}
      actions={
        <>
          <Button variant="outline" asChild>
            <Link to="/results">
              <ScanSearch className="size-4" /> Detections
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
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="surface-panel relative overflow-hidden">
          <img
            src={chartMap}
            alt="Nautical chart of the survey area with plotted anomaly positions"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 grid-graticule opacity-40" />
          {detections.map((d) => (
            <Link
              key={d.id}
              to="/anomaly/$id"
              params={{ id: d.id }}
              style={pos(d)}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <span className="grid size-4 place-items-center rounded-full bg-primary ring-4 ring-primary/25" />
              <span className="label-mono mt-1 block whitespace-nowrap text-foreground">
                {d.id}
              </span>
            </Link>
          ))}
        </div>

        <div className="surface-panel p-5">
          <p className="label-mono">Plotted targets</p>
          <ul className="mt-4 space-y-3">
            {detections.map((d) => (
              <li key={d.id} className="flex items-start justify-between gap-3 text-sm">
                <Link to="/anomaly/$id" params={{ id: d.id }} className="min-w-0">
                  <span className="block font-medium">{d.label}</span>
                  <span className="block font-mono text-xs text-muted-foreground">
                    {d.lat.toFixed(4)}, {d.lon.toFixed(4)} · {d.depth}
                  </span>
                </Link>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-xs ${hazardBg[d.hazard]}`}
                >
                  {d.hazard}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
