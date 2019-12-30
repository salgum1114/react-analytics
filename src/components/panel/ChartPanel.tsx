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

    render() {
        const { series, xAxis, yAxis } = this.context;
        const xAxisOption = Object.keys(xAxis).map(key => {
            const {
                type = 'category',
                show = true,
            } = xAxis[key];
            return {
                id: key,
                type,
                show,
            };
        });
        const yAxisOption = Object.keys(yAxis).map(key => {
            const {
                type = 'value',
                show = true,
            } = yAxis[key];
            return {
                id: key,
                type,
                show,
            };
        });
        return (
            <Panel>
                <ReactEcharts
                    ref={c => { this.chartRef = c; }}
                    notMerge={true}
                    option={{
                        xAxis: xAxisOption,
                        yAxis: yAxisOption,
                        series: Object.keys(series).map(key => {
                            const {
                                type: seriesType,
                                xAxis: seriesXAxis,
                                yAxis: seriesYAxis,
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
                            };
                        }),
                    }}
                    style={{ height: '100%', width: '100%' }}
                />
            </Panel>
        );
    }
}

export default ChartPanel;
