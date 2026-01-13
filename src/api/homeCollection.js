import api from "./axios";

export const createHomeCollections = (data) => {
  return api.post("/home-collections", data);
};

export const getHomeCollections = (data) => {
  return api.get("/home-collections", data);
};
