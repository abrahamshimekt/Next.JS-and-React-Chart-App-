"use client";
import { resetPassword } from "@/redux/actions/auth/resetPassword";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  loading: boolean;
  error: string;
  resetSuccessfull: boolean;
}

const initialState: AuthState = {
  loading: false,
  error: "",
  resetSuccessfull: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
        state.resetSuccessfull = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
