import { SignupRequest } from "@/types/user";
import axiosInstance from "@/utils/axios";
import { Profiles } from "enums/enums";
import { ProfileType } from "unions/unions";

const userEP = import.meta.env.VITE_USER_EP;

export const userApi = {
  async getUser(uid: string) {
    const res = await axiosInstance.get(`${userEP}/${uid}`).catch((err) => {
      console.error("Error fetching user ", err);
      throw err;
    });
    return res?.data;
  },

  async signupUser(
    userInfo: SignupRequest
    // firstName: string,
    // lastName: string,
    // phone: string,
    // email: string,
    // username: string,
    // pwd: string,
    // profileType: ProfileType
  ) {
    try {
      //TODO: refactor
      let usr;
      let res;
      const signupEP = import.meta.env.VITE_SIGN_UP;
      const workerSignupEP = import.meta.env.VITE_WORKER_EP;

      if (userInfo.profileType === Profiles.Worker) {
        usr = {
          firstName: userInfo?.firstName,
          lastName: userInfo?.lastName,
          profileType: userInfo.profileType,
          username: userInfo.username,
          phone: userInfo.phone,
          email: userInfo.email,
          password: userInfo.password,
          title: userInfo.title,
          startDate: userInfo.startDate,
          payRate: userInfo.payRate,
          lessorId: userInfo.lessorId,
          paymentMethod: userInfo.paymentMethod,
        };

        res = await axiosInstance
          .post(`${signupEP}/${workerSignupEP}`, usr)
          .catch((err) => {
            console.error("error signing up worker ", err);
            throw err;
          });
      } else {
        usr = {
          firstName: userInfo?.firstName,
          lastName: userInfo?.lastName,
          profileType: userInfo.profileType,
          username: userInfo.username,
          phone: userInfo.phone,
          email: userInfo.email,
          password: userInfo.password,
        };
        res = await axiosInstance.post(signupEP, usr).catch((err) => {
          console.log("error signing up alessor ", err);
          throw err;
        });
      }

      console.log("response: ", res);

      return res?.data;
    } catch (err) {
      console.error("Error creating user ", err);
      throw err;
    }
  },

  // validates jwt claims
  async getUserDetails() {
    const claimsEP = import.meta.env.VITE_CLAIMS_EP;
    const res = await axiosInstance.get(claimsEP).catch((err) => {
      console.log(err.error);
    });

    return res?.data;
  },

  async signinUser(email: string, password: string) {
    const signinEP = import.meta.env.VITE_SIGN_IN;
    const res = await axiosInstance
      .post(signinEP, { email, password })
      .catch((err) => {
        console.log(err.error);
        throw err;
      });

    return res?.data;
  },
};
