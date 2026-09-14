import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  UploadCloud,
  ScanSearch,
  Map as MapIcon,
  FileText,
  History,
  Waves,
  Menu,
  Radar,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload Sonar", icon: UploadCloud },
  { to: "/results", label: "Detections", icon: ScanSearch },
  { to: "/map", label: "Geospatial Map", icon: MapIcon },
  { to: "/report", label: "Reports", icon: FileText },
  { to: "/history", label: "Scan History", icon: History },
] as const;

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="relative grid size-9 place-items-center rounded-lg bg-primary/15 ring-1 ring-primary/40">
        <Waves className="size-5 text-primary" />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-base font-bold tracking-tight">
            AquaGuard <span className="text-primary">AI</span>
          </span>
          <span className="label-mono block">Marine Anomaly Intelligence</span>
        </span>
      )}
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="space-y-1">
      {nav.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          activeProps={{
            className:
              "bg-sidebar-accent text-foreground border-l-2 border-primary font-medium",
          }}
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen deep-gradient">
      <div className="mx-auto flex max-w-[1500px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 p-5 backdrop-blur lg:flex">
          <Brand />
          <div className="mt-8 flex-1">
            <p className="label-mono mb-3 px-3">Workspace</p>
            <NavLinks />
          </div>
          <div className="rounded-lg border border-border bg-surface-2/60 p-3">
            <p className="label-mono">Model</p>
            <p className="mt-1 font-mono text-xs text-foreground">AquaGuard-Net v2.3</p>
            <p className="mt-2 flex items-center gap-2 text-xs text-success">
              <span className="size-1.5 rounded-full bg-success" /> Inference online
            </p>
            <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
              Prototype build — detections are simulated for demonstration.
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 bg-sidebar p-5">
                  <Brand />
                  <div className="mt-8">
                    <NavLinks onNavigate={() => setOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="min-w-0 flex-1">
                <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
                {subtitle && (
                  <p className="truncate text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
                )}
              </div>
              <div className="hidden items-center gap-2 md:flex">{actions}</div>
              <span className="hidden items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs text-primary xl:flex">
                <Radar className="size-3.5" /> Live survey link
              </span>
            </div>
            {actions && (
              <div className="flex flex-wrap gap-2 px-4 pb-4 md:hidden sm:px-6">{actions}</div>
            )}
          </header>
          <main className="px-4 py-6 sm:px-6 sm:py-8">{children}</main>
          <footer className="border-t border-border px-4 py-5 text-xs text-muted-foreground sm:px-6">
            AquaGuard AI · Smart India Hackathon prototype · Simulated analytics, no live
            sonar processing.
          </footer>
        </div>
      </div>
    </div>
  );
}
