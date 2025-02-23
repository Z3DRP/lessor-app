import axios from "axios";

const isDev = import.meta.env.VITE_ENVIRONMENT === "dev";
const devToken = import.meta.env.VITE_DEV_JWT;
const URL = import.meta.env.VITE_API_BASE_URL;
// need to remove all of the devToken logic

const axiosInstance = axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
    //...(isDev && devToken ? { Authorization: `Bearer ${devToken}` } : {}),
  },
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     if (isDev && devToken) {
//       config.headers = config.headers ?? {};
//       config.headers["Authorization"] = `Bearer ${devToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

axiosInstance.interceptors.response.use(
  //(response) => response?.data,
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export default axiosInstance;
