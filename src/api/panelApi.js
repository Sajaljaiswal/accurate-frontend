import api from "./axios"; // ✅ central axios instance

export const createPanel = (data) => {
  return api.post("/panels/register", data);
};

export const getAllPanels = () => {
  return api.get("/panels");
};
