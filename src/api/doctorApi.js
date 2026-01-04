import api from "./axios"; // ✅ reuse central axios instance

export const createDoctor = (data) => {
  return api.post("/doctor", data);
};

export const getAllDoctors = () => {
  return api.get("/doctor");
};

export const assignDoctorTest = (payload) => {
  return api.post("/doctorTests", payload);
};