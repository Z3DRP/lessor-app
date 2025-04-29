import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { Address, Property } from "@/types/property";
import { propertyApi } from "services/propertyApi";

interface PropertyState {
  properties: Property[];
  status: "idle" | "loading" | "failed";
  error?: string;
}

const initialState: PropertyState = {
  properties: [],
  status: "idle",
};

export const fetchProperties = createAsyncThunk(
  "properties/fetchAll",
  async (
    { alsrId, page }: { alsrId: string; page: number | undefined },
    { rejectWithValue }
  ) => {
    try {
      const properties = await propertyApi.getProperties(alsrId, page ?? 1);
      if (properties?.length === 0) {
        return [];
      }

      return properties;
    } catch (err: any) {
      console.log("error fetching property state: ", err);
      return rejectWithValue(`state error: ${err.error}`);
    }
  }
);

export const createProperty = createAsyncThunk(
  "properties/create",
  async (
    {
      data,
      address,
      file,
    }: { data: Partial<Property>; address: Address; file?: File },
    { rejectWithValue }
  ) => {
    try {
      const nwProperty = await propertyApi.createPropertyWithImage(
        data,
        address,
        file
      );
      return nwProperty;
    } catch (err: any) {
      console.log("error updating property state: ", err);
      return rejectWithValue(`state error: ${err.error}`);
    }
  }
);

export const updateProperty = createAsyncThunk(
  "properties/update",
  async (
    {
      updatedData,
      address,
      file,
    }: {
      updatedData: Partial<Property> | Property;
      address?: Address;
      file?: File;
    },
    { rejectWithValue }
  ) => {
    try {
      const property = await propertyApi.updateProperty(
        updatedData,
        address,
        file
      );
      return property;
    } catch (err: any) {
      console.log(`error updating property state: `, err);
      return rejectWithValue(
        `state error: ${err.error ?? JSON.stringify(err)}`
      );
    }
  }
);

// this needs to return the full property and image
export const updatePropertyImage = createAsyncThunk(
  "properties/update-image",
  async ({ id, file }: { id: string; file: File }, { rejectWithValue }) => {
    try {
      const { success } = await propertyApi.updatePropertyImage(id, file);
      if (!success) {
        throw new Error("updated property image failed");
      }

      return true;
    } catch (err: any) {
      console.log("error updating property image: ", err);
      return rejectWithValue(`state error: ${err ?? err.message ?? err.error}`);
    }
  }
);

export const deleteProperty = createAsyncThunk(
  "property/delete",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      await propertyApi.deleteProeprty(id);
      return id;
    } catch (err: any) {
      console.log("error deleting property state: ", err);
      return rejectWithValue({
        message: err?.message || err?.error || err || "unknown error",
      });
    }
  }
);

export const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    resetProperties: (state) => {
      state.properties = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchProperties.fulfilled,
        (state, action: PayloadAction<Property[]>) => {
          (state.status = "idle"), (state.properties = action.payload);
        }
      )
      .addCase(fetchProperties.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload as string);
      })
      .addCase(createProperty.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        createProperty.fulfilled,
        (state, action: PayloadAction<Property>) => {
          (state.status = "idle"), state.properties.push(action.payload);
          // state.status = "idle";
          // state.properties.push(action.payload);
        }
      )
      .addCase(createProperty.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload as string);
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.properties.findIndex(
          (p) => p.pid === action.payload.pid
        );
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
      })
      .addCase(updateProperty.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProperty.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload as string);
      })
      .addCase(deleteProperty.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.status = "idle";
        state.properties = state.properties.filter(
          (p) => p.pid !== action.payload
        );
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload as string);
      });
  },
});

export const { resetProperties } = propertySlice.actions;
export default propertySlice.reducer;
export const selectProperties = (state: RootState) => state.property.properties;
