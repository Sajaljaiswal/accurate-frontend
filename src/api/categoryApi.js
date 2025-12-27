// api/categoryApi.js
import axios from 'axios';

const API_URL = "http://localhost:5000/api/categories";

export const createCategory = async (name) => {
  // Must match the /addCategories path in categoryRoutes.js
  return await axios.post(`${API_URL}/addCategories`, { name });
};

export const getAllCategories = async () => {
  return await axios.get(`${API_URL}/allCategories`);
};