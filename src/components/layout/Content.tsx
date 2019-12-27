import React, { Component } from 'react';
import { Layout } from 'antd';
import Split from 'react-split';

import { DataGridPanel, ChartPanel, SidePanel } from '../panel';

class Content extends Component {
    render() {
        return (
            <Layout.Content style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Split
                    style={{ height: '100%', width: '100%', display: 'flex', overflow: 'hidden' }}
                    direction="horizontal"
                    sizes={[25, 75]}
                    minSize={[260, 700]}
                >
                    <SidePanel />
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
