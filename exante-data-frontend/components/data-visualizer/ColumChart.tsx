"use client";
import React from "react";
import { FaSearch } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type dataStataType = {
  dataStat: any;
};

const ColumChart = ({ dataStat }: dataStataType) => {
  return (
    <ResponsiveContainer width={"100%"} height={"100%"} minHeight={500}>
      <BarChart
        width={500}
        height={300}
        data={dataStat}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="US Money Market Fund Flows" fill="#8884d8" />
        <Bar dataKey="US Money Market Fund Flows (5d m/a)" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ColumChart;
