import React, { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";

const ShewhartChart = ({ data, mean, stdDev }) => {
    if (!data || data.length === 0) return <p>No data provided</p>;

    const LCL = mean - 3 * stdDev;
    const UCL = mean + 3 * stdDev;

    // Helper: determine color based on deviation
    const getColor = (value) => {
        const diff = Math.abs(value - mean);

        if (diff <= 1 * stdDev) return "orange"; // within 1σ
        if (diff <= 2 * stdDev) return "blue";   // within 2σ
        if (diff <= 3 * stdDev) return "green";  // within 3σ
        return "red";                            // beyond 3σ (out of range)
    };

    // Build chart data with computed color + status
    const chartData = data.map((entry, index) => {
        const color = getColor(entry.value);
        const isOutOfRange = entry.value < LCL || entry.value > UCL;
        return {
            index: index + 1,
            name: entry.name,
            value: entry.value,
            color,
            status: isOutOfRange ? "out of range" : "okay",
        };
    });

    const [selectedIndex, setSelectedIndex] = useState(null);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                width: "100vw",
                height: "100vh",
                gap: "30px",
                padding: "20px",
                boxSizing: "border-box",
            }}
        >
            {/* === CHART SECTION === */}
            <div style={{ width: "70%", height: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="index" label={{ value: "Sample", position: "insideBottom", dy: 10 }} />
                        <YAxis label={{ value: "Value", angle: -90, position: "insideLeft" }} />
                        <Tooltip />

                        {/* Mean and control lines */}
                        <ReferenceLine y={mean} stroke="gray" strokeDasharray="3 3" label="Mean" />
                        <ReferenceLine y={UCL} stroke="red" strokeDasharray="3 3" label="UCL" />
                        <ReferenceLine y={LCL} stroke="red" strokeDasharray="3 3" label="LCL" />

                        {/* Data line */}
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#8884d8"
                            dot={(dotProps) => {
                                const { cx, cy, index } = dotProps;
                                const entry = chartData[index];
                                const isSelected = index === selectedIndex;
                                return (
                                    <circle
                                        cx={cx}
                                        cy={cy}
                                        r={isSelected ? 7 : 5}
                                        fill={entry.color}
                                        stroke="#fff"
                                        strokeWidth={1.5}
                                        style={{ cursor: "pointer" }}
                                    />
                                );
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* === TABLE SECTION === */}
            <div style={{ width: "30%", height: "100%", overflowY: "auto" }}>
                <h3>Data Table</h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr>
                        <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Name</th>
                        <th style={{ borderBottom: "1px solid #ccc", textAlign: "right" }}>Value</th>
                        <th style={{ borderBottom: "1px solid #ccc", textAlign: "center" }}>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {chartData.map((entry, index) => (
                        <tr
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            style={{
                                backgroundColor:
                                    index === selectedIndex ? "rgba(255, 165, 0, 0.2)" : "transparent",
                                cursor: "pointer",
                            }}
                        >
                            <td style={{ color: entry.color }}>{entry.name}</td>
                            <td style={{ textAlign: "right", color: entry.color }}>
                                {entry.value.toFixed(2)}
                            </td>
                            <td
                                style={{
                                    textAlign: "center",
                                    color: entry.status === "out of range" ? "red" : "green",
                                }}
                            >
                                {entry.status}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShewhartChart;
