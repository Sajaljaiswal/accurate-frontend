import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const fetchAllUsers = async () => {
  // Use 'api.get' instead of 'axios.get'
  // Use the string "/auth/users" (or just "/users" depending on your backend route)
  return await api.get("/auth/users"); 
};

export const createUser = async (userData) => {
  return await api.post("/auth/register", userData); // Ensure this matches your backend route
};
export default api;
