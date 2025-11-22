import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "./store/dashboardSlice";
import RegionTable from "./components/RegionTable";
import PerformanceChart from "./components/PerformanceChart";

export default function App() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.dashboard.data);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:5000/marketing");
        const json = await res.json();
        dispatch(setData(json));
      } catch (err) {
        console.log("Error fetching json-server data:", err);
      }
    }
    load();
  }, [dispatch]);

  return (
    <div className="app">
      <h2>Marketing Dashboard</h2>
      <p>Region-based grouped table with collapsible rows + charts</p>

      <RegionTable data={data} />

      <PerformanceChart data={data} />
    </div>
  );
}
