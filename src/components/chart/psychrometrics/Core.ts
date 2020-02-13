/* global ko, d3 */
/* global Blob */
/* global saveSvgAsPng */
export const c8 = -1.0440397e4;
export const c9 = -1.129465e1;
export const c10 = -2.7022355e-2;
export const c11 = 1.289036e-5;
export const c12 = -2.4780681e-9;
export const c13 = 6.5459673;

export const minTempF = 32;
export const maxTempF = 120;
export const maxω = 0.03;
export const totalPressure = 14.7;

export const xOffsetPercentLeft = 2;
export const xOffsetPercentRight = 15;
export const yOffsetPercent = 10;

export const Rda = 53.35; // Dry air gas constant, ft-lbf / lbda-R

export const constantRHvalues = [10, 20, 30, 40, 50, 60, 70, 80, 90];

export const convertFahrenheitToCelsius = (temp: number): number => (temp - 32) / 1.8;

export const convertCelsiusToFahrenheit = (temp: number): number => (temp * 1.8) + 32;

export const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
}

export const getRandomArbitrary = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
}

export const isMult = (val: number, mult: number) => val % mult === 0;

export const newtonRaphson = (zeroFunc: (...args: any) => any, derivativeFunc: (...args: any) => any, initialX: number, tolerance?: number) => {
    if (typeof tolerance === 'undefined') {
        tolerance = 0.0001;
    }
    let testX = initialX;
    while (Math.abs(zeroFunc(testX)) > tolerance) {
        testX = testX - zeroFunc(testX) / derivativeFunc(testX);
    }
    return testX;
}

// Utility method that guarantees that min and max are exactly
// as input, with the step size based on 0.
export const range = (min: any, max: any, stepsize: number) => {
    const parsedMin = parseFloat(min);
    const toReturn = parsedMin % stepsize === 0 ? [] : [parsedMin];
    let n = 0;
    const baseValue = stepsize * Math.ceil(parsedMin / stepsize);
    while (baseValue + n * stepsize < parseFloat(max)) {
        toReturn.push(baseValue + n * stepsize);
        n = n + 1;
    }
    toReturn.push(max);
    return toReturn;
}

// Saturation pressure in psia from temp in °F. Pws
export const satPressFromTempIp = (temp: number) => {
    const t = temp + 459.67;
    const lnOfSatPress =
        c8 / t +
        c9 +
        c10 * t +
        c11 * Math.pow(t, 2) +
        c12 * Math.pow(t, 3) +
        c13 * Math.log(t);
    const satPress = Math.exp(lnOfSatPress);
    return satPress;
}

export const satHumidRatioFromTempIp = (temp: number, totalPressure: number) => {
    if (!temp && !totalPressure) {
        throw Error(`Not all parameters specified. temp: ${temp}; P: ${totalPressure}`);
    }
    const satPress = satPressFromTempIp(temp);
    return (0.621945 * satPress) / (totalPressure - satPress);
}

export const wFromPv = (pv: number, totalPressure: number) => {
    if (!pv && !totalPressure) {
        throw Error(`Not all parameters specified. pv: ${pv}; P: ${totalPressure}`);
    }
    return (0.621945 * pv) / (totalPressure - pv);
}

export const pvFromw = (w: any, totalPressure: number) => {
    if (typeof w === 'string') {
        w = parseFloat(w);
    }
    if (w < 0.000001) {
        return 0;
    }
    return totalPressure / (1 + 0.621945 / w);
}

// partial pressure of vapor from dry bulb temp (°F) and rh (0-1)
export const pvFromTempRh = (temp: number, rh: number) => {
    if (rh < 0 || rh > 1) {
        throw new Error('RH value must be between 0-1');
    }
    return rh * satPressFromTempIp(temp);
}

export const tempFromRhAndPv = (rh: number, pv: number) => {
    if (!rh || rh > 1) {
        throw new Error('RH value must be between 0-1');
    }
    const goalPsat = pv / rh;
    // Employ Newton-Raphson method.
    const funcToZero = (temp: number) => {
        return satPressFromTempIp(temp) - goalPsat;
    }
    const derivativeFunc = (temp: number) => dPvdT(1, temp);
    return newtonRaphson(funcToZero, derivativeFunc, 80, 0.00001)
}

export const tempFromEnthalpyPv = (h: number, pv: number, totalPressure: number) => {
    const ω = wFromPv(pv, totalPressure);
    return (h - ω * 1061) / (0.24 + ω * 0.445);
}

// Returns object with temperature (°F) and vapor pressure (psia)
export const tempPvFromvRh = (v: number, rh: number, totalPressure: number) => {
    const rAir = 53.35; // Gas constant in units of ft-lbf / lbm - R
    const funcToZero = (temp: number) => {
        // The 144 is a conversion factor from psf to psi. The 469.67 is to go from F to R.
        const term1 = satPressFromTempIp(temp) * rh;
        const term2 = (totalPressure - rAir * (temp + 459.67) / (v * 144));
        return term1 - term2;
    }
    const derivative = (temp: number) => {
        return dPvdT(rh, temp) + rAir / (v * 144);
    }
    // Employ the Newton-Raphson method.
    const testTemp = newtonRaphson(funcToZero, derivative, 80);
    return { temp: testTemp, pv: pvFromTempRh(testTemp, rh) };
}

