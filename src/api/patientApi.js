import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});


export const registerPatient = (payload) =>
  api.post("/patients/register", payload);

export const getTodayPatientsCount = () => {
  return api.get("/patients/today/count");
};
export const updatePatient = (id, payload) =>
  api.put(`/patients/${id}`, payload);

export const settleBilling = (id, payload) =>
  api.patch(`/patients/${id}/settle`, payload);

export const getAllPatients = () => api.get("/patients");
