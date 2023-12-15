"use client";
import { loadRecipientGroups } from "@/redux/actions/email-sender/emailRecipientsActions";
import { createSlice } from "@reduxjs/toolkit";

export interface RecipientGroupsStateType {
  data: {
    [key: number]: 
    { email: string; id: number }[]
   } | null;
  options: {
    group: string;
    id: number;
    data: {
      email: string;
      id: number;
    }[];
  }[] | null;
  loading: boolean;
  error: string;
}

const initialState: RecipientGroupsStateType = {
  loading: true,
  data: null,
  error: "",
  options: null,
};

const recipientGroupsSlice = createSlice({
  name: "recipientGroups",
  initialState,
  reducers: {
    changeData(state, action) {
      if(action.payload.data === null || action.payload.groupId === null){
        return
      }
      const temp = state.data !== null ? {...state.data}:{};
      if(temp[action.payload.groupId] && temp[action.payload.groupId].length == action.payload.data.length){
        temp[action.payload.groupId] = []
      }else{
        temp[action.payload.groupId] = action.payload.data;
      }
      state.data = temp;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadRecipientGroups.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loadRecipientGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.options = action.payload;
        const temp: {
          [key: number]: 
          { email: string; id: number }[]
         } = {}
        action.payload.map(({group, id, data}, index)=>{
          temp[id] = data;
        })
        state.data = temp;
        state.error = "";
      })
      .addCase(loadRecipientGroups.rejected, (state, action) => {
        state.loading = false;
        state.options = null;
        state.error = action.error.message ?? "An error occurred";
      });
  },
});

export default recipientGroupsSlice.reducer;
export const { changeData } = recipientGroupsSlice.actions;
