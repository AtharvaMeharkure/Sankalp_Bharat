import { z } from "zod";

const supplierMetricSchema = z.object({
  activityType: z.string().trim().min(1, "Activity type is required."),
  value: z.coerce
    .number({
      invalid_type_error: "Value is required.",
    })
    .finite("Value must be a valid number.")
    .positive("Value must be greater than zero."),
  unit: z.string().trim().min(1, "Unit is required."),
  note: z.string().trim().optional(),
});

export const supplierSubmissionSchema = z.object({
  tokenHash: z.string().trim().min(1, "Submission token is required."),
  metrics: z
    .array(supplierMetricSchema)
    .min(1, "Add at least one metric before submitting."),
  evidence: z.array(z.instanceof(File)).default([]),
});
