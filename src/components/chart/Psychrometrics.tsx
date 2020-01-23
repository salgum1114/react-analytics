import React from 'react';
import ReactEcharts from 'echarts-for-react';

const Psychrometrics = () => {
    const getOption = (): echarts.EChartOption => {
        return {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line',
                    areaStyle: {},
                },
            ],
        };
    }
    return (
        <ReactEcharts
            option={getOption()}
            style={{ height: '100%', width: '100%' }}
        />
    );
};

export default Psychrometrics;
