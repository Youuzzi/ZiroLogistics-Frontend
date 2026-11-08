import api from "./axiosConfig";

/**
 * ZiroLogistics Inbound Service Engine
 * Standard: High-integrity induction with Idempotency Support.
 */

export const processInbound = async (data) => {
  // Data wajib membawa requestId (UUID)
  return await api.post("/inbound", data);
};
