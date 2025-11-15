export function generateRandomData(count = 20, mean = 50, stdDev = 5) {
    const data = [];

    // Helper for normally distributed random values
    const randomNormal = (mean, stdDev) => {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    };

    for (let i = 1; i <= count; i++) {
        const value = randomNormal(mean, stdDev);
        data.push({
            id: i,
            sampleName: `Sample ${i}`,
            value: parseFloat(value.toFixed(2)),
        });
    }

    const values = data.map(d => d.value);
    const YMin = Math.min(...values) - stdDev;
    const YMax = Math.max(...values) + stdDev;

    return { data, mean, stdDev, YMin, YMax };
}




/**
 * Checks if 8 consecutive points are above or below the mean.
 * @param {Array<{ value: number }>} data - Array of objects containing numeric values.
 * @param {number} mean - The mean value to compare against.
 * @returns {boolean} True if the criterion is violated, otherwise false.
 */
export function is8PointsOnOneSide(data, mean) {
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
            countAbove = 0;
            countBelow = 0;
        }

        if (countAbove >= 8 || countBelow >= 8) {
            return true;
        }
    }

    return false;
}

export function is6PointsTrending(data) {
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

        if (incCount >= 6 || decCount >= 6) {
            return true;
        }
    }

    return false;
}

/**
 * Checks whether the normality criterion is violated.
 * The rule: if fewer than 70% of points fall within ±1 standard deviation of the mean,
 * the normality assumption is considered violated.
 *
 * @param {Array<{ value: number }>} data - Array of objects containing numeric values.
 * @returns {boolean} True if the normality rule is violated, otherwise false.
 */
export function isNormalityViolated(data) {
    if (!data || data.length === 0) return false;

    const values = data.map(d => d.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;

    const std = Math.sqrt(
        values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
    );

    // Count points within ±1 standard deviation
    const withinStdCount = values.filter(v => Math.abs(v - mean) <= std).length;

    const percentageWithinStd = (withinStdCount / values.length) * 100;

    return percentageWithinStd < 70;
}

/**
 * Checks whether the Zone B rule is violated.
 * Rule: 2 out of 3 consecutive points fall between 2σ and 3σ from the mean (on the same side).
 *
 * @param {Array<{ value: number }>} data - Array of objects containing numeric values.
 * @param {number} mean - The mean of the dataset.
 * @param {number} stdDev - The standard deviation of the dataset.
 * @returns {boolean} True if the Zone B rule is violated, otherwise false.
 */
export function is2of3Beyond2σ(data, mean, stdDev) {
    if (!data || data.length < 3) return false;

    for (let i = 0; i < data.length - 2; i++) {
        const triple = data.slice(i, i + 3);

        // Count how many of the three points are in Zone B (2σ–3σ)
        const countZoneB = triple.filter(point => {
            const deviation = Math.abs(point.value - mean);
            return deviation > 2 * stdDev && deviation < 3 * stdDev;
        }).length;

        if (countZoneB >= 2) {
            return true; // rule triggered
        }
    }

    return false;
}

/**
 * Checks whether the Zone C rule is violated.
 * Rule: 4 out of 5 consecutive points fall beyond ±1σ but within ±3σ of the mean.
 *
 * @param {Array<{ value: number }>} data - Array of objects containing numeric values.
 * @param {number} mean - The mean of the dataset.
 * @param {number} stdDev - The standard deviation of the dataset.
 * @returns {boolean} True if the Zone C rule is violated, otherwise false.
 */
export function is4of5Beyond1σ(data, mean, stdDev) {
    if (!data || data.length < 5) return false;

    for (let i = 0; i <= data.length - 5; i++) {
        const window = data.slice(i, i + 5);

        // Count how many of the 5 points are beyond ±1σ but within ±3σ
        const countBeyond1Sigma = window.filter(point => {
            const deviation = Math.abs(point.value - mean);
            return deviation > stdDev && deviation < 3 * stdDev;
        }).length;

        if (countBeyond1Sigma >= 4) {
            return true; // rule triggered
        }
    }

    return false;
}

/**
 * Checks whether the alternating rule is violated.
 * Rule: 14 consecutive points alternate up and down (no runs of increasing or decreasing values).
 *
 * @param {Array<{ value: number }>} data - Array of objects containing numeric values.
 * @returns {boolean} True if the alternating rule is violated, otherwise false.
 */
export function is14PointsAlternating(data) {
    if (!data || data.length < 14) return false;

    // Helper to check if 14 consecutive points alternate direction
    const isAlternating = (segment) => {
        for (let i = 2; i < segment.length; i++) {
            const prevDiff = segment[i - 1].value - segment[i - 2].value;
            const currDiff = segment[i].value - segment[i - 1].value;

            // If any diff is 0 (flat) or direction doesn't alternate → not alternating
            if (prevDiff === 0 || currDiff === 0) return false;
            if ((prevDiff > 0 && currDiff > 0) || (prevDiff < 0 && currDiff < 0)) {
                return false;
            }
        }
        return true;
    };

    // Slide a window of 14 points across the dataset
    for (let i = 0; i <= data.length - 14; i++) {
        const segment = data.slice(i, i + 14);
        if (isAlternating(segment)) return true;
    }

    return false;
}

/**
 * Checks whether the low variation rule is violated.
 * Rule: 15 consecutive points fall within ±1σ of the mean (indicating too little variation).
 *
 * @param {Array<{ value: number }>} data - Array of objects containing numeric values.
 * @param {number} mean - The mean of the dataset.
 * @param {number} stdDev - The standard deviation of the dataset.
 * @returns {boolean} True if the low variation rule is violated, otherwise false.
 */
export function is15PointsWithin1σ(data, mean, stdDev) {
    if (!data || data.length < 15) return false;

    let count = 0;

    for (let i = 0; i < data.length; i++) {
        const deviation = Math.abs(data[i].value - mean);

        if (deviation <= stdDev) {
            count++;
        } else {
            count = 0; // reset streak when a point falls outside ±1σ
        }

        if (count >= 15) {
            return true; // rule triggered
        }
    }

    return false;
}




