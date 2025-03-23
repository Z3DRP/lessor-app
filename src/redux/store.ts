import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import propertyReducer from "./slices/propertiesSlice";
import taskReducer from "./slices/tasksSlice";
import workerReducer from "./slices/workerSlice";
import alessorReducer from "./slices/alessorSlice";

export const store = configureStore({
  reducer: {
    property: propertyReducer,
    task: taskReducer,
    worker: workerReducer,
    alessor: alessorReducer,
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
