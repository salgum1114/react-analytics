import React, { Component } from 'react';

import { SeriesPanel, GridPanel, XAxisPanel, YAxisPanel } from './style';

const panels: Record<string, any> = {
    series: SeriesPanel,
    grid: GridPanel,
    xAxis: XAxisPanel,
    yAxis: YAxisPanel,
}

interface IProps {
    panelKey: string;
}

class StylePanel extends Component<IProps> {
    render() {
        const { panelKey } = this.props;
        const PanelComponent = panels[panelKey];
        return <PanelComponent />;
    }
}

export default StylePanel;
