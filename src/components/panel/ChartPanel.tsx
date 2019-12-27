import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

import Panel from './Panel';

class ChartPanel extends Component {
    render() {
        return (
            <Panel>
                <ReactEcharts
                    option={{
                        xAxis: {
                            type: 'category',
                            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        },
                        yAxis: {
                            type: 'value',
                        },
                        series: [{
                            data: [820, 932, 901, 934, 1290, 1330, 1320],
                            type: 'line',
                        }],
                    }}
                    style={{ height: '100%', width: '100%' }}
                />
            </Panel>
        );
    }
}

export default ChartPanel;
