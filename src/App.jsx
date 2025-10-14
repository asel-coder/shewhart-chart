import React from "react";
import ShewhartChart from "./ShewhartChart";

const data = [
    { name: "Sample A", value: 10 },
    { name: "Sample B", value: 12 },
    { name: "Sample C", value: 8 },
    { name: "Sample D", value: 14 },
    { name: "Sample E", value: 28 }, // out of range example
    { name: "Sample F", value: 9 },
];

const mean = 13;
const stdDev = 4;

function App() {
    return (
        <div style={{ padding: "20px" }}>
            <h2>Shewhart Control Chart</h2>
            <ShewhartChart data={data} mean={mean} stdDev={stdDev} />
        </div>
    );
}

export default App;
