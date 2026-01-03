import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});
export const createPanel = (data) => api.post("/panels/register", data);
export const getAllPanels = () => api.get("/panels");
