import { Alessor } from "@/types/alessor";
import axiosInstance from "@/utils/axios";

const alessorEp = import.meta.env.VITE_ALESSOR_EP;

export const alessorApi = {
  fetch: async (id: string) => {
    const res = await axiosInstance.get(`${alessorEp}/${id}`).catch((err) => {
      console.error("error fetching alessor ", err);
      throw err;
    });

    if (res?.data == null) {
      throw new Error("alessor response was null");
    }

    const { alessor, success } = res.data;

    if (!success) {
      throw new Error("failed to fetch alessor");
    }

    return alessor;
  },

  createAlessor: async (data: Partial<Alessor>) => {
    const res = await axiosInstance.post(alessorEp, data).catch((err) => {
      console.error("error creating alessor: ", err);
      throw err;
    });

    if (res?.data == null) {
      throw new Error("alessor response was null");
    }

    const { alessor, success } = res.data;

    if (!success) {
      return new Error("failed to save alessor");
    }

    return alessor;
  },

  updateAlessor: async (data: Partial<Alessor> | Alessor) => {
    const res = await axiosInstance
      .put(`${alessorEp}/${data.uid}`, data)
      .catch((err) => {
        console.error("error updating alessor", err);
        throw err;
      });

    if (res?.data == null) {
      throw new Error("update alessor response was null");
    }

    const { alessor, success } = res.data;

    if (!success) {
      throw new Error("failed to update alessor");
    }

    return alessor;
  },

  deleteAlessor: async (id: string) => {
    await axiosInstance.delete(`${alessorEp}/${id}`).catch((err) => {
      console.error("failed to delete alessor: ", err);
      throw err;
    });
  },
};
