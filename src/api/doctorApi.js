import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const createDoctor = (data) => {
  return api.post("/doctor", data);
};

export const getAllDoctors = () => {
  return api.get("/doctor");
};

export const assignDoctorTest = (payload) =>
  api.post("/doctorTests", payload); // 👈 THIS MUST EXIST

