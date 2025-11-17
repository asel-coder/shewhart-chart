
import React, { useMemo } from 'react';
export default function ControlRules({ stats }) {

    const is8PointsOnOneSide = useMemo(() => {
        let countAbove = 0;
        let countBelow = 0;

        for (const point of stats.data) {
            if (point.value > stats.mean) {
                countAbove++;
                countBelow = 0;
            } else if (point.value < stats.mean) {
                countBelow++;
                countAbove = 0;
            } else {
                countAbove = countBelow = 0;
            }

            if (countAbove >= 8 || countBelow >= 8) {
                return true;
            }
        }
        return false;
    }, [stats.data, stats.mean]);

    const is6PointsTrending = useMemo(() => {
        if (!stats.data || stats.data.length === 0) return false;

        let incCount = 1;
        let decCount = 1;

        for (let i = 1; i < stats.data.length; i++) {
            if (stats.data[i].value > stats.data[i - 1].value) {
                incCount++;
                decCount = 1;
            } else if (stats.data[i].value < stats.data[i - 1].value) {
                decCount++;
                incCount = 1;
            } else {
                incCount = 1;
                decCount = 1;
            }

            if (incCount >= 6 || decCount >= 6) {
                return true;
            }
        }

        return false;
    }, [stats.data]);


    const isNormalityViolated = useMemo(() => {
        if (!stats.data || stats.data.length === 0) return false;

        const values = stats.data.map(d => d.value);

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
    }, [stats.data]);

    const is2of3Beyond2σ = useMemo(() => {
        if (!stats.data || stats.data.length < 3) return false;



        for (let i = 0; i < stats.data.length - 2; i++) {
            const triple = stats.data.slice(i, i + 3);

            let countZoneB = triple.filter(point => {
                const deviation = Math.abs(point.value - stats.mean);
                return deviation > 2 * stats.stdDev && deviation < 3 * stats.stdDev; // between 2σ and 3σ
            }).length;

            if (countZoneB >= 2) {
                return true; // rule triggered
            }
        }

        return false;
    }, [stats.data, stats.mean, stats.stdDev]);

    const is4of5Beyond1σ = useMemo(() => {
        if (!stats.data || stats.data.length < 5) return false;



        for (let i = 0; i <= stats.data.length - 5; i++) {
            const window = stats.data.slice(i, i + 5);

            let countBeyond1Sigma = window.filter(point => {
                const deviation = Math.abs(point.value - stats.mean);
                return deviation > stats.stdDev && deviation < 3 * stats.stdDev;
            }).length;

            if (countBeyond1Sigma >= 4) {
                return true;
            }
        }

        return false;
    }, [stats.data, stats.mean, stats.stdDev]);

    const is14PointsAlternating = useMemo(() => {
        if (!stats.data || stats.data.length < 14) return false;

        // Helper to check if 14 points alternate direction
        const isAlternating = (segment) => {
            for (let i = 2; i < segment.length; i++) {
                const prevDiff = segment[i - 1].value - segment[i - 2].value;
                const currDiff = segment[i].value - segment[i - 1].value;

                // If signs match or any diff is 0, not alternating
                if (prevDiff === 0 || currDiff === 0) return false;
                if ((prevDiff > 0 && currDiff > 0) || (prevDiff < 0 && currDiff < 0)) {
                    return false;
                }
            }
            return true;
        };

        // Slide a window of 14
        for (let i = 0; i <= stats.data.length - 14; i++) {
            const window = stats.data.slice(i, i + 14);
            if (isAlternating(window)) return true;
        }

        return false;
    }, [stats.data]);

    const is15PointsWithin1σ = useMemo(() => {
        if (!stats.data || stats.data.length < 15) return false;



        let count = 0;

        for (let i = 0; i < stats.data.length; i++) {
            const deviation = Math.abs(stats.data[i].value - stats.mean);

            if (deviation <= stats.stdDev) {
                count++;
            } else {
                count = 0; // reset streak
            }

            if (count >= 15) {
                return true;
            }
        }

        return false;
    }, [stats.data, stats.mean, stats.stdDev]);

    return (
        <>
            <div className={`rule-card ${is8PointsOnOneSide ? "violated" : "ok"}`}>
                <div className="rule-info">
                    <p className="rule-description">8 Points On One Side</p>
                    <span className="rule-status">
            {is8PointsOnOneSide ? "violated" : "ok"}
        </span>
                </div>
            </div>
            <div className={`rule-card ${is6PointsTrending ? "violated" : "ok"}`}>
                <div className="rule-info">
                    <p className="rule-description">6 Points Trending</p>
                    <span className="rule-status">
            {is6PointsTrending ? "violated" : "ok"}
        </span>
                </div>
            </div>
            <div className={`rule-card ${isNormalityViolated ? "violated" : "ok"}`}>
                <div className="rule-info">
                    <p className="rule-description">Normality</p>
                    <span className="rule-status">
            {isNormalityViolated ? "violated" : "ok"}
        </span>
                </div>
            </div>
            <div className={`rule-card ${is2of3Beyond2σ ? "violated" : "ok"}`}>
                <div className="rule-info">
                    <p className="rule-description">2 of 3 Beyond 2σ</p>
                    <span className="rule-status">
            {is2of3Beyond2σ ? "violated" : "ok"}
        </span>
                </div>
            </div>
            <div className={`rule-card ${is4of5Beyond1σ ? "violated" : "ok"}`}>
                <div className="rule-info">
                    <p className="rule-description">4 of 5 Beyond 1σ</p>
                    <span className="rule-status">
            {is4of5Beyond1σ ? "violated" : "ok"}
        </span>
                </div>
            </div>
            <div className={`rule-card ${is14PointsAlternating ? "violated" : "ok"}`}>
                <div className="rule-info">
                    <p className="rule-description">14 Points Alternating</p>
                    <span className="rule-status">
            {is14PointsAlternating ? "violated" : "ok"}
        </span>
                </div>
            </div>
            <div className={`rule-card ${is15PointsWithin1σ ? "violated" : "ok"}`}>
                <div className="rule-info">
                    <p className="rule-description">15 Points Within 1σ</p>
                    <span className="rule-status">
            {is15PointsWithin1σ ? "violated" : "ok"}
        </span>
                </div>
            </div>

        </>
    );
}
