import type { SubmitState } from "@/features/settings/types";

type InlineStatusProps = {
  state: SubmitState;
};

export function InlineStatus({ state }: InlineStatusProps) {
  if (state.phase === "idle" || !state.message) {
    return null;
  }

  const tone =
    state.phase === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : state.phase === "error"
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${tone}`}>
      {state.message}
    </div>
  );
}
