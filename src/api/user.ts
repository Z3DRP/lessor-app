import axiosInstance from "@/utils/axios";
import { ProfileType } from "unions/unions";

const URL = import.meta.env.VITE_API_BASE_URL;
const userEP = import.meta.env.VITE_USER_EP;

export const userApi = {
  async getUser(uid: string) {
    try {
      const res = await axiosInstance.get(`${URL}/${userEP}/${uid}`);
      return res?.data;
    } catch (err) {
      console.error("Error fetching user ", err);
      throw err;
    }
  },

  async signupUser(
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    username: string,
    pwd: string,
    profileType: ProfileType
  ) {
    try {
      const usr = {
        firstName,
        lastName,
        profileType,
        username,
        phone,
        email,
        password: pwd,
      };

      const signupEP = import.meta.env.VITE_SIGN_UP;
      const res = await axiosInstance.post(signupEP, usr).catch((err) => {
        console.log("er response ", res);
        console.log(err);
        throw err;
      });

      console.log("response: ", res);

      return res?.data;
    } catch (err) {
      console.error("Error creating user ", err);
      throw err;
    }
  },

  async signinUser(email: string, password: string) {
    try {
      const signinEP = import.meta.env.VITE_SIGN_IN;
      const res = await axiosInstance
        .post(signinEP, { email, password })
        .catch((err) => {
          console.log(err);
          throw err;
        });

      return res?.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
