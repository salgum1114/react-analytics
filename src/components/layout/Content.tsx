import React, { Component } from 'react';
import { Layout } from 'antd';
import Split from 'react-split';

import { DataGridPanel, ChartPanel, StructurePanel, StylePanel, Panel } from '../panel';
import ChartContainer from '../../containers/ChartContainer';

const panels: Record<string, any> = {
    structure: StructurePanel,
    style: StylePanel,
}

interface IProps {
    panelKey: string;
}

class Content extends Component<IProps> {
    render() {
        const { panelKey } = this.props;
        const [mainKey, subKey] = panelKey.split(':');
        const PanelComponent = panels[mainKey];
        return (
            <Layout.Content style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Split
                    style={{ height: '100%', width: '100%', display: 'flex', overflow: 'hidden' }}
                    direction="horizontal"
                    sizes={[25, 75]}
                    minSize={[260, 700]}
                >
                    <Panel>
                        <PanelComponent key={panelKey} panelKey={subKey} />
                    </Panel>
                    <Split
                        style={{ overflow: 'hidden' }}
                        direction="vertical"
                        cursor="row-resize"
                        sizes={[25, 75]}
                        minSize={[260, 500]}
                    >
                        <Panel>
                            <DataGridPanel />
                        </Panel>
                        <Panel>
                            <ChartContainer>
                                <ChartPanel />
                            </ChartContainer>
                        </Panel>
                    </Split>
                </Split>
            </Layout.Content>
        );
    }
}

export default Content;
