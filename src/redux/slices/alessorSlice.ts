import { Alessor } from "@/types/alessor";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { alessorApi } from "services/alessorApi";
import { RootState } from "../store";

interface AlessorState {
  alessor: Alessor | null;
  status: "idle" | "loading" | "failed";
  error?: string;
}

export const initialState: AlessorState = {
  alessor: null,
  status: "idle",
};

export const fetchAlessor = createAsyncThunk(
  "alessor/fetch",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const lessor = await alessorApi.fetch(id);
      return lessor;
    } catch (err: any) {
      console.log("error fetching alessor state: ", err);
      return rejectWithValue({
        message: err?.message || err?.error || err || "unknown error",
      });
    }
  }
);

export const saveAlessor = createAsyncThunk(
  "alessor/create",
  async ({ data }: { data: Partial<Alessor> }, { rejectWithValue }) => {
    try {
      const alessor = alessorApi.createAlessor(data);
      return alessor;
    } catch (err: any) {
      return rejectWithValue({
        message: err?.message || err?.error || err || "unknown error",
      });
    }
  }
);

export const updateAlessor = createAsyncThunk(
  "alessor/update",
  async (
    { data }: { data: Partial<Alessor> | Alessor },
    { rejectWithValue }
  ) => {
    try {
      const alessor = alessorApi.updateAlessor(data);
      return alessor;
    } catch (err: any) {
      return rejectWithValue({
        message: err?.message || err?.error || err || "unknown error",
      });
    }
  }
);

export const deleteAlessor = createAsyncThunk(
  "alessor/delete",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      await alessorApi.deleteAlessor(id);
      return id;
    } catch (err: any) {
      return rejectWithValue({
        message: err?.message || err?.error || err || "unknown error",
      });
    }
  }
);

export const alessorSlice = createSlice({
  name: "alessor",
  initialState,
  reducers: {
    resetAlessor: (state) => {
      state.alessor = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlessor.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAlessor.fulfilled,
        (state, action: PayloadAction<Alessor>) => {
          (state.status = "idle"), (state.alessor = action.payload);
        }
      )
      .addCase(fetchAlessor.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload as string);
      })
      .addCase(saveAlessor.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveAlessor.fulfilled, (state, action) => {
        (state.status = "idle"), (state.alessor = action.payload);
      })
      .addCase(saveAlessor.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload as string);
      })
      .addCase(updateAlessor.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAlessor.fulfilled, (state, action) => {
        (state.status = "idle"), (state.alessor = action.payload);
      })
      .addCase(updateAlessor.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload as string);
      })
      .addCase(deleteAlessor.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteAlessor.fulfilled, (state) => {
        (state.status = "idle"), (state.alessor = null);
      })
      .addCase(deleteAlessor.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload as string);
      });
  },
});

export const { resetAlessor } = alessorSlice.actions;
export default alessorSlice.reducer;
export const selectAlessor = (state: RootState) => state.alessor;
