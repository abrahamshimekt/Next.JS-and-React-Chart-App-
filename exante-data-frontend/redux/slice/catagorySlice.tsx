"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "@/utils/consts";

export const loadCatagories = createAsyncThunk(
  "categories/loadCategory",
  async () => {
    const response = await axios.get(
      `${API_URL}/api/funds/fund-categories/`
    );
    const data = response.data.results;
    return data;
  }
);

export interface CatagoryType {
  id: number;
  name: string;
  isUploaded: boolean;
}

interface CategoryState {
  loading: boolean;
  categories: CatagoryType[];
  error: string;
}

const initialState: CategoryState = {
  loading: false,
  categories: [],
  error: "",
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCatagories.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadCatagories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = "";
      })
      .addCase(loadCatagories.rejected, (state, action) => {
        state.loading = false;
        state.categories = [];
        state.error = action.error.message ?? "An error occurred";
      });
  },
});

export default categorySlice.reducer;
