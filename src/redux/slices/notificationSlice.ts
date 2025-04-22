import { Notification } from "@/types/notifications";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { notificationApi } from "services/notificationApi";
import { RootState } from "../store";

interface NotificationState {
  notifications: Notification[];
  status: "idle" | "loading" | "failed";
  error?: string;
}

export const initialState: NotificationState = {
  notifications: [],
  status: "idle",
};

export const fetchNotifications = createAsyncThunk(
  "notif/fetchAll",
  async (
    {
      alsrId,
      limit = 10,
      page = 1,
    }: { alsrId: string; limit?: number; page?: number },
    { rejectWithValue }
  ) => {
    try {
      const notifications = await notificationApi.fetchNotifications(
        alsrId,
        limit,
        page
      );
      return notifications ?? [];
    } catch (err: any) {
      return rejectWithValue({
        message: err?.message || err?.error || err || "unknown error",
      });
    }
  }
);

export const createNotification = createAsyncThunk(
  "notif/create",
  async ({ data }: { data: Notification }, { rejectWithValue }) => {
    try {
      const notification = await notificationApi.createNotification(data);
      return notification;
    } catch (err: any) {
      return rejectWithValue({
        message: err?.message || err?.error || err || "unknown error",
      });
    }
  }
);

export const markNotificationAsViewed = createAsyncThunk(
  "notif/updateviewed",
  async (
    { notificationId }: { notificationId: number },
    { rejectWithValue }
  ) => {
    try {
      const notif = await notificationApi.markAsViewed(notificationId);
      return notif;
    } catch (err: any) {
      return rejectWithValue({
        message: err?.message || err?.error || err || "unknown error",
      });
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notif/delete",
  async (
    { notificationId }: { notificationId: string },
    { rejectWithValue }
  ) => {
    try {
      const success = await notificationApi.deleteNotification(notificationId);
      if (!success) {
        return rejectWithValue({
          message: "failed to delete notification",
        });
      }
      return notificationId;
    } catch (err: any) {
      return rejectWithValue({
        message: err?.message || err?.error || err || "unknown error",
      });
    }
  }
);

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    resetNotifications: (state) => {
      state.notifications = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchNotifications.fulfilled,
        (state, action: PayloadAction<Notification[]>) => {
          (state.status = "idle"), (state.notifications = action.payload);
        }
      )
      .addCase(fetchNotifications.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload as string);
      })
      .addCase(markNotificationAsViewed.pending, (state) => {
        state.status = "loading";
      })
      .addCase(markNotificationAsViewed.fulfilled, (state, action) => {
        state.status = "idle";
        const indx = state.notifications.findIndex(
          (n) => n.id === action.payload.id
        );
        if (indx !== -1) {
          state.notifications[indx] = action.payload;
        }
      })
      .addCase(markNotificationAsViewed.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload as string);
      })
      .addCase(deleteNotification.pending, (state) => {
        state.status = "idle";
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (n) => n.id === action.payload
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload as string);
      });
  },
});

export const { resetNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
export const selectNotifications = (state: RootState) =>
  state.notification.notifications;
