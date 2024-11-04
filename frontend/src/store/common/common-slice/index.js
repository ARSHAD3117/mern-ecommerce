import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  featureImages: [],
};

export const uploadFeatureImage = createAsyncThunk(
  "/common/uploadFeatureImage",
  async (image) => {
    const result = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/common/feature/add`,
      {
        image,
      }
    );
    return result?.data;
  }
);

export const getAllFeatureImages = createAsyncThunk(
  "/common/getAllFeatureImages",
  async (image) => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/common/feature/get`,
      {
        image,
      }
    );
    return result?.data;
  }
);

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllFeatureImages.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImages = action.payload.data;
      })
      .addCase(getAllFeatureImages.rejected, (state, action) => {
        state.isLoading = false;
        state.featureImages = [];
      });
  },
});

export default commonSlice.reducer;
