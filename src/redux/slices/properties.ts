import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { Property } from "@/types/property";
import { propertyApi } from "api/properties";

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
  "properties/fetchProperties",
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
  "properties/createProperty",
  async (
    { data, file }: { data: Partial<Property>; file?: File },
    { rejectWithValue }
  ) => {
    try {
      //const nwProperty = await propertyApi.addProperty(data);
      const nwProperty = await propertyApi.createPropertyWithImage(data, file);
      return nwProperty;
    } catch (err: any) {
      console.log("error updating property state: ", err);
      return rejectWithValue(`state error: ${err.error}`);
    }
  }
);

export const updateProperty = createAsyncThunk(
  "properties/updateProperty",
  async (
    {
      id,
      updatedData,
    }: { id: string; updatedData: Partial<Property> | Property },
    { rejectWithValue }
  ) => {
    try {
      const updatedProperty = await propertyApi.updateProperty(id, updatedData);
      return updatedProperty;
    } catch (err: any) {
      console.log(`error updating property state: `, err);
      return rejectWithValue(`state error: ${err.error}`);
    }
  }
);

export const deleteProperty = createAsyncThunk(
  "property/deleteProperty",
  async (id: string, { rejectWithValue }) => {
    try {
      await propertyApi.deleteProeprty(id);
      return id;
    } catch (err: any) {
      console.log("error deleting property state: ", err);
      return rejectWithValue(`state error: ${err.error}`);
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
        }
      )
      .addCase(createProperty.rejected, (state, action) => {
        (state.status = "failed"), (state.error = action.payload as string);
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        const index = state.properties.findIndex(
          (p) => p.pid === action.payload.pid
        );
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.properties = state.properties.filter(
          (p) => p.pid !== action.payload
        );
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { resetProperties } = propertySlice.actions;
export default propertySlice.reducer;
export const selectProperties = (state: RootState) => state.property.properties;
