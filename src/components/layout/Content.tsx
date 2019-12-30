import React, { Component } from 'react';
import { Layout } from 'antd';
import Split from 'react-split';

import { DataGridPanel, ChartPanel, PropertyPanel } from '../panel';

interface IProps {
    panelKey: string;
}

class Content extends Component<IProps> {
    render() {
        const { panelKey } = this.props;
        return (
            <Layout.Content style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Split
                    style={{ height: '100%', width: '100%', display: 'flex', overflow: 'hidden' }}
                    direction="horizontal"
                    sizes={[25, 75]}
                    minSize={[260, 700]}
                >
                    <PropertyPanel panelKey={panelKey} />
                    <Split
                        style={{ overflow: 'hidden' }}
                        direction="vertical"
                        cursor="row-resize"
                        sizes={[25, 75]}
                        minSize={[260, 500]}
                    >
                        <DataGridPanel />
                        <ChartPanel />
                    </Split>
                </Split>
            </Layout.Content>
        );
    }
}

export default Content;
