import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { Address, Property } from "@/types/property";
import { propertyApi } from "api/propertyApi";

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
      if (file == null) {
        const nwProperty = await propertyApi.createProperty(data);
        return nwProperty;
      }

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
      file,
    }: { updatedData: Partial<Property> | Property; file?: File },
    { rejectWithValue }
  ) => {
    try {
      const { property, success } = await propertyApi.updateProperty(
        updatedData,
        file
      );
      if (!success) {
        throw new Error("update property request failed");
      }
      return property;
    } catch (err: any) {
      console.log(`error updating property state: `, err);
      return rejectWithValue(`state error: ${err.error}`);
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
          (p) => p.pid === action.payload.property.pid
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
