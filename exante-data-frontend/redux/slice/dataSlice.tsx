"use client";
import { createSlice } from "@reduxjs/toolkit";
import {CatagoryType} from "./catagorySlice"
interface DataState {
  searched: string;
  // suggestions: CatagoryType[];
  selectedItems: CatagoryType[];
  initialItem: CatagoryType[];
  isBookmarked: Boolean;
  bookmarkLoaded: Boolean,
  selectedChart:string;
  selectedPlotOptions:{};
  selectedColumns: {
    date: string;
    data: string;
    dataName: string;
  };
}

const initialState: DataState = {
  searched: "",
  // suggestions: [],
  selectedItems: [],
  initialItem: [],
  isBookmarked: false,
  bookmarkLoaded: true,
  selectedChart:'stacked',
  selectedPlotOptions:{},
  selectedColumns: {
    date: "",
    data: "",
    dataName: "",
  },
};

const dataSlice = createSlice({
  name: "searchedData",
  initialState,
  reducers: {
    addSearched: (state, action) => ({ ...state, searched: action.payload }),
    setSuggestions: (state, action) => ({
      ...state,
      suggestions: action.payload,
    }),
    setSelectedItem: (state, action) => ({
      ...state,
      selectedItems: action.payload,
    }),
    setIsBookmarked: (state, action) => ({
      ...state,
      isBookmarked: action.payload,
    }),
    setBookmarkLoaded: (state, action) => ({
      ...state,
      bookmarkLoaded: action.payload,
    }),
    setSelectedChart: (state, action) => ({
      ...state,
      selectedChart: action.payload,
    }),
    setSelectedPlotOptions: (state, action) => ({
      ...state,
      selectedPlotOptions: action.payload,
    }),
    setSelectedColumns: (state, action) => ({
      ...state,
      selectedColumns: action.payload,
    }),
  },
});

export default dataSlice.reducer;

export const {
  addSearched,
  setSuggestions,
  setSelectedItem,
  setIsBookmarked,
  setSelectedChart,
  setSelectedPlotOptions,
  setSelectedColumns,
  setBookmarkLoaded,
} = dataSlice.actions;