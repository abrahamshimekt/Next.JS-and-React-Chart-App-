"use client";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {forgetPasswordAction} from '../../actions/auth/forgetPassword'

export interface ForgetPasswordStatusType {
  status: boolean,
  time: number,
}

export interface ForgotPasswordStateType {
  loading: boolean,
  status: ForgetPasswordStatusType | null,
  error: string | undefined,
}


const initialState: ForgotPasswordStateType = {
  loading: false,
  status: null,
  error: "",
}; 

const forgetPasswordSlice = createSlice({
  name: 'forgetPassword',
  initialState,
  reducers: {
    resetUI(state){
      state.status = null;
      state.loading = false;
      state.error = ''
    },
    updateStatus(state, action){
      state.status = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgetPasswordAction.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(forgetPasswordAction.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload;
        state.error = "";
      })
      .addCase(forgetPasswordAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default forgetPasswordSlice.reducer;
export const { resetUI, updateStatus } = forgetPasswordSlice.actions;
