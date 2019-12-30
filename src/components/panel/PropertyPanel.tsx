import React, { Component } from 'react';

import Panel from './Panel';
import XAxisPanel from './XAxisPanel';
import YAxisPanel from './YAxisPanel';
import SeriesPanel from './SeriesPanel';

const panels: { [key: string]: any } = {
    xaxis: XAxisPanel,
    yaxis: YAxisPanel,
    series: SeriesPanel,
}

interface IProps {
    panelKey: string;
}

class PropertyPanel extends Component<IProps> {
    render() {
        const { panelKey } = this.props;
        const PanelComponent = panels[panelKey];
        return (
            <Panel>
                <PanelComponent />
            </Panel>
        )
    }
}

export default PropertyPanel;
