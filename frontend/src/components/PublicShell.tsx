import type { PropsWithChildren } from "react";

export function PublicShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.18),_transparent_34%),linear-gradient(180deg,_#f8fafc_0%,_#fffdf8_52%,_#eef6f3_100%)] text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/75 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-pine">
              CarbonLens
            </p>
            <h1 className="font-public text-xl font-semibold text-ink">
              Supplier Data Submission
            </h1>
          </div>
          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            External Portal
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
