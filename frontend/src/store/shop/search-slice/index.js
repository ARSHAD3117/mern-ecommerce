import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  searchResults: [],
};

export const searchProducts = createAsyncThunk(
  "/search/searchProducts",
  async (keyword) => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/search/${keyword}`
    );
    return result?.data;
  }
);

const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.searchResults = [];
      });
  },
});

export default searchSlice.reducer;

export const { resetSearchResults } = searchSlice.actions;
