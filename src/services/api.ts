import axios from "axios";

const APIURL = "https://api-renovada-production.up.railway.app";

const api = axios.create({
  baseURL: APIURL,
});

const token = localStorage.getItem("@auth::token");

api.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { APIURL };

export default api;
