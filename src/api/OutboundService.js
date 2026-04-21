import api from "./AxiosConfig";

export const processOutbound = async (data) => {
  // Membawa requestId untuk keamanan Idempotency
  return await api.post("/outbound", data);
};
