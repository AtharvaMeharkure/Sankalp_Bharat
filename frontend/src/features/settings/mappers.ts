import type { Facility, Organization } from "@/features/settings/types";
import type {
  FacilityFormValues,
  OrganizationFormValues,
} from "@/features/settings/schemas";

export function toOrganizationFormValues(
  organization: Organization,
): OrganizationFormValues {
  return {
    id: organization.id,
    name: organization.name,
    industry: organization.industry,
    reportingYear: organization.reportingYear,
  };
}

export function toFacilityFormValues(
  facility: Facility | null,
  organizationId: string,
): FacilityFormValues {
  return {
    id: facility?.id,
    organizationId,
    name: facility?.name ?? "",
    location: facility?.location ?? "",
    type: facility?.type ?? "",
  };
}
