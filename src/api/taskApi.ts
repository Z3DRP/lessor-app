import { Task } from "@/types/task";
import axiosInstance from "@/utils/axios";
const taskEP = import.meta.env.VITE_TASK_EP;

export const taskApi = {
  async getTask(tid: string) {
    const res = await axiosInstance.get(`${taskEP}/${tid}`).catch((err) => {
      console.error("Error fetching user ", err);
      throw err;
    });

    if (res?.data == null) {
      throw new Error("task response was undefined");
    }
    const { task, success } = res.data;

    if (!success) {
      throw new Error("failed to fetch task");
    }

    return task;
  },

  async getTasks(alessorId: string, page: number, limit: number) {
    const res = await axiosInstance
      .get(`${taskEP}/${alessorId}`, {
        params: { page: page, limit: limit },
      })
      .catch((err) => {
        console.error("error fetching task ", err);
        throw err;
      });

    if (res?.data == null) {
      throw new Error("task response was undefined");
    }

    const { tasks, success } = res.data;

    if (!success) {
      throw new Error("failed fetch tasks");
    }

    return tasks;
  },

  async createTask(taskData: Partial<Task>) {
    const res = await axiosInstance.post(taskEP, taskData).catch((err) => {
      console.error("error saving task ", err);
      throw err;
    });

    if (res?.data == null) {
      throw new Error("save task response was undefined");
    }

    const { task, success } = res.data;

    if (!success) {
      throw new Error("failed to save task");
    }

    return task;
  },

  async updateTask(taskData: Partial<Task> | Task) {
    const res = await axiosInstance.put(taskEP, taskData).catch((err) => {
      console.error("error updating task ", err);
      throw err;
    });

    if (res?.data == null) {
      throw new Error("update task response was undefined");
    }

    const { task, success } = res.data;

    if (!success) {
      throw new Error("failed updating task");
    }

    return task;
  },

  async deleteTask(id: string) {
    await axiosInstance.delete(`${taskEP}/${id}`).catch((err) => {
      console.error("error deleting task");
      throw err;
    });
  },
};
