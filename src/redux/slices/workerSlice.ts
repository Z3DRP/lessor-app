import { MaintenanceWorker } from "@/types/worker";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { workerApi } from "api/workerApi";
import { RootState } from "../store";

interface WorkerState {
  workers: MaintenanceWorker[];
  status: "idle" | "loading" | "failed";
  error?: string;
}

const initialState: WorkerState = {
  workers: [],
  status: "idle",
};

export const fetchWorkers = createAsyncThunk(
  "workers/fetchAll",
  async (
    {
      alsrId,
      page,
      limit,
    }: { alsrId: string; page: number | undefined; limit: number | undefined },
    { rejectWithValue }
  ) => {
    try {
      const workers = await workerApi.getWorkers(
        alsrId,
        page ?? 1,
        limit ?? 20
      );
      if (workers == null || workers.length === 0) {
        return [];
      }
      return workers;
    } catch (err: any) {
      console.error("error fetching worker state ", err);
      return rejectWithValue({ message: err || "idunno" });
    }
  }
);

export const createWorker = createAsyncThunk(
  "worker/create",
  async (
    { data }: { data: Partial<MaintenanceWorker> },
    { rejectWithValue }
  ) => {
    try {
      const worker = await workerApi.createWorker(data);
      return worker;
    } catch (err: any) {
      console.error("error creating new worker state ", err);
      return rejectWithValue(`state error ${err?.error ?? err?.message}`);
    }
  }
);

export const updateWorker = createAsyncThunk(
  "worker/update",
  async (
    { data }: { data: Partial<MaintenanceWorker> | MaintenanceWorker },
    { rejectWithValue }
  ) => {
    try {
      const worker = await workerApi.updateWorker(data);
      return worker;
    } catch (err: any) {
      console.error("error updating worker state ", err);
      return rejectWithValue(`state error ${err.error ?? err.message}`);
    }
  }
);

export const deleteWorker = createAsyncThunk(
  "worker/delete",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const success = await workerApi.deleteWorker(id);
      if (!success) {
        return rejectWithValue("failed to delete worker");
      }

      return id;
    } catch (err: any) {
      console.error("error deleting worker ", err);
      return rejectWithValue(`state error ${err.error ?? err?.message}`);
    }
  }
);

export const workerSlice = createSlice({
  name: "worker",
  initialState,
  reducers: {
    resetWorkers: (state) => {
      state.workers = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchWorkers.fulfilled,
        (state, action: PayloadAction<MaintenanceWorker[]>) => {
          (state.status = "idle"), (state.workers = action.payload);
        }
      )
      .addCase(fetchWorkers.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload as string);
      })
      .addCase(createWorker.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        createWorker.fulfilled,
        (state, action: PayloadAction<MaintenanceWorker>) => {
          (state.status = "idle"), state.workers.push(action.payload);
        }
      )
      .addCase(createWorker.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload as string);
      })
      .addCase(updateWorker.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateWorker.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.workers.findIndex(
          (w) => w.uid === action.payload.uid
        );

        if (index !== -1) {
          state.workers[index] = action.payload;
        }
      })
      .addCase(updateWorker.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteWorker.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteWorker.fulfilled, (state, action) => {
        state.status = "idle";
        state.workers = state.workers.filter((w) => w.uid === action.payload);
      })
      .addCase(deleteWorker.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload as string);
      });
  },
});

export const { resetWorkers } = workerSlice.actions;
export default workerSlice.reducer;
export const selectWorkers = (state: RootState) => state.worker.workers;
