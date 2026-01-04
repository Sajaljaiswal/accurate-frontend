// src/api/categoryApi.js
import api from "./axios"; // 👈 use your existing axios instance

export const createCategory = async (name) => {
  return await api.post("/categories/addCategories", { name });
};

export const getAllCategories = async () => {
  return await api.get("/categories/allCategories");
};
