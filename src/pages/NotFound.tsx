import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,199,255,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(0,255,184,0.12),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(0,147,255,0.08),transparent_35%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="max-w-2xl w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl shadow-cyan-500/10 p-10 text-center space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Lost in flight path
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">404 — Page Not Found</h1>
          <p className="text-base md:text-lg text-muted-foreground">
            We can’t find the route <span className="font-semibold text-foreground/90">“{location.pathname}”</span>. Let’s get you back on course.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:scale-[1.01] hover:shadow-primary/50"
            >
              Return to Home
            </Link>
            <Link
              to="/social"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/60 hover:text-primary hover:shadow-lg hover:shadow-primary/15"
            >
              View Social Links
            </Link>
          </div>

          <div className="text-xs text-muted-foreground pt-2">
            If you think this is a mistake, double-check the URL or reach out via the contact email in the footer.
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
