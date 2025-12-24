import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const addTest = (payload) =>
  api.post("/lab/tests", payload);


export const getAllTests = () => api.get("/lab/tests");