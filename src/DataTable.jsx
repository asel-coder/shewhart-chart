import React, { useEffect, useRef } from "react";
import DataGrid, { Column, Paging, Pager, Scrolling } from "devextreme-react/data-grid";

export default function DataTable({ stats, selectedId, onSelectId }) {
    const gridRef = useRef(null);

    useEffect(() => {
        if (!gridRef.current || !selectedId) return;

        try {
            const gridInstance = gridRef.current.instance;
            if (!gridInstance) return;

            // Focus the row
            gridInstance.option("focusedRowKey", selectedId);

            // Wait a tick so the grid renders the focused row first
            setTimeout(() => {
                const rowElement = document.querySelector(
                    `.dx-data-row[aria-rowindex="${selectedId}"]`
                );

                if (rowElement) {
                    rowElement.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                }
            }, 100);
        } catch (err) {
            console.error("Error scrolling to selected row:", err);
        }
    }, [selectedId]);

    // ✅ Remove DevExtreme ARIA status node on every render
    useEffect(() => {
        const hideAria = () => {
            document.querySelectorAll(".dx-aria-status").forEach(el => {
                el.style.display = "none";
                el.style.visibility = "hidden";
                el.style.height = "0";
                el.style.overflow = "hidden";
                el.style.position = "absolute";
                el.style.top = "-9999px";
            });
        };

        hideAria(); // initial
        const observer = new MutationObserver(hideAria);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, []);



    return (
        <div
            className="data-table-container"
            onClick={(e) => e.preventDefault()} // 🧠 extra guard: no default navigation anywhere inside
        >
            <h3 className="data-table-title">Data Table</h3>
            <div className="data-grid-wrapper">
                <DataGrid
                    ref={gridRef}
                    dataSource={stats.data}
                    keyExpr="id"
                    showBorders={true}
                    rowAlternationEnabled={true}
                    focusedRowEnabled={true}
                    focusedRowKey={selectedId}
                    onFocusedRowChanged={(e) => {
                        const id = e.row?.data?.id;
                        if (id && id !== selectedId) onSelectId(id);
                    }}
                    height="100%"
                    width="100%"
                    columnAutoWidth={false}
                    allowColumnReordering={false}
                    allowColumnResizing={false}
                    showColumnLines={true}
                    showRowLines={true}
                    selection={{ mode: "none" }}
                    hoverStateEnabled={true}


                    onRowClick={(e) => {
                        // 🛑 Only prevent unexpected submit events
                        if (e.event?.type === "submit") {
                            e.event.preventDefault();
                            e.event.stopPropagation();
                            return;
                        }

                        const id = e.data?.id;
                        if (id) onSelectId(id);
                    }}
                >
                    <Paging enabled={false} />
                    <Pager visible={false} />
                    <Scrolling mode="standard" />

                    <Column dataField="id" caption="ID" alignment="center" width={120} />
                    <Column dataField="sampleName" caption="Sample Name" alignment="left" width={160} />
                    <Column dataField="value" caption="Value" alignment="right" width={120} />
                </DataGrid>
            </div>
        </div>
    );
}
