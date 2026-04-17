import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { organizationSchema, type OrganizationFormValues } from "@/features/settings/schemas";
import { updateOrganization } from "@/features/settings/api";
import type { Organization, SubmitState } from "@/features/settings/types";
import { toOrganizationFormValues } from "@/features/settings/mappers";
import { FormField } from "@/features/settings/components/FormField";
import { InlineStatus } from "@/features/settings/components/InlineStatus";

type OrganizationFormProps = {
  organization: Organization;
  onSaved: (organization: Organization) => void;
};

const idleState: SubmitState = { phase: "idle" };

export function OrganizationForm({ organization, onSaved }: OrganizationFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>(idleState);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: toOrganizationFormValues(organization),
  });

  useEffect(() => {
    reset(toOrganizationFormValues(organization));
    setSubmitState(idleState);
  }, [organization, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitState({
      phase: "submitting",
      message: "Saving organization settings...",
    });

    try {
      const updated = await updateOrganization(values);
      onSaved(updated);
      setSubmitState({
        phase: "success",
        message: "Organization settings saved successfully.",
      });
    } catch (error) {
      setSubmitState({
        phase: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to save organization settings.",
      });
    }
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          label="Organization name"
          placeholder="CarbonLens Manufacturing Pvt Ltd"
          error={errors.name?.message}
          {...register("name")}
        />
        <FormField
          label="Industry"
          placeholder="Precision manufacturing"
          error={errors.industry?.message}
          {...register("industry")}
        />
        <FormField
          label="Reporting year"
          type="number"
          placeholder="2026"
          hint="Use the active reporting year for dashboard rollups and exports."
          error={errors.reportingYear?.message}
          {...register("reportingYear")}
        />
      </div>

      <InlineStatus state={submitState} />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl bg-pine px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save organization"}
        </button>
      </div>
    </form>
  );
}
