import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviewResults: [],
};

export const addReview = createAsyncThunk("/review/addReview", async (data) => {
  const result = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/shop/review/add`,
    data
  );
  return result?.data;
});

export const getReviews = createAsyncThunk(
  "/review/getReviews",
  async (productId) => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/review/${productId}`
    );
    return result?.data;
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviewResults = action.payload.data;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.reviewResults = [];
      });
  },
});

export default reviewSlice.reducer;
