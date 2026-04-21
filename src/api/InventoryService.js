import api from "./AxiosConfig";

export const getInventoryStocks = async (page = 0, size = 10) => {
  return await api.get(`/inventory/stocks?page=${page}&size=${size}`);
};

export const getInventoryLedger = async (page = 0, size = 10) => {
  return await api.get(`/inventory/ledger?page=${page}&size=${size}`);
};
