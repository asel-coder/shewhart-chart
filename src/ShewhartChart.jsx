import React, { useState } from "react";
import { useMemo } from "react";
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
import DataGrid, {
    Column,
    FilterRow,
    Scrolling,
    Paging,
    Pager,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { HeaderFilter } from "devextreme-react/gantt";
import "./ShewhartChart.css";

const ShewhartChart = ({ data, mean, stdDev }) => {
    if (!data || data.length === 0) return <p>No data provided</p>;

    const LCL = mean - 3 * stdDev;
    const UCL = mean + 3 * stdDev;

    const getColor = (value) => {
        const diff = Math.abs(value - mean);
        if (diff <= 1 * stdDev) return "orange";
        if (diff <= 2 * stdDev) return "blue";
        if (diff <= 3 * stdDev) return "green";
        return "red";
    };

    const chartData = data.map((entry, index) => {
        const color = getColor(entry.value);
        const isOutOfRange = entry.value < LCL || entry.value > UCL;
        return {
            index: index + 1,
            name: entry.name,
            value: entry.value,
            color,
            status: isOutOfRange ? "out" : "ok",
        };
    });

    const [selectedIndex, setSelectedIndex] = useState(null);


    const criterionViolated = useMemo(() => {
        let countAbove = 0;
        let countBelow = 0;

        for (const point of data) {
            if (point.value > mean) {
                countAbove++;
                countBelow = 0;
            } else if (point.value < mean) {
                countBelow++;
                countAbove = 0;
            } else {
                countAbove = countBelow = 0;
            }

            if (countAbove >= 10 || countBelow >= 10) {
                return true;
            }
        }
        return false;
    }, [data, mean]);

    // === Trend Rule Logic (8 values increasing or decreasing) ===
    const trendViolated = useMemo(() => {
        if (!data || data.length === 0) return false;

        let incCount = 1;
        let decCount = 1;

        for (let i = 1; i < data.length; i++) {
            if (data[i].value > data[i - 1].value) {
                incCount++;
                decCount = 1;
            } else if (data[i].value < data[i - 1].value) {
                decCount++;
                incCount = 1;
            } else {
                incCount = 1;
                decCount = 1;
            }

            if (incCount >= 8 || decCount >= 8) {
                return true;
            }
        }

        return false;
    }, [data]);

    // === Normality Rule: ≥70% within ±1σ from mean ===
    const normalityViolated = useMemo(() => {
        if (!data || data.length === 0) return false;

        const values = data.map(d => d.value);

        const mean =
            values.reduce((a, b) => a + b, 0) / values.length;

        const std = Math.sqrt(
            values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
            values.length
        );

        // Count points within ±1σ
        const withinStdCount = values.filter(
            v => Math.abs(v - mean) <= std
        ).length;

        const percentage = (withinStdCount / values.length) * 100;

        return percentage < 70; // return TRUE when rule violated
    }, [data]);



    return (
        <div className="shewhart-wrapper">
            <h2 className="chart-title">Shewhart Control Chart</h2>
        <div className="shewhart-container">
            {/* === CHART SECTION === */}
            <div className="chart-section">
                <div className="mean-info-box">
                    <div className="stat-item">
                        <strong className="stat-label">Mean</strong>
                        <div className="stat-value">{mean.toFixed(2)}</div>
                    </div>
                    <div className="stat-item">
                        <strong className="stat-label">Standard Deviation</strong>
                        <div className="stat-value">{stdDev.toFixed(2)}</div>
                    </div>
                </div>

                <div className="chart-box">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="index"
                            label={{ value: "Sample", position: "insideBottom", dy: 10 }}
                        />
                        <YAxis
                            label={{ value: "Value", angle: -90, position: "insideLeft" }}
                        />
                        <Tooltip />

                        <ReferenceLine
                            y={mean}
                            stroke="red"
                            strokeWidth={2}
                            label="Mean"
                        />
                        <ReferenceLine y={UCL} stroke="red" strokeDasharray="3 3" label="UCL" />
                        <ReferenceLine y={LCL} stroke="red" strokeDasharray="3 3" label="LCL" />

                        <Line
                            type="linear"
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
            </div>

            {/* === TABLE SECTION === */}
            <div className="table-section">
                {/* ✅ NEW CRITERIA TABLE */}
                <div className="criteria-box">
                    <h3>Shewhart Control Rules</h3>
                    <table className="criteria-table">
                        <tbody>
                        <tr>
                            <td>
                                <strong>Run Rule</strong>
                            </td>
                            <td>
                                {criterionViolated ? (
                                    <span style={{ color: "red", fontWeight: "bold" }}>Criterion violated</span>
                                ) : (
                                    <span style={{ color: "green", fontWeight: "bold" }}>No violations</span>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Trend Rule</strong>
                            </td>
                            <td>
                                {trendViolated ? (
                                    <span style={{ color: "red", fontWeight: "bold" }}>
                  Trend violated
                </span>
                                ) : (
                                    <span style={{ color: "green", fontWeight: "bold" }}>
                  No violations
                </span>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Normality Rule</strong>
                            </td>
                            <td>
                                {normalityViolated ? (
                                    <span className="text-red-600 font-bold">
        Normality violated
      </span>
                                ) : (
                                    <span className="text-green-600 font-bold">
        Normality OK
      </span>
                                )}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <h3>Data Table</h3>
                <DataGrid
                    dataSource={chartData}
                    keyExpr="index"
                    height="100%"
                    width="100%"      // ⬅️ Add this line
                    showBorders={true}
                    rowAlternationEnabled={true}
                    focusedRowEnabled={true}
                    onFocusedRowChanged={(e) => setSelectedIndex(e.rowIndex)}
                    focusedRowIndex={selectedIndex}
                    hoverStateEnabled={true}
                >
                    <HeaderFilter visible={true} />
                    <FilterRow visible={true} />
                    <Scrolling mode="virtual" />
                    <Paging defaultPageSize={20} />
                    <Pager showPageSizeSelector={true} allowedPageSizes={[5, 10, 20]} />

                    <Column
                        dataField="name"
                        caption="Name"
                        cellRender={({ data }) => (
                            <span style={{ color: data.color }}>{data.name}</span>
                        )}
                    />
                    <Column
                        dataField="value"
                        caption="Value"
                        dataType="number"
                        alignment="right"
                        cellRender={({ data }) => (
                            <span style={{ color: data.color }}>{data.value.toFixed(2)}</span>
                        )}
                    />
                    <Column
                        dataField="status"
                        caption="Status"
                        alignment="right"
                        dataType="string"
                        cellRender={({ data }) => (
                            <span style={{ color: data.color }}>{data.status}</span>
                        )}
                    />
                </DataGrid>
            </div>
        </div>
            </div>
    );
};

export default ShewhartChart;
