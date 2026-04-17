import { z } from "zod";

const currentYear = new Date().getFullYear() + 1;

export const organizationSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Organization name is required."),
  industry: z.string().trim().min(1, "Industry is required."),
  reportingYear: z.coerce
    .number({
      invalid_type_error: "Reporting year is required.",
    })
    .int("Reporting year must be a whole number.")
    .gte(2000, "Reporting year must be 2000 or later.")
    .lte(currentYear, `Reporting year must be ${currentYear} or earlier.`),
});

export const facilitySchema = z.object({
  id: z.string().optional(),
  organizationId: z.string().min(1, "Organization id is required."),
  name: z.string().trim().min(1, "Facility name is required."),
  location: z.string().trim().min(1, "Location is required."),
  type: z.string().trim().min(1, "Facility type is required."),
});

export type OrganizationFormValues = z.infer<typeof organizationSchema>;
export type FacilityFormValues = z.infer<typeof facilitySchema>;
