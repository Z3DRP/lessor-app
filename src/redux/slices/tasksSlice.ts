import { Task } from "@/types/task";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { taskApi } from "api/taskApi";
import { RootState } from "../store";

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
      if (tasks == null || tasks?.length === 0) {
        return [];
      }

      return tasks;
    } catch (err: any) {
      console.log("error fetching tasks state: ", err);
      return rejectWithValue({ message: err.message || "unknown error" });
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async ({ data }: { data: Partial<Task> }, { rejectWithValue }) => {
    try {
      const task = await taskApi.createTask(data);
      return task;
    } catch (err: any) {
      console.log("error creating task state: ", err);
      return rejectWithValue({ message: err?.message || "unknown error" });
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ data }: { data: Partial<Task> | Task }, { rejectWithValue }) => {
    try {
      const task = await taskApi.updateTask(data);
      return task;
    } catch (err: any) {
      console.log("error updating task state: ", err);
      return rejectWithValue({ message: err?.message || "unkown error" });
    }
  }
);

export const updateTaskPriorities = createAsyncThunk(
  "tasks/update/priorities",
  async ({ data }: { data: Partial<Task>[] | Task[] }, { rejectWithValue }) => {
    try {
      const tasks = await taskApi.updatePriorities(data);

      return tasks;
    } catch (err: any) {
      console.log("error updating task priorities: ", err);
      return rejectWithValue({ message: err?.message || "unknown error" });
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
      return rejectWithValue({ message: err?.message || "unknown error" });
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
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        (state.status = "idle"), (state.tasks = action.payload);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
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
        state.status = "idle";
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
      })
      .addCase(updateTaskPriorities.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTaskPriorities.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateTaskPriorities.fulfilled, (state, action) => {
        const indx = state.tasks.findIndex((t) => t.id === action.payload.tid);
        if (indx !== -1) {
          state.tasks[indx] = action.payload;
        }
      });
  },
});

export const { resetTasks } = taskSlice.actions;
export default taskSlice.reducer;
export const selectTasks = (state: RootState) => state.task.tasks;
