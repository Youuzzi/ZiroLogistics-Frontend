import api from "./AxiosConfig";

export const processTransfer = async (data) => {
  // Idempotency support: requestId wajib ada
  return await api.post("/transfer", data);
};
