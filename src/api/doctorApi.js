import api from "./axios"; // ✅ reuse central axios instance

export const createDoctor = (data) => {
  return api.post("/doctor", data);
};

export const getAllDoctors = ({ page = 1, limit = 5, search = ""}) => {
  return api.get("/doctor", {
    params: {
      page,
      limit,
      search,
    },
  });
};

export const assignDoctorTest = (payload) => {
  return api.post("/doctorTests", payload);
};