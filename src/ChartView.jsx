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

export default function ChartView ({ stats, selectedId, onSelectId }) {
    if (!stats.data || stats.data.length === 0) return <p>No data provided</p>;


    return (
        <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={stats.data}
                    margin={{ top: 20, right: 30, bottom: 40, left: 40 }}
                >
                    {/* ✅ Title */}
                    <text
                        x="50%"
                        y={30}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{
                            fontSize: 18,
                            fontWeight: 600,
                            fill: "#333",
                        }}
                    >
                        Shewhart Chart
                    </text>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="id"
                        label={{
                            value: "Sample",
                            position: "insideBottom",
                            dy: 20, // was 40 → closer to chart
                            style: { fontWeight: 600, fontSize: 14 },
                        }}
                    />

                    <YAxis
                        label={{
                            value: "Value",
                            angle: -90,
                            position: "insideLeft",
                            dx: -20, // was -50 → closer to chart
                            style: { fontWeight: 600, fontSize: 14 },
                        }}
                        domain={[
                            Math.min(stats.YMin - 10, stats.mean - 3 * stats.stdDev - 10),
                            Math.max(stats.YMax + 10, stats.mean + 3 * stats.stdDev + 10),
                        ]}
                    />
                    <Tooltip />
                    <ReferenceLine y={stats.mean} stroke="red" strokeWidth={2} label="Mean" />
                    <ReferenceLine
                        y={stats.mean + 3 * stats.stdDev}
                        stroke="red"
                        strokeDasharray="3 3"
                        label="UCL"
                    />
                    <ReferenceLine
                        y={stats.mean - 3 * stats.stdDev}
                        stroke="red"
                        strokeDasharray="3 3"
                        label="LCL"
                    />
                    <Line
                        key={selectedId}
                        type="linear"
                        dataKey="value"
                        stroke="#8884d8"
                        dot={({ cx, cy, payload }) => (
                            <circle
                                cx={cx}
                                cy={cy}
                                r={5}
                                fill={payload.id === selectedId ? "#ff5722" : "#8884d8"}
                                stroke="#fff"
                                strokeWidth={1.5}
                                style={{ cursor: "pointer" }}
                                onClick={() => onSelectId(Number(payload.id))}
                            />
                        )}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>

    );
};



