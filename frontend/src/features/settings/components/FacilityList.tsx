import type { Facility } from "@/features/settings/types";

type FacilityListProps = {
  facilities: Facility[];
  selectedFacilityId?: string;
  loading: boolean;
  onSelect: (facility: Facility) => void;
  onAddNew: () => void;
};

export function FacilityList({
  facilities,
  selectedFacilityId,
  loading,
  onSelect,
  onAddNew,
}: FacilityListProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm text-steel">
        Loading facilities...
      </div>
    );
  }

  if (!facilities.length) {
    return (
      <div className="space-y-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm text-steel">
        <p>No facilities added yet. Start by creating your first operational site.</p>
        <button
          type="button"
          onClick={onAddNew}
          className="rounded-full bg-white px-4 py-2 font-medium text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          Add first facility
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ink">Facilities</h3>
        <button
          type="button"
          onClick={onAddNew}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-steel transition hover:border-slate-400 hover:text-slate-900"
        >
          Add facility
        </button>
      </div>

      <div className="grid gap-3">
        {facilities.map((facility) => {
          const selected = facility.id === selectedFacilityId;
          return (
            <button
              type="button"
              key={facility.id}
              onClick={() => onSelect(facility)}
              className={`rounded-2xl border p-4 text-left transition ${
                selected
                  ? "border-pine bg-teal-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{facility.name}</p>
                  <p className="mt-1 text-sm text-steel">{facility.location}</p>
                </div>
                <span className="rounded-full bg-mist px-3 py-1 text-xs font-medium uppercase tracking-wide text-steel">
                  {facility.type}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
