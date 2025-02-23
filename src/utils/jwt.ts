import jwtDecode from "jwt-decode";
import { verify, sign } from "jsonwebtoken";
import axios from "./axios";
import axiosInstance from "./axios";

const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode<{ exp: number }>(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

//  original version
//  const handleTokenExpired = (exp) => {
//   let expiredTimer;

//   window.clearTimeout(expiredTimer);
//   const currentTime = Date.now();
//   const timeLeft = exp * 1000 - currentTime;
//   console.log(timeLeft);
//   expiredTimer = window.setTimeout(() => {
//     console.log('expired');
//   }, timeLeft);
// };

const handleTokenExpired = (exp: number) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;

  window.clearTimeout(expiredTimer);
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;
  console.log(timeLeft);
  expiredTimer = window.setTimeout(() => {
    console.log("expired");
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common.Authorization;
    delete axiosInstance.defaults.headers.common.Authorization;
    window.location.reload();
  }, timeLeft);
};

const setSession = (accessToken: string | null) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    // This function below will handle when token is expired
    const { exp }: any = jwtDecode(accessToken);
    handleTokenExpired(exp);
  } else {
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common.Authorization;
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

export { verify, sign, isValidToken, setSession };
