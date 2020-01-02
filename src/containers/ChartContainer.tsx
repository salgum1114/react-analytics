import React, { useContext } from 'react';
import { IStyleContext, StyleContext } from './StyleContainer';
import { IStructureContext, StructureContext } from './StructureContainer';

export interface IChartContext {
    structure: IStructureContext;
    style: IStyleContext;
}

export const ChartContext = React.createContext<IChartContext>(null);

const ChartContainer: React.SFC = props => {
    const { children } = props;
    const structure = useContext(StructureContext);
    const style = useContext(StyleContext);
    return (
        <ChartContext.Provider
            value={{
                structure,
                style,
            }}
        >
            {children}
        </ChartContext.Provider>
    );
}

export default ChartContainer;
