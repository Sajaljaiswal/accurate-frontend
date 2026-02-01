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

export const getAllPatients = (params) => {
  return api.get("/patients", {
    params: {
      page: params.page,
      limit: params.limit,
      search: params.search,
      fromDate: params.fromDate,
      toDate: params.toDate,
      labNo: params.labNo,
        mobile: params.mobile,
        orderId: params.orderId,
        panelName: params.panelName,   // ✅ Added
        doctorName: params.doctorName,
    },
  });
};

export const getPatientById = (id) => {
  return api.get(`/patients/${id}`);
}
export const getDailyBusinessStats = ({ startDate, endDate }) => {
  return api.get("/patients/business-stats", {
    params: { startDate, endDate },
  });
};
