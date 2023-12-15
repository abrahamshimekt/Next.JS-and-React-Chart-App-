"use client";

import { Template } from "@/types/templete";
import { createSlice } from "@reduxjs/toolkit";

interface templateState {
  templates: Template[];
}

const initialState: templateState = {
    templates: [{
        title: 'mergedfundflow',
        updated: '12 hours, 45 minutes ago',
        type: 'Other Page',
        status: 'Live'
    },
    {
        title: "mergedfundflow_IGCorp",
        updated: "16 hours, 21 minutes ago",
        type: "Other Page",
        status: "Live"
    },
    {
        title: "newbondweekly",
        updated: "1 day, 2 hours ago",
        type: "Country Page",
        status: "Live"
    },
    {
        title: "mexico",
        updated: "6 days, 12 hours ago",
        type: "Country Page",
        status: "Live"
    },
    {
        title: "Malaysia",
        updated: "1 week, 2 days ago",
        type: "Country Page",
        status: "Live"
    },
    {
        title: "Columbia",
        updated: "2 weeks, 1 day ago",
        type: "Country Page",
        status: "Live"
    },
    {
        title: "Chile",
        updated: "2 weeks, 4 days ago",
        type: "Country Page",
        status: "Live"
    },
    {
        title: "Brazil",
        updated: "3 weeks, 5 days ago",
        type: "Country Page",
        status: "Live"
    },
    {
        title: "Argentina",
        updated: "4 weeks, 2 days ago",
        type: "Country Page",
        status: "Live"
    },
    {
        title: "Venezuela",
        updated: "5 weeks, 1 day ago",
        type: "Country Page",
        status: "Live"
    },
    {
        title: "Uruguay",
        updated: "6 weeks, 6 days ago",
        type: "Country Page",
        status: "Live"
    },
    {
        title: "Peru",
        updated: "7 weeks, 3 days ago",
        type: "Country Page",
        status: "Live"
    },
    {
        title: "Paraguay",
        updated: "8 weeks, 4 days ago",
        type: "Country Page",
        status: "Live"
    },
    {
        title: "Panama",
        updated: "9 weeks, 5 days ago",
        type: "Country Page",
        status: "Live"
    },
    {
        title: "Nicaragua",
        updated: "10 weeks, 2 days ago",
        type: "Country Page",
        status: "Live"
    },
    {
        title: "Honduras",
        updated: "11 weeks, 1 day ago",
        type: "Country Page",
        status: "Live"
    },
    {
        title: "Guatemala",
        updated: "12 weeks, 6 days ago",
        type: "Country Page",
        status: "Live"
    },
    {
        title: "El Salvador",
        updated: "13 weeks, 3 days ago",
        type: "Country Page",
        status: "Live"
    },
    {
        title: "Ecuador",
        updated: "14 weeks, 4 days ago",
        type: "Country Page",
        status: "Live"
    },
    {
        title: "Dominican Republic",
        updated: "15 weeks, 5 days ago",
        type: "Country Page",
        status: "Live"
    },
    {
        title: "Costa Rica",
        updated: "16 weeks, 2 days ago",
        type: "Country Page",
        status: "Live"
    },
    {
        title: "Bolivia",
        updated: "17 weeks, 1 day ago",
        type: "Country Page",
        status: "Live"
    },]
};

const templeteSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    sortTempletes: (state, action) => {
        if ( action.payload.type === 'title') {
            
            state.templates.sort((a, b) => {
                if (a.title < b.title) {
                    return -1;
                }
                if (a.title > b.title) {
                    return 1;
                }
                return 0;
            });
        }
    },
  },
});

export default templeteSlice.reducer;

export const { sortTempletes } =
  templeteSlice.actions;
