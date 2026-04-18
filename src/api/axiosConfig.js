import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// REQUEST INTERCEPTOR: Nempelin Token otomatis
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR: Handle Auto-Logout jika 401/403
api.interceptors.response.use(
  (response) => {
    // Tambahkan signature signature di setiap hit API (Audit Trail DevTools)
    console.log(
      "%c[ZIROCRAFT-LOG] %cAPI Call Success",
      "color: #0dcaf0; font-weight: bold",
      "color: gray",
    );
    return response;
  },
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
