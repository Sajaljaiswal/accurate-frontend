import api from "./axios"; // ✅ central axios instance

export const registerPatient = (payload) => {
  return api.post("/patients/register", payload);
};

export const getTodayPatientsCount = () => {
  return api.get("/patients/today/count");
};

export const updatePatient = (id, payload) => {
  return api.put(`/patients/${id}`, payload);
};

export const settleBilling = (id, payload) => {
  return api.patch(`/patients/${id}/settle`, payload);
};

export const getAllPatients = () => {
  return api.get("/patients");
};

export const getPatientById = (id) => {
  return api.get(`/patients/${id}`);
}
export const getDailyBusinessStats = ({ startDate, endDate }) => {
  return api.get("/patients/business-stats", {
    params: { startDate, endDate },
  });
};
