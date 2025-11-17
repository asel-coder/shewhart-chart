
import React, { useState, useMemo, useEffect } from "react";
import DataTable from "./DataTable.jsx";
import ControlRules from "./ControlRules.jsx";
import ChartView from "./ChartView.jsx";
import {generateRandomData} from "./generateData.js";
import "./Dashboard.css";


function ChartDashboard() {

    const [selectedId, setSelectedId] = useState(null);

    const stats = useMemo(() => generateRandomData(25, 120, 10), []);


    return (
        <div className="dashboard">
            {/* Top Section (Mean, Std) */}
            <div className="top-section">
                <div className="cards-column">
                    <div className="card">Mean {stats.mean}</div>
                    <div className="card">Std Dev {stats.stdDev}</div>
                </div>


            {/* 7 Rules Grid */}
                <div className="rules-grid">
                    <ControlRules
                        stats={stats}
                        selectedId={selectedId}
                        onSelectId={setSelectedId}
                    />
                </div>
            </div>

            {/* Bottom Section (Chart + Table) */}
            <div className="bottom-section">
                <div className="chart">
                    <ChartView
                        stats={stats}
                        selectedId={selectedId}
                        onSelectId={setSelectedId}
                    />
                </div>
                <div className="data-table">
                    <DataTable
                        stats={stats}
                        selectedId={selectedId}
                        onSelectId={setSelectedId}
                    />
                </div>
            </div>
        </div>
    );
}

export default ChartDashboard;
