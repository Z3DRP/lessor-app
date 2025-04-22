import { Notification } from "@/types/notifications";
import axiosInstance from "@/utils/axios";

const notifEp = import.meta.env.VITE_NOTIF_EP;
const lessorEp = import.meta.env.VITE_ALESSOR_EP;

export const notificationApi = {
  fetchNotifications: async (
    lessorId: string,
    limit: number = 10,
    page: number = 1
  ) => {
    const res = await axiosInstance
      .get(`${lessorEp}/${lessorId}/${notifEp}`, {
        params: { limit: limit, page: page },
      })
      .catch((err) => {
        console.error("error fetching notifications: ", err);
        throw err;
      });

    if (res?.data == null) {
      throw new Error("notification response was null");
    }

    const { notifications, status } = res.data;

    if (status !== 200) {
      throw new Error("failed to fetch notifications");
    }

    return notifications;
  },

  createNotification: async (data: Partial<Notification>) => {
    const res = await axiosInstance.post(`${notifEp}`, data).catch((err) => {
      console.error("error saving notification: ", err);
      throw err;
    });

    if (isNullResponse(res?.data)) {
      throw new Error("create notification response was null");
    }

    const { notification, status } = res.data;

    if (status != 201) {
      throw new Error("failed to save notification");
    }

    return notification;
  },

  markAsViewed: async (notificationId: number) => {
    const res = await axiosInstance
      .patch(`${notifEp}/${notificationId}`)
      .catch((err) => {
        console.error("error marking notification as viewed ", err);
        throw err;
      });

    if (isNullResponse(res?.data)) {
      throw new Error("mark notification as viewed response was null");
    }
    const { notification, status } = res.data;

    if (status != 200) {
      throw new Error("failed to update notification as viewed");
    }

    return notification;
  },

  deleteNotification: async (notificationId: string) => {
    const res = await axiosInstance
      .delete(`${notifEp}/${notificationId}`)
      .catch((err) => {
        console.error("error deleting notification");
        throw err;
      });

    if (res?.status != 204) {
      throw new Error(`failed to delete notification status ${res?.status}`);
    }

    return true;
  },
};

const isNullResponse = (response: any | null | undefined) => response == null;
