import api from "./axiosConfig";

export const processOutbound = async (data) => {
  // Membawa requestId untuk keamanan Idempotency
  return await api.post("/outbound", data);
};
