import React from "react";
import ShewhartChart from "./ShewhartChart";

const data = [
    { id: 1, name: "Sample A", value: 10 },
    { id: 2,name: "Sample B", value: 12 },
    { id: 3,name: "Sample C", value: 8 },
    { id: 4,name: "Sample D", value: 14 },
    { id: 5,name: "Sample E", value: 28 }, // out of range example
    { id: 6,name: "Sample F", value: 9 },
    { id: 7,name: "Sample A", value: 10 },
    { id: 8,name: "Sample B", value: 12 },
    { id: 9,name: "Sample C", value: 8 },
    { id: 10,name: "Sample D", value: 14 },
    {id: 11, name: "Sample E", value: 28 }, // out of range example
    { id: 12,name: "Sample F", value: 9 },
    { id: 13,name: "Sample A", value: 10 },
    { id: 14,name: "Sample B", value: 12 },
    { id: 15,name: "Sample C", value: 8 },
    { id: 16,name: "Sample D", value: 14 },
    { id: 17,name: "Sample E", value: 28 }, // out of range example
    { id: 18,name: "Sample F", value: 9 },
    { id: 19,name: "Sample A", value: 10 },
    { id: 20,name: "Sample B", value: 12 },
    { id: 21,name: "Sample C", value: 8 },
    { id: 22,name: "Sample D", value: 14 },
    { id: 23, name: "Sample E", value: 28 } // out of range example

];

const mean = 13;
const stdDev = 4;

function App() {
    return (
        <div style={{ padding: "20px" }}>

            <ShewhartChart data={data} mean={mean} stdDev={stdDev} />
        </div>
    );
}

export default App;
