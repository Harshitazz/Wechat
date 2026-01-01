import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
