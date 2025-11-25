// frontend/src/api/axios.js
import axios from "axios";

const base = import.meta.env.VITE_API_BASE || "https://ai-doc-authoring.onrender.com";

const api = axios.create({
  baseURL: base,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
