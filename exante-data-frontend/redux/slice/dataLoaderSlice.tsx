"use client";
import { createSlice } from '@reduxjs/toolkit';
import {fetchFundFlows, FundFlowsDataType} from "../actions/fundFlowsActions"
import { store } from '../store';

interface fundFlowsState {
  loading: boolean;
  data: FundFlowsDataType[];
  error: string;
}


const initialState: fundFlowsState = {
  loading: true,
  data: [],
  error: "",
}; 

const fundFlowsSlice = createSlice({
  name: 'fundFlows',
  initialState,
  reducers: {
    removeItem(state, action) {
      const idToRemove = action.payload;
      state.data = state.data.filter(item => item.name !== idToRemove);
    },
    addTimeSeries(state, action) {
      state.data = [...[action.payload]]
    },
    filterUnselected(state, action){
      const selectedNames = action.payload;
      state.data = state.data.filter(item => selectedNames.includes(item.name));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFundFlows.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFundFlows.fulfilled, (state: fundFlowsState, action) => {
        state.loading = false;
        const newData = action.payload;
        const existingIndex = state.data.findIndex(item => item.name === newData.name);
        if (existingIndex !== -1) {
          state.data[existingIndex] = newData;
        } else {
          state.data.push(newData); 
        }
        // state.data = [...state.data, action.payload];
        state.error = '';
      })
      .addCase(fetchFundFlows.rejected, (state, action) => {
        state.loading = false;
        state.data = [];
        state.error = action.error.message ?? "An error occurred";
      });
  },
});
export const { removeItem, addTimeSeries, filterUnselected } = fundFlowsSlice.actions;

export default fundFlowsSlice.reducer;