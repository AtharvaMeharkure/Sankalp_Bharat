export type Organization = {
  id: string;
  name: string;
  industry: string;
  reportingYear: number;
};


export type Facility = {
  id: string;
  organizationId: string;
  name: string;
  location: string;
  type: string;
};


export type SubmitPhase = "idle" | "validating" | "submitting" | "success" | "error";

export type SubmitState = {
  phase: SubmitPhase;
  message?: string;
};
