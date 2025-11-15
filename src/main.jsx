import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./ChartDashboard.jsx";

// 🧨 FINAL BOSS FIX — erase DevExtreme announcer forever
const killDxAnnouncer = () => {
    const removeAnnouncer = () => {
        const nodes = document.querySelectorAll(".dx-aria-announce");
        nodes.forEach((n) => n.remove());
    };

    // 1️⃣ remove immediately
    removeAnnouncer();

    // 2️⃣ remove periodically (covers async updates)
    const interval = setInterval(removeAnnouncer, 200);

    // 3️⃣ observe for new nodes
    const observer = new MutationObserver(() => removeAnnouncer());
    observer.observe(document.body, { childList: true, subtree: true });

    // stop interval after 10 seconds (enough to stabilize UI)
    setTimeout(() => clearInterval(interval), 10000);
};

killDxAnnouncer();

// ✅ render app
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
