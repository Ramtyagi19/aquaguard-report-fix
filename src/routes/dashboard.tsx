import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Fish,
  Gauge,
  ScanSearch,
  UploadCloud,
  ArrowUpRight,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
  classDistribution,
  dashboardStats,
  hazardBg,
  monthlyTrend,
  scanHistory,
} from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Survey Dashboard — AquaGuard AI" },
      {
        name: "description",
        content:
          "Fleet-wide view of detected underwater anomalies, high-risk targets, ghost nets, average model confidence and recent sonar scans.",
      },
      { property: "og:title", content: "Survey Dashboard — AquaGuard AI" },
      {
        property: "og:description",
        content: "Anomaly totals, hazard mix and recent side-scan sonar scans at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

const tooltipStyle = {
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "var(--foreground)",
};

function Dashboard() {
  return (
    <AppShell
      title="Survey Dashboard"
      subtitle="National marine debris programme · consolidated detection metrics"
      actions={
        <>
          <Button asChild>
            <Link to="/upload">
              <UploadCloud className="size-4" /> Upload sonar
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/results">
              <ScanSearch className="size-4" /> Latest detections
            </Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total anomalies detected"
          value={dashboardStats.totalAnomalies}
          hint="Across 64 processed survey lines"
          icon={ScanSearch}
        />
        <StatCard
          label="High-risk anomalies"
          value={dashboardStats.highRisk}
          hint="Critical + High hazard classes"
          icon={AlertTriangle}
          tone="critical"
        />
        <StatCard
          label="Ghost nets detected"
          value={dashboardStats.ghostNets}
          hint="Derelict fishing gear signatures"
          icon={Fish}
          tone="sonar"
        />
        <StatCard
          label="Average confidence"
          value={dashboardStats.avgConfidence}
          unit="%"
          hint="Calibrated ensemble score"
          icon={Gauge}
          tone="success"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="surface-panel p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Detections over time</h2>
              <p className="text-xs text-muted-foreground">
                Monthly anomalies vs. high-risk escalations
              </p>
            </div>
            <span className="label-mono">2026 season</span>
          </div>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="anomalies"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="highRisk"
                  stroke="var(--color-chart-4)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="surface-panel p-5">
          <h2 className="text-base font-semibold">Object class mix</h2>
          <p className="text-xs text-muted-foreground">Classified man-made targets</p>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={classDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={82}
                  paddingAngle={3}
                  stroke="var(--surface)"
                >
                  {classDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-2 text-xs">
            {classDistribution.map((entry) => (
              <li key={entry.name} className="flex items-center gap-2 text-muted-foreground">
                <span
                  className="size-2.5 rounded-sm"
                  style={{ backgroundColor: entry.fill }}
                />
                {entry.name}
                <span className="ml-auto tabular-nums text-foreground">{entry.value}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <section className="surface-panel p-5">
          <h2 className="text-base font-semibold">Hazard distribution by region</h2>
          <p className="text-xs text-muted-foreground">High-risk anomalies per survey zone</p>
          <div className="mt-5 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { zone: "Goa", n: 14 },
                  { zone: "Kutch", n: 11 },
                  { zone: "Chennai", n: 7 },
                  { zone: "Andaman", n: 9 },
                  { zone: "Kochi", n: 5 },
                ]}
              >
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="zone" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="n" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="surface-panel overflow-hidden">
          <div className="flex items-center justify-between p-5">
            <div>
              <h2 className="text-base font-semibold">Recent sonar scans</h2>
              <p className="text-xs text-muted-foreground">Latest ingested survey lines</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/history">
                All scans <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scan ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Survey area</TableHead>
                  <TableHead className="text-right">Anomalies</TableHead>
                  <TableHead>Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scanHistory.slice(0, 5).map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell className="font-mono text-xs">{scan.id}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {scan.date}
                    </TableCell>
                    <TableCell className="text-xs">{scan.area}</TableCell>
                    <TableCell className="text-right tabular-nums">{scan.anomalies}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] ${hazardBg[scan.risk]}`}
                      >
                        {scan.risk}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
