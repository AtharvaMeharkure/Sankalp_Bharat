import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { createFacility, updateFacility } from "@/features/settings/api";
import { FormField } from "@/features/settings/components/FormField";
import { InlineStatus } from "@/features/settings/components/InlineStatus";
import { toFacilityFormValues } from "@/features/settings/mappers";
import { facilitySchema, type FacilityFormValues } from "@/features/settings/schemas";
import type { Facility, SubmitState } from "@/features/settings/types";

type FacilityFormProps = {
  organizationId: string;
  selectedFacility: Facility | null;
  onSaved: (facility: Facility, mode: "create" | "edit") => void;
  onCancelEdit: () => void;
};

const idleState: SubmitState = { phase: "idle" };

export function FacilityForm({
  organizationId,
  selectedFacility,
  onSaved,
  onCancelEdit,
}: FacilityFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>(idleState);
  const mode = selectedFacility ? "edit" : "create";

  const defaults = useMemo(
    () => toFacilityFormValues(selectedFacility, organizationId),
    [selectedFacility, organizationId],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FacilityFormValues>({
    resolver: zodResolver(facilitySchema),
    defaultValues: defaults,
  });

  useEffect(() => {
    reset(defaults);
    setSubmitState(idleState);
  }, [defaults, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitState({
      phase: "submitting",
      message:
        mode === "create"
          ? "Creating facility..."
          : "Saving facility changes...",
    });

    try {
      const facility =
        mode === "create"
          ? await createFacility(values)
          : await updateFacility(values);

      onSaved(facility, mode);
      setSubmitState({
        phase: "success",
        message:
          mode === "create"
            ? "Facility created successfully."
            : "Facility updated successfully.",
      });

      if (mode === "create") {
        reset(toFacilityFormValues(null, organizationId));
      }
    } catch (error) {
      setSubmitState({
        phase: "error",
        message:
          error instanceof Error ? error.message : "Unable to save facility.",
      });
    }
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-ink">
            {mode === "create" ? "Add facility" : "Edit facility"}
          </h3>
          <p className="text-sm text-steel">
            Capture the operational sites that will own records and reporting.
          </p>
        </div>
        {mode === "edit" ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-steel transition hover:border-slate-400 hover:text-slate-900"
          >
            Cancel edit
          </button>
        ) : null}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          label="Facility name"
          placeholder="Plant 01"
          error={errors.name?.message}
          {...register("name")}
        />
        <FormField
          label="Facility type"
          placeholder="Manufacturing plant"
          hint="Keep this human-readable for internal operators."
          error={errors.type?.message}
          {...register("type")}
        />
        <div className="md:col-span-2">
          <FormField
            label="Location"
            placeholder="Pune, Maharashtra"
            error={errors.location?.message}
            {...register("location")}
          />
        </div>
      </div>

      <InlineStatus state={submitState} />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create facility"
              : "Save facility"}
        </button>
      </div>
    </form>
  );
}
