import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

export default function PerformanceChart({ data }) {
  const chartData = useMemo(() => {
    const map = {};
    data.forEach((d) => {
      map[d.channel] = (map[d.channel] || 0) + d.spend;
    });

    return Object.entries(map)
      .map(([channel, spend]) => ({ channel, spend }))
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 10);
  }, [data]);

  return (
    <div className="card">
      <h3>Top Channels by Spend</h3>

      <div style={{ height: 250 }}>
        <ResponsiveContainer>
          <BarChart layout="vertical" data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="channel" width={120} />
            <Tooltip />
            <Bar dataKey="spend" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
