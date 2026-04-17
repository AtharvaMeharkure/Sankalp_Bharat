import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { submitSupplierResponse } from "@/features/supplier/api";
import { supplierSubmissionSchema } from "@/features/supplier/schemas";
import type {
  SubmitState,
  SupplierSubmissionFormValues,
  SupplierSubmissionPayload,
} from "@/features/supplier/types";

const idleState: SubmitState = { phase: "idle" };

function createEmptyMetric() {
  return {
    activityType: "",
    value: 0,
    unit: "",
    note: "",
  };
}

function buildDefaultValues(tokenHash: string): SupplierSubmissionFormValues {
  return {
    tokenHash,
    metrics: [createEmptyMetric()],
    evidence: [],
  };
}

function buildPayload(
  values: SupplierSubmissionFormValues,
): SupplierSubmissionPayload {
  return {
    tokenHash: values.tokenHash,
    metrics: values.metrics.map((metric) => ({
      activityType: metric.activityType.trim(),
      value: metric.value,
      unit: metric.unit.trim(),
    })),
    evidence: values.evidence,
  };
}

export function SupplierSubmissionPage() {
  const { tokenHash = "" } = useParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>(idleState);
  const [submitted, setSubmitted] = useState(false);
  const defaults = useMemo(
    () => buildDefaultValues(tokenHash),
    [tokenHash],
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupplierSubmissionFormValues>({
    resolver: zodResolver(supplierSubmissionSchema),
    defaultValues: defaults,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "metrics",
  });

  const evidence = watch("evidence");

  function handleEvidenceChange(files: FileList | null) {
    const nextFiles = files ? Array.from(files) : [];
    setValue("evidence", [...evidence, ...nextFiles], {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleRemoveEvidence(index: number) {
    setValue(
      "evidence",
      evidence.filter((_, currentIndex) => currentIndex !== index),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    setSubmitState({
      phase: "submitting",
      message: "Submitting your Scope 3 data and supporting files...",
    });

    try {
      await submitSupplierResponse(buildPayload(values));
      setSubmitted(true);
      setSubmitState({
        phase: "success",
        message: "Submission received successfully.",
      });
    } catch (error) {
      setSubmitState({
        phase: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not submit your response. Please try again.",
      });
    }
  });

  function handleStartAnother() {
    reset(buildDefaultValues(tokenHash));
    setSubmitted(false);
    setSubmitState(idleState);
  }

  if (!tokenHash) {
    return (
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-rose-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-600">
          Link unavailable
        </p>
        <h2 className="mt-3 font-public text-3xl font-semibold text-ink">
          This supplier submission link is missing its token.
        </h2>
        <p className="mt-4 text-sm leading-7 text-steel">
          Please reopen the original invitation link or contact the requesting
          team for a new supplier submission URL.
        </p>
      </section>
    );
  }

  if (submitted) {
    return (
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-emerald-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
          Submission complete
        </p>
        <h2 className="mt-3 font-public text-3xl font-semibold text-ink">
          Thank you. Your supplier response has been sent.
        </h2>
        <p className="mt-4 text-sm leading-7 text-steel">
          Your metrics and any attached evidence are now ready for internal
          review. Keep this tab open only if you need to submit a separate
          response using the same link.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleStartAnother}
            className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Submit another response
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
      <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.6)] backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pine">
          Guided submission
        </p>
        <h2 className="mt-3 font-public text-4xl font-semibold leading-tight text-ink">
          Share the activity data your customer requested.
        </h2>
        <p className="mt-5 text-sm leading-7 text-steel">
          Enter one or more activity lines, then attach any invoices, freight
          records, meter readings, or worksheets that support the values you are
          reporting.
        </p>

        <div className="mt-8 space-y-4 rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              What to include
            </h3>
            <p className="mt-2 text-sm leading-6 text-steel">
              Use one metric row per measurable activity. Keep units exactly as
              they appear in your source documents so the review team can trace
              them cleanly.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Supporting evidence
            </h3>
            <p className="mt-2 text-sm leading-6 text-steel">
              Upload files only if they directly support the submitted values.
              You can include zero or more documents in this step.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Submission token
            </h3>
            <p className="mt-2 break-all rounded-2xl bg-white px-4 py-3 font-mono text-xs text-slate-600">
              {tokenHash}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Scope 3 response
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">
            Submit activity metrics
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-steel">
            Provide the measurable activity values requested in your supplier
            outreach. Required fields are marked during validation before the
            response is sent.
          </p>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
          <input type="hidden" {...register("tokenHash")} />

          <div className="space-y-4">
            {fields.map((field, index) => {
              const metricErrors = errors.metrics?.[index];

              return (
                <div
                  key={field.id}
                  className="rounded-[1.75rem] border border-slate-200 bg-slate-50/70 p-5"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        Metric row {index + 1}
                      </h4>
                      <p className="text-xs text-steel">
                        One activity type, one value, one unit.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-steel transition hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-slate-800">
                        Activity type
                      </span>
                      <input
                        {...register(`metrics.${index}.activityType`)}
                        placeholder="Upstream transportation"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20"
                      />
                      {metricErrors?.activityType?.message ? (
                        <p className="text-xs font-medium text-rose-600">
                          {metricErrors.activityType.message}
                        </p>
                      ) : null}
                    </label>

                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-slate-800">
                        Unit
                      </span>
                      <input
                        {...register(`metrics.${index}.unit`)}
                        placeholder="km, kWh, liters"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20"
                      />
                      {metricErrors?.unit?.message ? (
                        <p className="text-xs font-medium text-rose-600">
                          {metricErrors.unit.message}
                        </p>
                      ) : null}
                    </label>

                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-slate-800">
                        Value
                      </span>
                      <input
                        type="number"
                        step="any"
                        {...register(`metrics.${index}.value`)}
                        placeholder="0"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20"
                      />
                      {metricErrors?.value?.message ? (
                        <p className="text-xs font-medium text-rose-600">
                          {metricErrors.value.message}
                        </p>
                      ) : null}
                    </label>

                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-slate-800">
                        Context note
                      </span>
                      <input
                        {...register(`metrics.${index}.note`)}
                        placeholder="Optional internal description"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/20"
                      />
                      <p className="text-xs text-steel">
                        Optional for clarity. This note stays on the form and is
                        not sent in the request payload.
                      </p>
                    </label>
                  </div>
                </div>
              );
            })}

            {errors.metrics?.message ? (
              <p className="text-xs font-medium text-rose-600">
                {errors.metrics.message}
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => append(createEmptyMetric())}
              className="rounded-2xl border border-dashed border-pine/50 px-4 py-3 text-sm font-semibold text-pine transition hover:border-pine hover:bg-teal-50"
            >
              Add another metric
            </button>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/70 p-5">
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold text-slate-900">
                Evidence files
              </h4>
              <p className="text-sm leading-6 text-steel">
                Attach zero or more supporting files. The backend will enforce
                any file acceptance policy.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(event) => handleEvidenceChange(event.target.files)}
                className="block w-full max-w-md rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              <span className="text-xs text-steel">
                Files stay attached until you remove them or submit successfully.
              </span>
            </div>

            {evidence.length > 0 ? (
              <div className="mt-4 space-y-3">
                {evidence.map((file, index) => (
                  <div
                    key={`${file.name}-${file.lastModified}-${index}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{file.name}</p>
                      <p className="text-xs text-steel">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEvidence(index)}
                      className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-steel transition hover:border-slate-400 hover:text-slate-900"
                    >
                      Remove file
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {submitState.phase !== "idle" && submitState.message ? (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                submitState.phase === "error"
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : submitState.phase === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              {submitState.message}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
            <p className="text-xs leading-5 text-steel">
              Submitted payload includes the token hash, structured metrics, and
              any files you attach here.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit response"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
