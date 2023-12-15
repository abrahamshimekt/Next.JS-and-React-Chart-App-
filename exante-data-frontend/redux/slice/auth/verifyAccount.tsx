"use client";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {resendActivationAction} from '../../actions/auth/verifyAccount'

export interface VerifyAccountStatusType {
  status: boolean,
  time: number,
}

export interface VerifyAccountStateType {
  loading: boolean,
  status: VerifyAccountStatusType | null,
  error: string | undefined,
}


const initialState: VerifyAccountStateType = {
  loading: false,
  status: null,
  error: "",
}; 

const verifyAccountSlice = createSlice({
  name: 'verifyAccount',
  initialState,
  reducers: {
    resetUI(state){
      state.status = null;
      state.loading = false;
      state.error = ''
    },
    updateStatus(state, action){
      state.status = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(resendActivationAction.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(resendActivationAction.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload;
        state.error = "";
      })
      .addCase(resendActivationAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default verifyAccountSlice.reducer;
export const { resetUI, updateStatus } = verifyAccountSlice.actions;
