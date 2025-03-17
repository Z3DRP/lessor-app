import axiosInstance from "@/utils/axios";
import { MaintenanceWorker } from "@/types/worker";
const lessorEp = import.meta.env.VITE_ALESSOR_EP;
const workerEp = import.meta.env.VITE_WORKER_EP;

export const workerApi = {
  async getWorker(id: string) {
    const res = await axiosInstance.get(`${workerEp}/${id}`).catch((err) => {
      console.error("error fetching worker ", err);
      throw err;
    });

    if (res?.data == undefined) {
      throw new Error("fetch worker response was undefined");
    }

    const { worker, success } = res.data;

    if (!success) {
      throw new Error("unknown error fetching worker");
    }

    return worker;
  },

  async getWorkers(alsrId: string, page: number, limit: number) {
    const res = await axiosInstance
      .get(`${lessorEp}/${alsrId}/${workerEp}`, {
        params: { page, limit },
      })
      .catch((err) => {
        console.error("error fetching workers ", err);
        throw err;
      });

    if (res?.data == undefined) {
      throw new Error("fetch workers repsonse undefined");
    }

    const { workers, success } = res.data;

    if (!success) {
      throw new Error("unexpected error fetching workers");
    }

    return workers;
  },

  async createWorker(data: Partial<MaintenanceWorker>) {
    const res = await axiosInstance.put(workerEp, data).catch((err) => {
      console.error("error creating worker ", err);
      throw err;
    });

    if (res?.data == undefined) {
      throw new Error("create worker response undefined");
    }

    const { worker, success } = res.data;

    if (!success) {
      throw new Error("unexpected error creating worker");
    }

    return worker;
  },

  async updateWorker(data: Partial<MaintenanceWorker> | MaintenanceWorker) {
    const res = await axiosInstance
      .put(`${workerEp}/${data.uid}`, data)
      .catch((err) => {
        console.error("error updating worker");
        throw err;
      });

    if (res?.data == undefined) {
      throw new Error("update worker response was undefined");
    }

    const { worker, success } = res.data;

    if (!success) {
      throw new Error("unexpected error updating worker");
    }

    return worker;
  },

  async deleteWorker(id: string) {
    const res = await axiosInstance.delete(`${workerEp}/${id}`).catch((err) => {
      console.error("error deleting worker");
      throw err;
    });

    if (res?.data === undefined) {
      throw new Error("delete worker response was undefined");
    }

    // should return true or false
    return res?.data;
  },
};
