export type SupplierMetric = {
  activityType: string;
  value: number;
  unit: string;
  note?: string;
};

export type SupplierSubmissionFormValues = {
  tokenHash: string;
  metrics: SupplierMetric[];
  evidence: File[];
};

export type SupplierSubmissionPayload = {
  tokenHash: string;
  metrics: Array<{
    activityType: string;
    value: number;
    unit: string;
  }>;
  evidence: File[];
};

export type SupplierSubmissionResponse = {
  submissionId?: string;
  status?: string;
  message?: string;
};

export type SubmitPhase =
  | "idle"
  | "validating"
  | "submitting"
  | "success"
  | "error";

export type SubmitState = {
  phase: SubmitPhase;
  message?: string;
};
