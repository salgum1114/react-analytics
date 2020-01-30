import React, { Component } from 'react';
import uuid from 'uuid';
import * as d3 from 'd3';
import ResizeObserver from 'resize-observer-polyfill';

import './psychrometrics.less';
import {
    maxTempF,
    maxω,
    totalPressure,
    pvFromw,
    minTempF,
    range,
    wFromPv,
    vFromTempω,
    tempFromRhAndPv,
    satPressFromTempIp,
    enthalpyFromTempPv,
    xOffsetPercentLeft,
    yOffsetPercent,
    constantRHvalues,
    pvFromTempRh,
    dPvdT,
    pvFromEnthalpyTemp,
    newtonRaphson,
    satHumidRatioFromTempIp,
    ωFromTempv,
    tempFromvω,
    tempPvFromvRh,
    satTempAtEnthalpy,
    tempFromEnthalpyPv,
    isMult,
    wetBulbFromTempω,
    ωFromWetbulbDryBulb,
    tempFromWetbulbω,
    wetBulbRh,
    xOffsetPercentRight,
    Rda,
} from './Core';
import StatePointω from './StatePointω';

interface IState {
    width: number;
    height: number;
    statePointωs: StatePointω[];
}

class Psychrometrics extends Component<{}, IState> {
    private id = `chart_${uuid()}`;
    private chartContainerRef = React.createRef<HTMLDivElement>();
    private resizeObserver: ResizeObserver;
    private vPaths: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
    private wetBulbPaths: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
    private enthalpyPaths: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
    private enthalpyBorderPath: d3.Selection<SVGPathElement, unknown, HTMLElement, any>
    private hLabels: d3.Selection<SVGGElement, unknown, HTMLElement, any>
    private rhticks: d3.Selection<SVGGElement, unknown, HTMLElement, any>

    state: IState = {
        width: 0,
        height: 0,
        statePointωs: [],
    }

    componentDidMount() {
        this.waitForChartRenderer(document.querySelector(`#${this.id}`));
        this.createObserver();
    }

    componentDidUpdate() {
        d3.select('#temp-lines')
        .selectAll('path')
        // @ts-ignore
        .attr('d', d => this.getSaturationLine()(d))
    }

    componentWillUnmount() {
        this.destoryObserver();
    }