export const wetBulbRh = (wetBulb: number, rh: number, totalP: number) => {
    if (rh < 0 || rh > 1) {
        throw new Error('RH expected to be between 0 and 1');
    }
    const funcToZero = (testTemp: number) => {
        const ω1 = ωFromWetbulbDryBulb(wetBulb, testTemp, totalP);
        const pv2 = rh * satPressFromTempIp(testTemp);
        const ω2 = wFromPv(pv2, totalP);
        return ω1 - ω2;
    }
    let updatedMaxTemp = 200;
    let updatedMinTemp = 0;
    let looping = true;
    let testTemp;
    while (looping) {
        testTemp = (updatedMaxTemp + updatedMinTemp) / 2;
        const result = funcToZero(testTemp);
        if (Math.abs(result) < 0.00001) {
            looping = false;
        } else {
            // Too low case
            if (result > 0) {
                updatedMinTemp = testTemp;
            } else {
                updatedMaxTemp = testTemp;
            }
        }
    }
    return { temp: testTemp, pv: pvFromTempRh(testTemp, rh) }
}

// temp: Dry bulb temperature in °F
// ω: Humidity ratio
// totalPressure: Total Pressure in psia.
export const wetBulbFromTempω = (temp: number, ω: number, totalPressure: number) => {
    // Function we'd like to 0. A difference in ω's.
    const testWetbulbResult = (testWetbulb: number) => {
        const satωAtWetBulb = satHumidRatioFromTempIp(testWetbulb, totalPressure);
        return ((1093 - 0.556 * testWetbulb) * satωAtWetBulb - 0.24 * (temp - testWetbulb)) /
            (1093 + 0.444 * temp - testWetbulb) - ω;
    }
    let updatedMaxTemp = temp;
    let updatedMinTemp = 0;
    let testTemp = (updatedMaxTemp + updatedMinTemp) / 2;
    let iterations = 0;
    let testResult = testWetbulbResult(testTemp);
    while (Math.abs(testResult) > 0.000001) {
        if (iterations > 500) {
            throw new Error('Infinite loop in temp from Rh and Pv.');
        }
        if (testResult > 0) {
            updatedMaxTemp = testTemp;
            testTemp = (updatedMaxTemp + updatedMinTemp) / 2;
        } else {
            updatedMinTemp = testTemp;
            testTemp = (updatedMaxTemp + updatedMinTemp) / 2;
        }
        testResult = testWetbulbResult(testTemp);
        iterations++;
    }
    return testTemp;
}

export const tempFromWetbulbω = (wetBulb: number, ω: number, totalPressure: number) => {
    const ωsatWetBulb = satHumidRatioFromTempIp(wetBulb, totalPressure);
    return ((1093 - 0.556 * wetBulb) * ωsatWetBulb + 0.24 * wetBulb - ω * (1093 - wetBulb)) / (0.444 * ω + 0.24);
}

export const ωFromWetbulbDryBulb = (wetbulbTemp: number, temp: number, totalPressure: number) => {
    const ωsatWetBulb = satHumidRatioFromTempIp(wetbulbTemp, totalPressure);
    return ((1093 - 0.556 * wetbulbTemp) * ωsatWetBulb - 0.24 * (temp - wetbulbTemp)) / (1093 + 0.444 * temp - wetbulbTemp);
}

export const vFromTempω = (temp: number, ω: number, totalPressure: number) => {
    return 0.370486 * (temp + 459.67) * (1 + 1.607858 * ω) / totalPressure;
}

export const tempFromvω = (v: number, ω: number, totalPressure: number) => {
    return (v * totalPressure) / (0.370486 * (1 + 1.607858 * ω)) - 459.67;
}

export const ωFromTempv = (temp: number, v: number, totalPressure: number) => {
    const numerator = ((totalPressure * v) / (0.370486 * (temp + 459.67))) - 1;
    return numerator / 1.607858;
}

// Calculate derivative of pv vs. T at given RH (0-1) and temp (°F)
export const dPvdT = (rh: number, temp: number) => {
    if (rh < 0 || rh > 1) {
        throw Error('rh should be specified 0-1');
    }
    const absTemp = temp + 459.67;
    const term1 =
        -c8 / (absTemp * absTemp) +
        c10 +
        2 * c11 * absTemp +
        3 * c12 * absTemp * absTemp +
        c13 / absTemp;
    return rh * satPressFromTempIp(temp) * term1;
}

//
export const humidityRatioFromEnthalpyTemp = (enthalpy: number, temp: number) => {
    return (enthalpy - 0.24 * temp) / (1061 + 0.445 * temp);
}

export const enthalpyFromTempPv = (temp: number, pv: number, totalPressure: number) => {
    const ω = wFromPv(pv, totalPressure);
    return 0.24 * temp + ω * (1061 + 0.445 * temp);
}

export const pvFromEnthalpyTemp = (enthalpy: number, temp: number, totalPressure: number) => {
    return pvFromw(humidityRatioFromEnthalpyTemp(enthalpy, temp), totalPressure);
}

export const satTempAtEnthalpy = (enthalpy: number, totalPressure: number) => {
    let currentLowTemp = 0;
    let currentHighTemp = 200;
    let error = 1;
    let testTemp = (currentLowTemp + currentHighTemp) / 2;
    let iterations = 0;
    do {
        iterations++;
        if (iterations > 500) {
            throw Error('Inifite loop in satTempAtEnthalpy');
        }
        testTemp = (currentLowTemp + currentHighTemp) / 2;
        const testSatHumidityRatio = satHumidRatioFromTempIp(testTemp, totalPressure);
        const testHumidityRatio = humidityRatioFromEnthalpyTemp(enthalpy, testTemp);
        error = testSatHumidityRatio - testHumidityRatio;
        if (testSatHumidityRatio > testHumidityRatio) {
            currentHighTemp = testTemp;
        } else {
            currentLowTemp = testTemp;
        }
    } while (Math.abs(error) > 0.00005);
    return testTemp;
}
