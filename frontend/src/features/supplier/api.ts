import axios from "axios";
import { apiBaseUrl, normalizeApiError } from "@/lib/http";
import type {
  SupplierSubmissionPayload,
  SupplierSubmissionResponse,
} from "@/features/supplier/types";

const publicHttp = axios.create({
  baseURL: apiBaseUrl,
});

export async function submitSupplierResponse(
  payload: SupplierSubmissionPayload,
): Promise<SupplierSubmissionResponse> {
  const formData = new FormData();
  formData.append("tokenHash", payload.tokenHash);
  formData.append("metrics", JSON.stringify(payload.metrics));

  payload.evidence.forEach((file) => {
    formData.append("evidence", file);
  });

  try {
    const { data } = await publicHttp.post("/api/supplier/submit", formData);

    return (data ?? {}) as SupplierSubmissionResponse;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}