    createObserver = () => {
        this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
            const { width = 0, height = 0 } = entries[0] && entries[0].contentRect || {};
            this.setState({
                width,
                height,
            });
        });
        this.resizeObserver.observe(this.chartContainerRef.current);
    }

    destoryObserver = () => {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }

    getChart = () => d3.select(`#${this.id}`)

    getMaxPv = () => pvFromw(maxω, totalPressure)

    getPvAxisTemp = () => maxTempF + 6;

    getMiddleX = () => this.getXScale()((maxTempF + minTempF) / 2)

    getPixelsPerTemp = () => this.getXScale()(1) - this.getXScale()(0)

    getPixelsPerPsia = () => this.getYScale()(1) - this.getYScale()(0)

    getAngleFromDerivative = (derivative: number) => (Math.atan(derivative * this.getPixelsPerPsia() / (this.getPixelsPerTemp())) * 180) / Math.PI

    getTempAtCutOff = () => tempFromRhAndPv(1, this.getMaxPv())

    getUpperLeftBorderTemp = () => this.getTempAtCutOff() - 0.05 * (maxTempF - minTempF)

    getBottomLeftBorderPv = () => satPressFromTempIp(minTempF) + 0.05 * this.getMaxPv()

    getXScale = () => d3.scaleLinear()
        .domain([minTempF, maxTempF])
        .range([
            (xOffsetPercentLeft * this.state.width) / 100,
            this.state.width - (xOffsetPercentRight * this.state.width) / 100,
        ]);

    getYScale = () => d3.scaleLinear()
        .domain([0, this.getMaxPv()])
        .range([
            this.state.height - (yOffsetPercent * this.state.height) / 100,
            (yOffsetPercent * this.state.height) / 100,
        ])

    getBoundaryLine = (element: any) => element
        .attr('fill', 'none')
        .attr('stroke', '#000000')
        .attr('stroke-width', 2)

    getSaturationLine = () => d3.line()
        // @ts-ignore
        .x(d => this.getXScale()(d.x))
        // @ts-ignore
        .y(d => this.getYScale()(Math.min(d.y, this.getMaxPv())))

    axisHandler = {
        // @ts-ignore
        xAxisTempF: () => d3.axisBottom()
            .scale(this.getXScale())
            .tickValues(range(minTempF, maxTempF, 5).filter(temp => temp % 5 === 0)),
        // @ts-ignore
        yAxis: () => d3.axisRight()
            .scale(this.getYScale()),
        // @ts-ignore
        yAxisHumidity: () => d3.axisRight()
            .scale(this.getYScale())
            .tickValues(this.humidityHandler.constantHumidities().map(ω => pvFromw(ω, totalPressure)))
            // @ts-ignore
            .tickFormat(d => wFromPv(d, totalPressure).toFixed(3)),
        yAxisLabelHumidity: () => this.getChart().append('text')
            .text('ω')
            .attr('x', this.getXScale()(maxTempF + 4))
            .attr('y', this.getYScale()(this.getMaxPv() / 2)),
        yAxisLabelV: () => {
            const pvAxisX = this.getXScale()(this.getPvAxisTemp() + 5);
            const pvAxisY = this.getYScale()(this.getMaxPv() / 2);
            this.getChart().append('text')
            .text('Vapor Press. / psia')
            .attr('x', pvAxisX)
            .attr('y', pvAxisY)
            .attr('transform', `rotate(-90, ${pvAxisX}, ${pvAxisY})`);
        },
        xAxisLabelTemp: () => this.getChart().append('text')
            .text('Dry bulb temperature / °F')
            .attr('x', this.getMiddleX())
            .attr('y', this.getYScale()(-0.05)),
        createXAxisTemp: () => {
            const selection = d3.select('#x-axis');
            selection.attr('transform', `translate(0, ${this.getYScale()(-0.005)})`);
            const xAxis = this.axisHandler.xAxisTempF();
            selection.call(xAxis);
            this.axisHandler.xAxisLabelTemp();
        },
        createYAxisHumidity: () => {
            d3.select('#yAxisHumid')
            .attr('transform', `translate(${this.getXScale()(maxTempF + 0.5)}, 0)`)
            .call(this.axisHandler.yAxisHumidity());
            this.axisHandler.yAxisLabelHumidity();
        },
        createYAxisV: () => {
            this.getChart().append('g').attr('id', 'yAxis')
            .attr('transform', `translate(${this.getXScale()(this.getPvAxisTemp())}, 0)`)
            .call(this.axisHandler.yAxis());
            this.axisHandler.yAxisLabelV();
        },
    }

    vHandler = {
        minV: () => vFromTempω(minTempF, 0, totalPressure),
        maxV: () => vFromTempω(maxTempF, wFromPv(this.getMaxPv(), totalPressure), totalPressure),
        vValues: () => range(Math.ceil(this.vHandler.minV() / 0.1) * 0.1, Math.floor(this.vHandler.maxV() / 0.1) * 0.1, 0.1),
        vLines: () => {
            const firstVCutOff = vFromTempω(minTempF, satHumidRatioFromTempIp(minTempF, totalPressure), totalPressure);
            const secondVCutOff = vFromTempω(this.getTempAtCutOff(), wFromPv(this.getMaxPv(), totalPressure), totalPressure);
            return this.vHandler.vValues().map(v => {
                const mapFunc = (temp: number) => ({
                    x: temp,
                    y: pvFromw(ωFromTempv(temp, v, totalPressure), totalPressure),
                });
                let lowerTemp;
                let upperTemp;
                if (v < firstVCutOff) {
                    lowerTemp = minTempF;
                    upperTemp = tempFromvω(v, 0, totalPressure);
                } else if (v < secondVCutOff) {
                    lowerTemp = tempPvFromvRh(v, 1, totalPressure).temp;
                    upperTemp = Math.min(tempFromvω(v, 0, totalPressure), maxTempF);
                } else {
                    lowerTemp = tempFromvω(v, wFromPv(this.getMaxPv(), totalPressure), totalPressure);
                    upperTemp = Math.min(tempFromvω(v, 0, totalPressure), maxTempF);
                }
                const data = [lowerTemp, upperTemp].map(mapFunc);
                const labelLocation = tempPvFromvRh(v, 0.35, totalPressure);
                // 144 to go from psf to psi.
                const derivative = -Rda / v / 144;
                const rotationDegrees = this.getAngleFromDerivative(derivative);
                return {
                    v: Math.round(v * 10) / 10,
                    data,
                    labelLocation,
                    rotationDegrees,
                    x: this.getXScale()(labelLocation.temp),
                    y: this.getYScale()(labelLocation.pv),
                };
            });
        },
        createVLines: () => {
            let selection = this.vPaths.selectAll('path').data(this.vHandler.vLines());
            selection.enter()
            .append('path')
            // @ts-ignore
            .merge(selection)
            .attr('fill', 'none')
            .attr('stroke', 'purple')
            // @ts-ignore
            .attr('d', d => this.getSaturationLine()(d.data));
            selection.exit().remove();
            const data = this.vHandler.vLines().filter(d => d.v % 0.5 === 0 &&
                                                d.labelLocation.temp > minTempF &&
                                                d.labelLocation.temp < maxTempF &&
                                                d.labelLocation.pv < this.getMaxPv());
            // @ts-ignore
            selection = d3.select('#v-labels').selectAll('text').data(data);
            selection.enter()
            .append('text')
            // @ts-ignore
            .merge(selection)
            .attr('class', 'ticks')
            .attr('text-anchor', 'middle')
            // @ts-ignore
            .text(d => d.v.toFixed(1))
            // @ts-ignore
            .attr('x', d => d.x)
            // @ts-ignore
            .attr('y', d => d.y)
            // @ts-ignore
            .attr('transform', d => `rotate(${d.rotationDegrees}, ${d.x}, ${d.y}) translate(0, -5)`);
            selection.exit().remove();

            // @ts-ignore
            selection = d3.select('#v-label-backgrounds').selectAll('rect').data(data);
            selection.enter()
            .append('rect')
            // @ts-ignore
            .merge(selection)
            .attr('fill', 'white')
            .attr('width', '25px')
            .attr('height', '15px')
            // @ts-ignore
            .attr('x', d => this.getXScale()(d.labelLocation.temp))
            // @ts-ignore
            .attr('y', d => this.getYScale()(d.labelLocation.pv))
            // @ts-ignore
            .attr('transform', d => `rotate(${d.rotationDegrees}, ${d.x}, ${d.y}) translate(0 -5) translate(-12 -12)`);
            selection.exit().remove();
        },
    }

    enthalpyHandler = {
        minEnthalpy: () => enthalpyFromTempPv(minTempF, 0, totalPressure),
        maxEnthalpy: () => enthalpyFromTempPv(maxTempF, this.getMaxPv(), totalPressure),
        constEnthalpyValues: () => range(Math.ceil(this.enthalpyHandler.minEnthalpy()), Math.floor(this.enthalpyHandler.maxEnthalpy()), 0.2),
        tempAtStraightEnthalpyLine: (enthalpy: number) => {
            const rise = this.getMaxPv() - this.getBottomLeftBorderPv();
            const run = this.getUpperLeftBorderTemp() - minTempF;
            const straightLinePv = (temp: number) => {
                return this.getBottomLeftBorderPv() + (rise / run) * (temp - minTempF);
            }
            const funcToZero = (temp: number) => {
                return straightLinePv(temp) - pvFromEnthalpyTemp(enthalpy, temp, totalPressure);
            }
            // This comes from maxima, a computer algebra system, see corresponding maxima file.
            const derivative = (temp: number) => {
                return (rise / run) - ((1807179 * (12000000 * temp - 50000000 * enthalpy) * totalPressure) /
                    Math.pow(1807179 * temp + 50000000 * enthalpy + 32994182250, 2) -
                    (12000000 * totalPressure) / (1807179 * temp + 50000000 * enthalpy + 32994182250));
            }
            return newtonRaphson(funcToZero, derivative, 80);
        },
        enthalpyValueToLine: (enthalpyValue: number) => {
            const firstBoundaryEnthalpy = enthalpyFromTempPv(minTempF, satPressFromTempIp(minTempF) + 0.05 * this.getMaxPv(), totalPressure);
            const secondBoundaryEnthalpy = enthalpyFromTempPv(this.getUpperLeftBorderTemp(), this.getMaxPv(), totalPressure);
            const maxEnthalpyTemp = Math.min(enthalpyValue / 0.24, maxTempF);
            const mapFunc = (temp: number) => ({
                x: temp,
                y: pvFromEnthalpyTemp(enthalpyValue, temp, totalPressure),
            });
            if (enthalpyValue < firstBoundaryEnthalpy) {
                if (enthalpyValue % 5 === 0) {
                    return { h: enthalpyValue, coords: range(minTempF, maxEnthalpyTemp, 0.25).map(mapFunc) };
                } else {
                    return { h: enthalpyValue, coords: range(minTempF, satTempAtEnthalpy(enthalpyValue, totalPressure), 0.25).map(mapFunc) };
                }
            } else if (enthalpyValue < secondBoundaryEnthalpy) {
                const tempAtBorder = this.enthalpyHandler.tempAtStraightEnthalpyLine(enthalpyValue);
                return {
                    h: enthalpyValue,
                    coords: range(
                        tempAtBorder,
                        enthalpyValue % 5 === 0 ? maxEnthalpyTemp : satTempAtEnthalpy(enthalpyValue, totalPressure), 0.25,
                    ).map(mapFunc),
                };
            } else { // Top section
                return {
                    h: enthalpyValue,
                    coords: range(
                        tempFromEnthalpyPv(enthalpyValue, this.getMaxPv(), totalPressure),
                        isMult(enthalpyValue, 5) ? maxEnthalpyTemp : satTempAtEnthalpy(enthalpyValue, totalPressure), 0.25,
                    ).map(mapFunc),
                };
            }
        },
        constEnthalpyLines: () => this.enthalpyHandler.constEnthalpyValues().map(this.enthalpyHandler.enthalpyValueToLine),
        enthalpyBorderLineData: () => [
            { x: minTempF, y: satPressFromTempIp(minTempF) },
            { x: minTempF, y: this.getBottomLeftBorderPv() },
            { x: this.getUpperLeftBorderTemp(), y: this.getMaxPv() },
            { x: this.getTempAtCutOff(), y: this.getMaxPv() },
        ],
        // @ts-ignore
        createEnthalpyBorderLines: () => this.enthalpyBorderPath.attr('d', this.getSaturationLine()(this.enthalpyHandler.enthalpyBorderLineData())).call(this.boundaryHandler.boundaryLine),
        createEnthalpyLabel: () => {
            const rise = this.getMaxPv() - this.getBottomLeftBorderPv();
            const run = this.getUpperLeftBorderTemp() - minTempF;
            const angle = Math.atan((rise * this.getPixelsPerPsia()) / (run * this.getPixelsPerTemp())) * 180 / Math.PI;
            const baseX = (this.getUpperLeftBorderTemp() + minTempF) / 2;
            const baseY = (this.getMaxPv() + this.getBottomLeftBorderPv()) / 2;
            const absBaseX = this.getXScale()(baseX);
            const absBaseY = this.getYScale()(baseY);
            this.getChart().append('text')
            .attr('id', 'enthalpy-label')
            .text('Enthalpy / Btu per lb d.a.')
            .attr('x', absBaseX)
            .attr('y', absBaseY)
            .attr('transform', `rotate(${angle}, ${absBaseX}, ${absBaseY}) translate(-100 -40)`);
        },
        createEnthalpyLines: () => {
            let selection = this.enthalpyPaths.selectAll('path')
                .data(this.enthalpyHandler.constEnthalpyLines()
                // @ts-ignore
                .filter(d => d.coords));
            selection.enter()
            .append('path')
            // @ts-ignore
            .merge(selection)
            .attr('fill', 'none')
            .attr('stroke', 'green')
            // @ts-ignore
            .attr('stroke-width', d => {
                if (d.h % 5 === 0) {
                    return 1;
                } else if (d.h % 1 === 0) {
                    return 0.75;
                } else {
                    return 0.25;
                }
            })
            // @ts-ignore
            .attr('d', d => this.getSaturationLine()(d.coords));
            selection.exit().remove();
            const data = this.enthalpyHandler.constEnthalpyValues().filter(h =>
                h % 5 === 0 &&
                h < enthalpyFromTempPv(this.getUpperLeftBorderTemp(), this.getMaxPv(), totalPressure),
            );
            // @ts-ignore
            selection = this.hLabels.selectAll('text').data(data);
            selection.enter()
            .append('text')
            // @ts-ignore
            .merge(selection)
            .attr('class', 'ticks')
            // @ts-ignore
            .text(d => d.toString())
            // @ts-ignore
            .attr('x', d => this.getXScale()(this.enthalpyHandler.tempAtStraightEnthalpyLine(d) - 0.75))
            // @ts-ignore
            .attr('y', d => this.getYScale()(pvFromEnthalpyTemp(d, this.enthalpyHandler.tempAtStraightEnthalpyLine(d), totalPressure) + 0.005));
            selection.exit().remove();
        },
    }

    wetBulbHandler = {
        minWetBulb: wetBulbFromTempω(minTempF, 0, totalPressure),
        maxWetBulb: wetBulbFromTempω(maxTempF, wFromPv(this.getMaxPv(), totalPressure), totalPressure),
        wetBulbBottomRight: () => wetBulbFromTempω(maxTempF, 0, totalPressure),
        wetBulbValues: () => range(Math.ceil(this.wetBulbHandler.minWetBulb), Math.floor(this.wetBulbHandler.maxWetBulb), 1),
        wetBulbLabelRh: 0.55, // RH value to put all the wetbulb labels.
        wetBulbLines: () => {
            // This is the derivative of Pv vs. temperature for a given
            // constant wet-bulb line.
            const derivative = (temp: number, wetBulb: number) => {
                const wSatWetBulb = satHumidRatioFromTempIp(wetBulb, totalPressure);
                const high = (1093 - 0.556 * wetBulb) * wSatWetBulb - 0.24 * (temp - wetBulb);
                const low = 1093 + 0.444 * temp - wetBulb;
                const dHigh = -0.24;
                const dLow = 0.444;
                const dwdT = ((low * dHigh) - (high * dLow)) / (low * low);
                const w = ωFromWetbulbDryBulb(wetBulb, temp, totalPressure);
                const dpvdw = (200000 * totalPressure) / (200000 * w + 124389) - (40000000000 * totalPressure * w) / Math.pow(200000 * w + 124389, 2);
                return dpvdw * dwdT;
            }
            return this.wetBulbHandler.wetBulbValues().map(wetBulbTemp => {
                const mapFunc = (temp: number) => ({
                    x: temp,
                    y: pvFromw(ωFromWetbulbDryBulb(wetBulbTemp, temp, totalPressure), totalPressure),
                });
                let lowerTemp;
                let upperTemp;
                if (wetBulbTemp < minTempF) {
                    lowerTemp = minTempF;
                    upperTemp = tempFromWetbulbω(wetBulbTemp, 0, totalPressure);
                } else if (wetBulbTemp < this.wetBulbHandler.wetBulbBottomRight()) {
                    lowerTemp = wetBulbTemp;
                    upperTemp = tempFromWetbulbω(wetBulbTemp, 0, totalPressure);
                } else if (wetBulbTemp < this.getTempAtCutOff()) {
                    lowerTemp = wetBulbTemp;
                    upperTemp = maxTempF;
                } else {
                    lowerTemp = tempFromWetbulbω(wetBulbTemp, wFromPv(this.getMaxPv(), totalPressure), totalPressure);
                    upperTemp = maxTempF;
                }
                const data = range(lowerTemp, upperTemp, 3).map(mapFunc);
                const labelState = wetBulbRh(wetBulbTemp, this.wetBulbHandler.wetBulbLabelRh, totalPressure);
                const midTemp = labelState.temp;
                const rotationAngle = this.getAngleFromDerivative(derivative(midTemp, wetBulbTemp));
                const midPv = labelState.pv;
                return {
                    wetBulbTemp,
                    data,
                    midTemp,
                    midPv,
                    x: this.getXScale()(midTemp),
                    y: this.getYScale()(midPv),
                    rotationAngle,
                };
            });
        },
        createWetBulbLines: () => {
            let selection = this.wetBulbPaths.selectAll('path').data(this.wetBulbHandler.wetBulbLines());
            selection.enter()
            .append('path')
            // @ts-ignore
            .merge(selection)
            .attr('fill', 'none')
            .attr('stroke', 'orange')
            .attr('stroke-dasharray', '1 1')
            .attr('stroke-width', 0.5)
            // @ts-ignore
            .attr('d', d => this.getSaturationLine()(d.data));
            selection.exit().remove();

            const data = this.wetBulbHandler.wetBulbLines().filter(d =>
                d.wetBulbTemp % 5 === 0 &&
                d.midTemp > minTempF &&
                d.midTemp < maxTempF &&
                d.midPv < this.getMaxPv(),
            );
            // @ts-ignore
            selection = d3.select('#wetbulb-labels').selectAll('text').data(data);
            selection.enter()
            .append('text')
            // @ts-ignore
            .merge(selection)
            .attr('class', 'ticks')
            .style('font-size', '8px')
            // @ts-ignore
            .text(d => d.wetBulbTemp.toFixed(0))
            // @ts-ignore
            .attr('x', d => this.getXScale()(d.midTemp))
            // @ts-ignore
            .attr('y', d => this.getYScale()(d.midPv))
            // @ts-ignore
            .attr('transform', d => `rotate(${d.rotationAngle}, ${d.x}, ${d.y}) translate(0 -3)`);
            selection.exit().remove();

            // @ts-ignore
            selection = d3.select('#wetbulb-labels-backgrounds').selectAll('rect').data(data);
            selection.enter()
            .append('rect')
            // @ts-ignore
            .merge(selection)
            .attr('fill', 'white')
            .attr('width', '14px')
            .attr('height', '10px')
            // @ts-ignore
            .attr('x', d => this.getXScale()(d.midTemp))
            // @ts-ignore
            .attr('y', d => this.getYScale()(d.midPv))
            // @ts-ignore
            .attr('transform', d => `rotate(${d.rotationAngle}, ${d.x}, ${d.y}) translate(0 -3) translate(-2 -8)`);
            selection.exit().remove();
        },
    }

    boundaryHandler = {
        boundaryLine: (element: any) => element
            .attr('fill', 'none')
            .attr('stroke', '#000000')
            .attr('stroke-width', 2),
        boundaryLineData: () => [
            { x: maxTempF, y: 0 },
            { x: minTempF, y: 0 },
            { x: minTempF, y: satPressFromTempIp(minTempF) },
            ...range(minTempF, tempFromRhAndPv(1, this.getMaxPv()), 0.1).map(temp => ({ x: temp, y: satPressFromTempIp(temp) })),
            { x: tempFromRhAndPv(1, this.getMaxPv()), y: this.getMaxPv() },
            { x: maxTempF, y: satPressFromTempIp(tempFromRhAndPv(1, this.getMaxPv())) },
            { x: maxTempF, y: 0 },
        ],
        createBoundaryLines: () => d3.select('#boundary-lines').select('path')
        // @ts-ignore
            .attr('d', `${this.getSaturationLine()(this.boundaryHandler.boundaryLineData())} Z`),
    }

    dewPointHandler = {
        createDewPointLabels: () => {
            const selection = d3.select('#dewpointlabels').selectAll('text')
            .data(this.temperatureHandler.constantTemps().filter(temp => temp % 5 === 0 && satPressFromTempIp(temp) < this.getMaxPv()));
            selection.enter()
            .append('text')
            // @ts-ignore
            .merge(selection)
            // @ts-ignore
            .text(d => d.toString())
            .attr('dx', '-13')
            .attr('font-size', '10px')
            // @ts-ignore
            .attr('x', d => this.getXScale()(d))
            // @ts-ignore
            .attr('y', d => this.getYScale()(satPressFromTempIp(d) + 0.003));
            selection.exit().remove()
        },
    }

    temperatureHandler = {
        tempDiff: () => Math.round((maxTempF - minTempF) * 0.15 / 9),
        startTemp: () => Math.round(minTempF + (maxTempF - minTempF) * 0.6),
        constantTempLines: () => this.temperatureHandler.constantTemps().map(temp => [{ x: temp, y: 0 }, { x: temp, y: satPressFromTempIp(temp) }]),
        constantTemps: () => range(minTempF, maxTempF, 1),
        createTempLines: () => {
            const selection = d3.select('#temp-lines')
            .selectAll('path')
            .data(this.temperatureHandler.constantTempLines());
            selection.enter()
            .append('path')
            // @ts-ignore
            .merge(selection)
            // @ts-ignore
            .attr('d', d => this.getSaturationLine()(d))
            .attr('fill', 'none')
            .attr('stroke', '#000000')
            // @ts-ignore
            .attr('stroke-width', d => d[0].x % 10 === 10 ? 1 : 0.5);
            selection.exit().remove();
        },
    }

    humidityHandler = {
        constantHumidities: () => {
            const humidityStep = 0.002;
            const constantHumidities = [];
            for (let i = humidityStep; i < wFromPv(this.getMaxPv(), totalPressure); i = i + humidityStep) {
                constantHumidities.push(i);
            }
            return constantHumidities;
        },
        constantHumidityLines: () => this.humidityHandler.constantHumidities().map(humidity => {
            const pv = pvFromw(humidity, totalPressure);
            return [
                {
                    x: pv < satPressFromTempIp(minTempF) ? minTempF : tempFromRhAndPv(1, pv),
                    y: pv,
                },
                { x: maxTempF, y: pv },
            ];
        }),
        constRHLines: () => constantRHvalues.map((rhValue, i) => {
            const mapFunc = (temp: number) => ({
                x: temp,
                y: (satPressFromTempIp(temp) * rhValue) / 100,
            });
            let data;
            if (pvFromTempRh(maxTempF, rhValue / 100) < this.getMaxPv()) {
                data = range(minTempF, maxTempF, 0.5).map(mapFunc);
            } else {
                const tempAtBorder = tempFromRhAndPv(rhValue / 100, this.getMaxPv());
                data = range(minTempF, tempAtBorder, 0.5).map(mapFunc);
            }
            const temp = this.temperatureHandler.startTemp() - i * this.temperatureHandler.tempDiff();
            const pv = pvFromTempRh(temp, rhValue / 100);
            //// Get derivative in psia/°F
            const derivative = dPvdT(rhValue / 100, temp);
            //// Need to get in same units, pixel/pixel
            const rotationDegrees = this.getAngleFromDerivative(derivative);
            return {
                rh: rhValue,
                temp,
                pv,
                data,
                rotationDegrees,
                x: this.getXScale()(temp),
                y: this.getYScale()(pv),
            };
        }),
        createSepcificHumidityLines: () => {
            const selection = d3.select('#specific-humidity-lines')
            .selectAll('path')
            .data(this.humidityHandler.constantHumidityLines());
            selection.enter()
            .append('path')
            // @ts-ignore
            .merge(selection)
            .attr('fill', 'none')
            .attr('stroke', 'blue')
            .attr('stroke-width', 0.5)
            // @ts-ignore
            .attr('d', d => this.getSaturationLine()(d));
            selection.exit().remove();
        },
        createRHLines: () => {
            let selection = d3.select('#rh-lines')
                .selectAll('path')
                .data(this.humidityHandler.constRHLines());
            selection.enter()
            .append('path')
            // @ts-ignore
            .merge(selection)
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-width', 0.5)
            // @ts-ignore
            .attr('d', d => this.getSaturationLine()(d.data));
            selection.exit().remove();
            const height = 12;
            const labelData = this.humidityHandler.constRHLines().filter(d => d.pv < this.getMaxPv());
            selection = d3.select('#rh-label-background')
                .selectAll('rect')
                .data(labelData);
            selection.enter()
            .append('rect')
            // @ts-ignore
            .merge(selection)
            .attr('width', 25)
            .attr('height', height)
            .attr('fill', 'white')
            // @ts-ignore
            .attr('x', d => this.getXScale()(d.temp))
            // @ts-ignore
            .attr('y', d => this.getYScale()(d.pv))
            // @ts-ignore
            .attr('transform', d => `rotate(${d.rotationDegrees}, ${d.x}, ${d.y}) translate(-2 -${height + 2})`);
            selection.exit().remove();
            selection = this.rhticks.selectAll('text').data(labelData);
            selection.enter()
            .append('text')
            // @ts-ignore
            .merge(selection)
            .attr('class', 'rh-ticks')
            // @ts-ignore
            .text(d => `${d.rh}%`)
            // @ts-ignore
            .attr('x', d => d.x)
            // @ts-ignore
            .attr('y', d => d.y)
            // @ts-ignore
            .attr('transform', d => `rotate(${d.rotationDegrees}, ${d.x}, ${d.y}) translate(0 -3)`);
            selection.exit().remove();
        },
    }

    statePointωHandler = {
        render: () => {
            const chart = this.getChart();
            chart.select('#state-circles').selectAll('circle').remove();
            this.statePointωHandler.create();
        },
        create: () => {
            const rightOffset = 10;
            let selection = d3.select('#state-text').selectAll('text').data(this.state.statePointωs);
            selection.enter()
            .append('text')
            // @ts-ignore
            .merge(selection)
            // @ts-ignore
            .attr('x', d => this.getXScale()(d.temperature))
            // @ts-ignore
            .attr('y', d => this.getYScale()(d.pv))
            .attr('dx', rightOffset)
            .attr('dy', '-10')
            // @ts-ignore
            .text(d => d.name);
            selection.exit().remove();

            // Once the text has been created we can get the
            // the size of the bounding box to put the background
            // behind.
            const boundingBoxes = [] as any[];
            d3.select('#state-text').selectAll('text').each(function(_d, i) {
                const self = this as HTMLElement;
                boundingBoxes[i] = self.getBoundingClientRect();
            });

            selection = d3.select('#state-backgrounds').selectAll('rect').data(this.state.statePointωs);
            selection.enter()
            .append('rect')
            // @ts-ignore
            .merge(selection)
            // @ts-ignore
            .attr('x', d => this.getXScale()(d.temperature))
            // @ts-ignore
            .attr('y', d => this.getYScale()(d.pv))
            // @ts-ignore
            .attr('transform', (d, i) => `translate(${rightOffset - Math.round(boundingBoxes[i].width * 0.1 / 2)}, -25)`)
            // @ts-ignore
            .attr('width', (d, i) => `${Math.ceil(boundingBoxes[i].width * 1.1)}px`)
            .attr('height', '20px')
            .attr('fill', 'white');
            selection.exit().remove();

            selection = d3.select('#state-circles').selectAll('circle').data(this.state.statePointωs);
            selection.enter()
            .append('circle')
            // @ts-ignore
            .merge(selection)
            .style('fill', 'red')
            .attr('r', '5')
            // @ts-ignore
            .attr('cx', d => this.getXScale()(d.temperature))
            // @ts-ignore
            .attr('cy', d => this.getYScale()(d.pv));
            selection.exit().remove();
        },
        add: () => {
            const statePointω = new StatePointω(maxTempF, maxω, `State ${this.state.statePointωs.length + 1}`, totalPressure);
            this.state.statePointωs.push(statePointω);
            this.setState({
                statePointωs: this.state.statePointωs,
            }, this.statePointωHandler.render);
        },
        remove: (statePointω: StatePointω) => {
            this.setState({
                statePointωs: this.state.statePointωs.filter(s => s.id === statePointω.id),
            });
        },
    }

    createChart = () => {
        try {
            const chart = this.getChart();
            this.vPaths = chart.append('g').attr('id', 'vpaths');
            chart.append('g').attr('id', 'specific-humidity-lines');
            chart.append('g').attr('id', 'x-axis');
            this.wetBulbPaths = chart.append('g').attr('id', 'wetbulb-lines');
            chart.append('g').attr('id', 'yAxisHumid');
            this.enthalpyPaths = chart.append('g').attr('id', 'enthalpyLines');
            chart.append('g').attr('id', 'rh-lines');
            chart.append('g').attr('id', 'temp-lines');
            this.enthalpyBorderPath = chart.append('g').attr('id', 'enthalpy-border').append('path');
            this.hLabels = chart.append('g').attr('id', 'h-labels');
            chart.append('g').attr('id', 'boundary-lines')
            .append('path')
            .attr('stroke', '#000000')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
            chart.append('g').attr('id', 'rh-label-background');
            this.rhticks = chart.append('g').attr('class', 'ticks').attr('id', 'rh-ticks');

            chart.append('g').attr('id', 'v-label-backgrounds');
            chart.append('g').attr('id', 'v-labels');

            chart.append('g').attr('id', 'wetbulb-labels-backgrounds');
            chart.append('g').attr('id', 'wetbulb-labels');

            chart.append('g').attr('id', 'states');
            chart.append('g').attr('id', 'state-circles');
            chart.append('g').attr('id', 'state-backgrounds');
            chart.append('g').attr('id', 'state-text');
            chart.append('g').attr('id', 'dewpointlabels');

            // Temperature render
            this.temperatureHandler.createTempLines();

            // Humidity render
            this.humidityHandler.createSepcificHumidityLines();
            // this.humidityHandler.createRHLines();

            // X-axis render
            this.axisHandler.createXAxisTemp();

            // Y-axis first render
            this.axisHandler.createYAxisHumidity();

            // V render
            this.vHandler.createVLines();

            // Enthalpy render
            this.enthalpyHandler.createEnthalpyLines();
            this.enthalpyHandler.createEnthalpyBorderLines();
            this.enthalpyHandler.createEnthalpyLabel();

            // WetBulb render
            this.wetBulbHandler.createWetBulbLines();

            // Boundary render
            this.boundaryHandler.createBoundaryLines();

            // Y-axis second render
            this.axisHandler.createYAxisV();

            // Dew Point Label
            this.dewPointHandler.createDewPointLabels();

            // Render StatePointωs
            this.statePointωHandler.add();
            this.statePointωHandler.add();
            this.statePointωHandler.add();
        } catch (error) {
            console.error(error);
        }
    }

    waitForChartRenderer = (container: Element) => {
        setTimeout(() => {
            if (container) {
                this.createChart();
                return;
            }
            this.waitForChartRenderer(document.querySelector(`#${this.id}`));
        }, 50);
    }

    render() {
        const { width, height } = this.state;
        return (
            <div ref={this.chartContainerRef} style={{ width: '100%', height: '100%' }}>
                <svg id={this.id} style={{ width, height }} />
            </div>
        );
    }
}

export default Psychrometrics;
