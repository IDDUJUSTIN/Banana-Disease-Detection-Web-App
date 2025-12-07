import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: token expired → redirect to login
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized! Token may be expired.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
