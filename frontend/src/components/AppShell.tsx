import type { PropsWithChildren } from "react";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pine">
              CarbonLens
            </p>
            <h1 className="text-lg font-semibold text-ink">
              Internal Operations Console
            </h1>
          </div>
          <div className="rounded-full bg-mist px-3 py-1 text-sm text-steel">
            Settings Module
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
