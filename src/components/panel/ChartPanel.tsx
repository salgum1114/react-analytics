import React, { Component, ErrorInfo } from 'react';
import ReactEcharts from 'echarts-for-react';

import Panel from './Panel';
import { StructureContext, IStructureContext } from '../../containers/StructureContainer';

class ChartPanel extends Component {
    private chartRef: any;
    private echarts: echarts.ECharts;
    static contextType = StructureContext;
    context: IStructureContext;

    componentDidMount() {
        this.echarts = this.chartRef.getEchartsInstance();
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.log(error, errorInfo);
    }

    getOption = () => {
        const { series, xAxis, yAxis } = this.context;
        const xAxisOption = Object.keys(xAxis).map(key => {
            return {
                id: key,
                ...xAxis[key],
            };
        });
        const yAxisOption = Object.keys(yAxis).map(key => {
            return {
                id: key,
                ...yAxis[key],
            };
        });
        return {
            xAxis: xAxisOption,
            yAxis: yAxisOption,
            series: Object.keys(series).map(key => {
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
            }),
        };
    }

    render() {
        return (
            <Panel>
                <ReactEcharts
                    ref={c => { this.chartRef = c; }}
                    notMerge={true}
                    option={this.getOption()}
                    style={{ height: '100%', width: '100%' }}
                />
            </Panel>
        );
    }
}

export default ChartPanel;
