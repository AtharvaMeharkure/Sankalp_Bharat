import { useEffect, useMemo, useState } from "react";
import { getFacilities, getOrganization } from "@/features/settings/api";
import { FacilityForm } from "@/features/settings/components/FacilityForm";
import { FacilityList } from "@/features/settings/components/FacilityList";
import { OrganizationForm } from "@/features/settings/components/OrganizationForm";
import { SectionCard } from "@/features/settings/components/SectionCard";
import { getOrganizationId, getSession } from "@/lib/session";
import type { Facility, Organization } from "@/features/settings/types";

type LoadState = "loading" | "ready" | "error";

export function SettingsPage() {
  const session = useMemo(() => getSession(), []);
  const organizationId = useMemo(() => getOrganizationId(), []);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [organizationState, setOrganizationState] = useState<LoadState>("loading");
  const [facilityState, setFacilityState] = useState<LoadState>("loading");
  const [organizationError, setOrganizationError] = useState<string>("");
  const [facilityError, setFacilityError] = useState<string>("");

  useEffect(() => {
    if (!organizationId) {
      setOrganizationState("error");
      setFacilityState("error");
      setOrganizationError(
        "No organization context found. Sign in through the app flow to load settings.",
      );
      setFacilityError(
        "No organization context found. Facility management needs an authenticated organization.",
      );
      return;
    }

    void loadOrganization(organizationId);
    void loadFacilities(organizationId);
  }, [organizationId]);

  async function loadOrganization(id: string) {
    setOrganizationState("loading");
    setOrganizationError("");

    try {
      const data = await getOrganization(id);
      setOrganization(data);
      setOrganizationState("ready");
    } catch (error) {
      setOrganizationState("error");
      setOrganizationError(
        error instanceof Error
          ? error.message
          : "Unable to load organization settings.",
      );
    }
  }

  async function loadFacilities(id: string) {
    setFacilityState("loading");
    setFacilityError("");

    try {
      const data = await getFacilities(id);
      setFacilities(data);
      setSelectedFacility((current) =>
        current ? data.find((item) => item.id === current.id) ?? null : null,
      );
      setFacilityState("ready");
    } catch (error) {
      setFacilityState("error");
      setFacilityError(
        error instanceof Error ? error.message : "Unable to load facilities.",
      );
    }
  }

  function handleFacilitySaved(facility: Facility, mode: "create" | "edit") {
    setFacilities((current) => {
      if (mode === "create") {
        return [facility, ...current];
      }

      return current.map((item) => (item.id === facility.id ? facility : item));
    });

    setSelectedFacility(mode === "edit" ? facility : null);
  }

  if (!session) {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <h2 className="text-xl font-semibold">Authentication required</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6">
          This settings screen expects the login flow to store a session with a
          token and organization id. Sign in through the auth flow before using
          internal settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pine">
          Internal Master Data
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-ink">
          Organization and facility settings
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-steel">
          Use this internal settings area to keep master data accurate before
          emissions records, uploads, and governance workflows start depending on it.
        </p>
      </div>

      <SectionCard
        title="Organization Settings"
        description="Maintain the organization profile that drives reporting context and internal setup."
      >
        {organizationState === "loading" ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm text-steel">
            Loading organization settings...
          </div>
        ) : organizationState === "error" || !organization ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
            {organizationError || "Unable to load organization settings."}
          </div>
        ) : (
          <OrganizationForm organization={organization} onSaved={setOrganization} />
        )}
      </SectionCard>

      <SectionCard
        title="Facility Management"
        description="Track the operational sites that own activity records, facility reporting, and governance follow-up."
      >
        {facilityState === "error" ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
            {facilityError || "Unable to load facilities."}
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <FacilityList
              facilities={facilities}
              loading={facilityState === "loading"}
              selectedFacilityId={selectedFacility?.id}
              onSelect={setSelectedFacility}
              onAddNew={() => setSelectedFacility(null)}
            />
            <div className="rounded-3xl bg-mist/60 p-4">
              <FacilityForm
                organizationId={organizationId ?? ""}
                selectedFacility={selectedFacility}
                onSaved={handleFacilitySaved}
                onCancelEdit={() => setSelectedFacility(null)}
              />
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
