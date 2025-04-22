import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import propertyReducer from "./slices/propertiesSlice";
import taskReducer from "./slices/tasksSlice";
import workerReducer from "./slices/workerSlice";
import alessorReducer from "./slices/alessorSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    property: propertyReducer,
    task: taskReducer,
    worker: workerReducer,
    alessor: alessorReducer,
    notification: notificationReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
