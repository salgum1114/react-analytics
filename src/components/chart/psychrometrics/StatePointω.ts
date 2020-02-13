import uuid from 'uuid';

import {
    wFromPv,
    pvFromTempRh,
    vFromTempω,
    totalPressure,
} from './Core';

interface StatePointω {
    id: string;
    temperature: number;
    humidityRatio: number;
    pv: number;
    name: string;
    humidity: number;
    v: number; // Specific Volume
}

class StatePointω implements StatePointω {
    constructor(temp: number, humidity: number, name: string) {
        this.id = uuid();
        // this.temperature = getRandomInt(minTempF, maxTemp);
        // const maxωrange = Math.min(satHumidRatioFromTempIp(this.temperature, totalPressure), maxω);
        // this.humidityRatio = Math.round(getRandomArbitrary(0, maxωrange) / 0.001) * 0.001;
        this.temperature = 75;
        this.humidity = 0.4;
        this.pv = pvFromTempRh(this.temperature, this.humidity);
        this.v = vFromTempω(this.temperature, this.humidityRatio, totalPressure);
        this.humidityRatio = wFromPv(this.pv, totalPressure);
        // vFromTempω
        console.log(this.temperature, this.humidityRatio, this.pv, this.v);
        this.name = name;
    }
}

export default StatePointω;
