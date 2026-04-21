import api from "./AxiosConfig";

export const getDashboardSummary = async () => {
  return await api.get("/dashboard/summary");
};
