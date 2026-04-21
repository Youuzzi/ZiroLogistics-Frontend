import api from "./AxiosConfig";

/**
 * ZiroLogistics Bin Service Engine
 * Industrial Standard: Handling rack locations per warehouse terminal.
 */

export const createBin = async (data) => {
  return await api.post("/bins", data);
};

export const getBinsByWarehouse = async (warehouseId) => {
  // Memastikan panggil ke endpoint GET /api/v1.0/bins/warehouse/{id}
  return await api.get(`/bins/warehouse/${warehouseId}`);
};
