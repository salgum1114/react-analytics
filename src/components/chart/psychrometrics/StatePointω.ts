import uuid from 'uuid';

import {
    getRandomInt,
    satHumidRatioFromTempIp,
    getRandomArbitrary,
    pvFromw,
    minTempF,
} from './Core';

interface StatePointω {
    id: string;
    temperature: number;
    humidityRatio: number;
    pv: number;
    name: string;
}

class StatePointω implements StatePointω {
    constructor(maxTemp: number, maxω: number, name: string, totalPressure: number) {
        this.id = uuid();
        this.temperature = getRandomInt(minTempF, maxTemp);
        const maxωrange = Math.min(satHumidRatioFromTempIp(this.temperature, totalPressure), maxω);
        this.humidityRatio = Math.round(getRandomArbitrary(0, maxωrange) / 0.001) * 0.001;
        this.pv = pvFromw(this.humidityRatio, totalPressure);
        this.name = name;
    }
}

export default StatePointω;
