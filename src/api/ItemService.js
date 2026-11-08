import api from "./axiosConfig";

export const getItems = async (page = 0, size = 10) => {
  return await api.get(`/items?page=${page}&size=${size}`);
};

export const createItem = async (data) => {
  return await api.post("/items", data);
};
