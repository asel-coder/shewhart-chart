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






