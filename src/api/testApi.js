import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const addTest = (payload) =>
  api.post("/lab/tests", payload);


export const getAllTests = (page, limit, search, status, category) => {
  return api.get("/lab/tests", {
    params: { page, limit, search, status, category }
  });
};

export const updateTest = (id, payload) => {
  return api.put(`/lab/tests/${id}`, payload);   // ✅ FIX
};

export const deleteTest = (id) => {
  return api.delete(`/lab/tests/${id}`);         // ✅ FIX
};