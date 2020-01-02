import React, { Component, ErrorInfo } from 'react';
import ReactEcharts from 'echarts-for-react';

import { IChartContext, ChartContext } from '../../containers/ChartContainer';

class ChartPanel extends Component {
    private chartRef: any;
    private echarts: echarts.ECharts;
    static contextType = ChartContext;
    context: IChartContext;

    componentDidMount() {
        this.echarts = this.chartRef.getEchartsInstance();
    }

    getOption = () => {
        const { structure, style } = this.context;
        const { series, xAxis, yAxis, grid } = structure;
        const gridOption = Object.keys(grid).map(key => {
            return {
                id: key,
                ...grid[key],
                ...style.grid[key],
            };
        });
        const xAxisOption = Object.keys(xAxis).map(key => {
            const {
                grid: xAxisGrid,
                ...other
            } = xAxis[key];
            const gridIndex = gridOption.findIndex(value => value.id === xAxisGrid);
            return {
                id: key,
                gridIndex: gridIndex >= 0 ? gridIndex : 0,
                ...other,
            };
        });
        const yAxisOption = Object.keys(yAxis).map(key => {
            const {
                grid: yAxisGrid,
                ...other
            } = yAxis[key];
            const gridIndex = gridOption.findIndex(value => value.id === yAxisGrid);
            return {
                id: key,
                gridIndex: gridIndex >= 0 ? gridIndex : 0,
                ...other,
            };
        });
        const seriesOption = Object.keys(series).map(key => {
            const {
                type: seriesType,
                xAxis: seriesXAxis,
                yAxis: seriesYAxis,
                ...other
            } = series[key];
            const isArea = seriesType === 'area';
            const xAxisIndex = xAxisOption.findIndex(value => value.id === seriesXAxis);
            const yAxisIndex = yAxisOption.findIndex(value => value.id === seriesYAxis);
            return {
                id: key,
                type: isArea ? 'line' : seriesType,
                data: series[key].data,
                areaStyle: isArea ? {} : null,
                xAxisIndex: xAxisIndex >= 0 ? xAxisIndex : 0,
                yAxisIndex: yAxisIndex >= 0 ? yAxisIndex : 0,
                ...other,
            };
        });
        return {
            xAxis: xAxisOption,
            yAxis: yAxisOption,
            grid: gridOption,
            series: seriesOption,
        };
    }

    render() {
        console.log(this.getOption());
        return (
            <ReactEcharts
                ref={c => { this.chartRef = c; }}
                option={this.getOption()}
                style={{ height: '100%', width: '100%' }}
            />
        );
    }
}

export default ChartPanel;
