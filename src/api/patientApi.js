import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});


export const registerPatient = (payload) =>
  api.post("/patients/register", payload);

export const getAllPatients = () => api.get("/patients");
