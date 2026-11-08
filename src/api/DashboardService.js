import api from "./axiosConfig";

export const getDashboardSummary = async () => {
  return await api.get("/dashboard/summary");
};
