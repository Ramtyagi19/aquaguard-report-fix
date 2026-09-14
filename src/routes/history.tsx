import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ScanSearch } from "lucide-react";
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
import { hazardBg, scanHistory } from "@/lib/mock-data";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Scan History — AquaGuard AI" },
      {
        name: "description",
        content:
          "Archive of processed side-scan sonar surveys with anomaly counts, review status and overall risk rating.",
      },
      { property: "og:title", content: "Scan History — AquaGuard AI" },
      {
        property: "og:description",
        content: "Processed sonar surveys with anomaly counts and risk ratings.",
      },
    ],
  }),
  component: History,
});

function History() {
  return (
    <AppShell
      title="Scan History"
      subtitle="Archive of processed side-scan sonar surveys"
      actions={
        <>
          <Button variant="outline" asChild>
            <Link to="/results">
              <ScanSearch className="size-4" /> Latest detections
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
      <div className="surface-panel overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scan ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Survey area</TableHead>
              <TableHead>Anomalies</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scanHistory.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-xs">{s.id}</TableCell>
                <TableCell>{s.date}</TableCell>
                <TableCell>{s.area}</TableCell>
                <TableCell className="tabular-nums">{s.anomalies}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{s.status}</TableCell>
                <TableCell>
                  <span className={`rounded-full border px-2 py-0.5 text-xs ${hazardBg[s.risk]}`}>
                    {s.risk}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppShell>
  );
}
