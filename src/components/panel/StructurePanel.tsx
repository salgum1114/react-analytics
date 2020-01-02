import React, { Component } from 'react';

import { XAxisPanel, YAxisPanel, SeriesPanel, GridPanel, TooltipPanel } from './structure';

const panels: { [key: string]: any } = {
    series: SeriesPanel,
    xAxis: XAxisPanel,
    yAxis: YAxisPanel,
    grid: GridPanel,
    tooltip: TooltipPanel,
}

interface IProps {
    panelKey: string;
}

class StructurePanel extends Component<IProps> {
    render() {
        const { panelKey } = this.props;
        const PanelComponent = panels[panelKey];
        return <PanelComponent />;
    }
}

export default StructurePanel;
