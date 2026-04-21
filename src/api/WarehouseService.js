import api from "./AxiosConfig";

export const getWarehouses = async (page = 0, size = 10) => {
  return await api.get(`/warehouses?page=${page}&size=${size}`);
};

export const createWarehouse = async (data) => {
  return await api.post("/warehouses", data);
};
