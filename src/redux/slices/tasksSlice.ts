import { Task } from "@/types/task";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { taskApi } from "api/taskApi";
import { RootState } from "../store";
import { fetchProperties } from "./propertiesSlice";

interface TaskState {
  tasks: Task[];
  status: "idle" | "loading" | "failed";
  error?: string;
}

export const initialState: TaskState = {
  tasks: [],
  status: "idle",
};

export const fetchTasks = createAsyncThunk(
  "tasks/fetchAll",
  async (
    {
      alsrId,
      page,
      limit = 10,
    }: { alsrId: string; page: number | undefined; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const tasks = await taskApi.getTasks(alsrId, page ?? 1, limit);
      if (tasks?.length === 0) {
        return [];
      }

      return tasks;
    } catch (err: any) {
      console.log("error fetching tasks state: ", err);
      return rejectWithValue(`state error: ${err.error}`);
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async ({ data }: { data: Partial<Task> }, { rejectWithValue }) => {
    try {
      const { task, success } = await taskApi.createTask(data);
      if (!success) {
        throw new Error("update task request failed");
      }
      return task;
    } catch (err: any) {
      console.log("error creating task state: ", err);
      return rejectWithValue(`state error: ${err.error}`);
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ data }: { data: Partial<Task> | Task }, { rejectWithValue }) => {
    try {
      const { task, success } = await taskApi.updateTask(data);
      if (!success) {
        throw new Error("update task failed");
      }
      return task;
    } catch (err: any) {
      console.log("error updating task state: ", err);
      return rejectWithValue(`state error: ${err.error}`);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      await taskApi.deleteTask(id);
      return id;
    } catch (err: any) {
      console.log("error deleting tasks state: ", err);
      return rejectWithValue(`state error: ${err.error}`);
    }
  }
);

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    resetTasks: (state) => {
      state.tasks = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchProperties.fulfilled,
        (state, action: PayloadAction<Task[]>) => {
          (state.status = "idle"), (state.tasks = action.payload);
        }
      )
      .addCase(fetchProperties.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload as string);
      })
      .addCase(createTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        (state.status = "idle"), state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload as string);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (t) => t.tid === action.payload.tid
        );

        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.tid === action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload as string);
      });
  },
});

export const { resetTasks } = taskSlice.actions;
export default taskSlice.reducer;
export const selectTasks = (state: RootState) => state.task.tasks;
