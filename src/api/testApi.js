import api from "./axios"; // ✅ central axios instance

export const addTest = (payload) => {
  return api.post("/lab/tests", payload);
};

export const getAllTests = (page, limit, search, status, category) => {
  return api.get("/lab/tests", {
    params: { page, limit, search, status, category },
  });
};

export const updateTest = (id, payload) => {
  return api.put(`/lab/tests/${id}`, payload);
};

export const deleteTest = (id) => {
  return api.delete(`/lab/tests/${id}`);
};