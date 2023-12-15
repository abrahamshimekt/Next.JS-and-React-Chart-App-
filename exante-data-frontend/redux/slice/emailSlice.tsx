"use client";

import { createSlice } from "@reduxjs/toolkit";

interface DataState {
  emails: string[];
  letterTitle: string;
  emailContent: string;
  attachments: File[];
  bulkRecipients: File[];
}

const initialState: DataState = {
  emails: [],
  letterTitle: "GDP Data",
  emailContent: "Write your content here...",
  attachments: [],
  bulkRecipients: []
};

const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    setEmails: (state, action) => ({
      ...state,
      emails: action.payload,
    }),
    setLetterTitle: (state, action) => ({
      ...state,
      letterTitle: action.payload,
    }),
    setEmailContent: (state, action) => ({
      ...state,
      emailContent: action.payload,
    }),
    setAttachments: (state, action) => ({
      ...state,
      attachments: [...state.attachments, ...action.payload],
    }),
    removeAttachement:(state,action)=>({
      ...state,
      attachments: state.attachments.filter((_,index)=>index!=action.payload)
    }),
    setbulkRecipients:(state, action) => ({
      ...state,
      bulkRecipients: [...state.bulkRecipients, ...action.payload],
    }),
    removebulkRecipients:(state,action)=>({
      ...state,
      bulkRecipients: state.bulkRecipients.filter((_,index)=>index!=action.payload)
    }),
  },
});

export default emailSlice.reducer;

export const { setEmails, setLetterTitle, setEmailContent, setAttachments,removeAttachement,setbulkRecipients,removebulkRecipients} =
  emailSlice.actions;
