import { http, normalizeApiError } from "@/lib/http";
import type { Facility, Organization } from "@/features/settings/types";
import type {
  FacilityFormValues,
  OrganizationFormValues,
} from "@/features/settings/schemas";

function toOrganization(payload: unknown): Organization {
  const item = payload as Record<string, unknown>;

  return {
    id: String(item.id ?? ""),
    name: String(item.name ?? ""),
    industry: String(item.industry ?? ""),
    reportingYear: Number(item.reportingYear ?? 0),
  };
}

function toFacility(payload: unknown): Facility {
  const item = payload as Record<string, unknown>;

  return {
    id: String(item.id ?? ""),
    organizationId: String(item.organizationId ?? ""),
    name: String(item.name ?? ""),
    location: String(item.location ?? ""),
    type: String(item.type ?? ""),
  };
}

export async function getOrganization(id: string): Promise<Organization> {
  try {
    const { data } = await http.get(`/api/organizations/${id}`);
    return toOrganization(data);
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export async function updateOrganization(
  values: OrganizationFormValues,
): Promise<Organization> {
  try {
    const { data } = await http.put(`/api/organizations/${values.id}`, {
      name: values.name,
      industry: values.industry,
      reportingYear: values.reportingYear,
    });

    return toOrganization(data);
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export async function getFacilities(organizationId: string): Promise<Facility[]> {
  try {
    const { data } = await http.get("/api/facilities", {
      params: { organizationId },
    });

    const facilities = Array.isArray(data)
      ? data
      : Array.isArray((data as { facilities?: unknown[] })?.facilities)
        ? (data as { facilities: unknown[] }).facilities
        : [];

    return facilities.map(toFacility);
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export async function createFacility(
  values: FacilityFormValues,
): Promise<Facility> {
  try {
    const { data } = await http.post("/api/facilities", {
      organizationId: values.organizationId,
      name: values.name,
      location: values.location,
      type: values.type,
    });

    return toFacility(data);
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export async function updateFacility(
  values: FacilityFormValues,
): Promise<Facility> {
  try {
    const { data } = await http.put(`/api/facilities/${values.id}`, {
      organizationId: values.organizationId,
      name: values.name,
      location: values.location,
      type: values.type,
    });

    return toFacility(data);
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}
