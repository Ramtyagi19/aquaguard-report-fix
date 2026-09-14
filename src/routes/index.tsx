import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Radar, ShieldAlert, Waves, Satellite, Fish, Cpu } from "lucide-react";
import heroOcean from "@/assets/hero-ocean.jpg";
import sonarScan from "@/assets/sonar-scan.jpg";
import { Brand } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { dashboardStats } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AquaGuard AI — Underwater Debris & Anomaly Detection" },
      {
        name: "description",
        content:
          "AquaGuard AI analyses side-scan sonar imagery to detect underwater marine debris, ghost nets and anomalies for survey teams and marine agencies.",
      },
      { property: "og:title", content: "AquaGuard AI — Underwater Debris & Anomaly Detection" },
      {
        property: "og:description",
        content:
          "AI-assisted side-scan sonar analysis for marine debris, ghost nets and seabed anomaly detection.",
      },
    ],
  }),
  component: Home,
});

const capabilities = [
  {
    icon: Radar,
    title: "Sonar-native detection",
    body: "Tiled inference on side-scan waterfall imagery with slant-range correction and acoustic shadow validation.",
  },
  {
    icon: Fish,
    title: "Ghost net triage",
    body: "Derelict fishing gear separated from natural sand-wave and reef textures before it reaches the analyst.",
  },
  {
    icon: Satellite,
    title: "Geotagged evidence",
    body: "Every anomaly carries fused towfish layback and RTK position, ready for chart and cleanup tasking.",
  },
  {
    icon: ShieldAlert,
    title: "Hazard scoring",
    body: "Confidence-calibrated hazard levels with recommended action for navigation and marine safety cells.",
  },
];

function Home() {
  return (
    <div className="min-h-screen deep-gradient">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <Brand />
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild>
            <Link to="/upload">
              Start Analysis <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden border-y border-border">
        <img
          src={heroOcean}
          alt="Deep ocean survey environment"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-abyss/70" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <span className="label-mono inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-primary">
            <Cpu className="size-3.5" /> Smart India Hackathon · Prototype
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.08] sm:text-6xl">
            AI-powered detection of underwater{" "}
            <span className="text-gradient-primary">debris and anomalies</span> in side-scan
            sonar imagery
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Marine survey teams collect kilometres of side-scan sonar every day, yet ghost nets,
            sunken containers, wrecks and abandoned pipelines are still found by an analyst
            scrolling frame by frame. AquaGuard AI reads the acoustic imagery, separates man-made
            objects from natural seabed texture, scores hazard levels and hands over a geotagged,
            report-ready record.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/upload">
                Start Analysis <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/dashboard">Open dashboard</Link>
            </Button>
          </div>
          <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ["Anomalies indexed", dashboardStats.totalAnomalies],
              ["Scans processed", dashboardStats.scansProcessed],
              ["Ghost nets flagged", dashboardStats.ghostNets],
              ["Area surveyed", dashboardStats.areaSurveyed],
            ].map(([label, value]) => (
              <div key={label as string}>
                <dt className="label-mono">{label}</dt>
                <dd className="mt-1 font-display text-2xl font-bold">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">The problem on the seabed</h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>
              Derelict fishing gear keeps killing marine life for decades after it is lost.
              Containers, drums and structural debris damage trawl gear, obstruct channels and
              leak contaminants. Side-scan sonar is the practical way to see them — but the
              imagery is noisy, geometrically distorted and dominated by natural formations that
              look deceptively similar to man-made targets.
            </p>
            <p>
              Manual interpretation is slow, inconsistent between operators, and does not scale to
              national-level survey programmes. AquaGuard AI adds an automated first pass:
              detect, classify, score confidence, geotag, and escalate only what matters — while
              keeping the analyst in control of verification.
            </p>
            <ul className="grid gap-2 pt-2">
              {[
                "Ghost nets, wrecks, pipelines, drums and unidentified containers",
                "Natural formations suppressed with a geomorphology filter",
                "Exportable CSV / JSON evidence packs for agency workflows",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-foreground">
                  <Waves className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <figure className="surface-panel overflow-hidden">
            <img
              src={sonarScan}
              alt="Side-scan sonar imagery showing a wreck, a ghost net and a pipeline on the seafloor"
              width={1280}
              height={960}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <figcaption className="border-t border-border p-3 text-xs text-muted-foreground">
              Representative 600 kHz side-scan swath — wreck (port), ghost net and pipeline
              (starboard).
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">What the platform does</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map(({ icon: Icon, title, body }) => (
            <article key={title} className="surface-panel p-5">
              <span className="grid size-10 place-items-center rounded-lg bg-primary/12 ring-1 ring-primary/30">
                <Icon className="size-5 text-primary" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
        <div className="surface-panel mt-10 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-semibold">Walk the full workflow</h3>
            <p className="text-sm text-muted-foreground">
              Upload → processing pipeline → detections → anomaly detail → map → report.
            </p>
          </div>
          <Button size="lg" asChild>
            <Link to="/upload">
              Start Analysis <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
        AquaGuard AI · Clickable prototype with simulated detection results.
      </footer>
    </div>
  );
}
