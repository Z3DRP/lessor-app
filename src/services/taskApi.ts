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
      throw new Error("task response was null");
    }
    const { task, success } = res.data;

    if (!success) {
      throw new Error("failed to fetch task");
    }

    return task;
  },

  async getTasks(alessorId: string, page: number, limit: number) {
    const res = await axiosInstance
      .get(`alessor/${alessorId}/${taskEP}`, {
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

  async getWorkerTasks(workerId: string, page: number, limit: number) {
    const res = await axiosInstance
      .get(`${taskEP}/${workerId}`, {
        params: { page: page, limit: limit },
      })
      .catch((err: any) => {
        console.log("error fetch tasks ", err);
        throw err;
      });

    if (res?.data == null) {
      throw new Error("task resposne was undefined");
    }

    const { tasks, status } = res.data;

    if (status != 200) {
      throw new Error("failed to fetch tasks");
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
    const res = await axiosInstance
      .put(`${taskEP}/${taskData.tid}`, taskData)
      .catch((err) => {
        console.error("error updating task ", err);
        throw err;
      });

    if (res?.data == null) {
      throw new Error("update task response was null");
    }

    const { task, success } = res.data;

    if (!success) {
      throw new Error("failed updating task");
    }

    return task;
  },

  async updatePriority(taskData: Partial<Task> | Task) {
    const res = await axiosInstance
      .put(`${taskEP}/${taskData?.tid}/priority`, taskData)
      .catch((err) => {
        console.error("error updating priority: ", err);
        throw err;
      });

    if (res?.data == null) {
      throw new Error("task priority response was null");
    }

    const { task, success } = res.data;
    if (!success) {
      throw new Error("failed updating task priority");
    }

    return task;
  },

  async updatePriorities(taskData: Partial<Task>[] | Task[]) {
    const res = await axiosInstance
      .put(`${taskEP}/priorities`, taskData)
      .catch((err) => {
        console.log("updating task priority error: ", err);
        throw err;
      });

    if (res?.data == null) {
      throw new Error("bulk task priority update response null");
    }

    const { tasks, success } = res.data;
    if (!success) {
      throw new Error("bulk task priority update failed");
    }

    return tasks;
  },

  async deleteTask(id: string) {
    await axiosInstance.delete(`${taskEP}/${id}`).catch((err) => {
      console.error("error deleting task");
      throw err;
    });

    // TODO: add check for status 204 if is 204 success
  },
};
