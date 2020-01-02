import React, { useState, useEffect, useContext } from 'react';
import { StructureContext } from './StructureContainer';

export interface IStyleContext {
    series: any;
    seriesActiveKey: string[];
    onChangeSeries: (series: any) => void;
    onChangeSeriesActiveKey: (activeKey: string[]) => void;
    grid: any;
    gridActiveKey: string[];
    onChangeGrid: (grid: any) => void;
    onChangeGridActiveKey: (activeKey: string[]) => void;
    xAxis: any;
    xAxisActiveKey: string[];
    onChangeXAxis: (xAxis: any) => void;
    onChangeXAxisActiveKey: (activeKey: string[]) => void;
    yAxis: any;
    yAxisActiveKey: string[];
    onChangeYAxis: (yAxis: any) => void;
    onChangeYAxisActiveKey: (activeKey: string[]) => void;
}

export const StyleContext = React.createContext<IStyleContext>(null);

const StyleContainer: React.SFC = props => {
    const { children } = props;
    const structrue = useContext(StructureContext);
    const [series, setSeries] = useState(Object.keys(structrue.series).reduce((prev, curr) => {
        return Object.assign(prev, { [curr]: {} });
    }, {}));
    const [xAxis, setXAxis] = useState(Object.keys(structrue.xAxis).reduce((prev, curr) => {
        return Object.assign(prev, { [curr]: {} });
    }, {}));
    const [yAxis, setYAxis] = useState(Object.keys(structrue.yAxis).reduce((prev, curr) => {
        return Object.assign(prev, { [curr]: {} });
    }, {}));
    const [grid, setGrid] = useState(Object.keys(structrue.grid).reduce((prev, curr) => {
        return Object.assign(prev, { [curr]: {} });
    }, {} as Record<string, any>));
    const [xAxisActiveKey, setXAxisActiveKey] = useState([]);
    const [seriesActiveKey, setSeriesActiveKey] = useState([]);
    const [yAxisActiveKey, setYAxisActiveKey] = useState([]);
    const [gridActiveKey, setGridActiveKey] = useState([]);
    const handleChangeSeries = (series: any) => {
        setSeries(series);
    }
    const handleChangeXAxis = (xAxis: any) => {
        setXAxis(xAxis);
    }
    const handleChangeYAxis = (yAxis: any) => {
        setYAxis(yAxis);
    }
    const handleChangeGrid = (grid: any) => {
        setGrid(grid);
    }
    const handleChangeSeriesActiveKey = (activeKey: string[]) => {
        setSeriesActiveKey(activeKey);
    }
    const handleChangeXAxisActiveKey = (activeKey: string[]) => {
        setXAxisActiveKey(activeKey);
    }
    const handleChangeYAxisActiveKey = (activeKey: string[]) => {
        setYAxisActiveKey(activeKey);
    }
    const handleChangeGridActiveKey = (activeKey: string[]) => {
        setGridActiveKey(activeKey);
    }
    useEffect(() => {
        console.log('structureSeries updated');
    }, [structrue.series]);
    useEffect(() => {
        console.log('structureXAxis updated');
    }, [structrue.xAxis]);
    useEffect(() => {
        console.log('structureYAxis updated');
    }, [structrue.yAxis]);
    useEffect(() => {
        console.log('structureGrid updated');
        setGrid(Object.keys(structrue.grid).reduce((prev, curr) => {
            return Object.assign(prev, { [curr]: grid[curr] });
        }, {}));
    }, [structrue.grid]);
    return (
        <StyleContext.Provider
            value={{
                series,
                seriesActiveKey,
                onChangeSeries: handleChangeSeries,
                onChangeSeriesActiveKey: handleChangeSeriesActiveKey,
                xAxis,
                xAxisActiveKey,
                onChangeXAxis: handleChangeXAxis,
                onChangeXAxisActiveKey: handleChangeXAxisActiveKey,
                yAxis,
                yAxisActiveKey,
                onChangeYAxis: handleChangeYAxis,
                onChangeYAxisActiveKey: handleChangeYAxisActiveKey,
                grid,
                gridActiveKey,
                onChangeGrid: handleChangeGrid,
                onChangeGridActiveKey: handleChangeGridActiveKey,
            }}
        >
            {children}
        </StyleContext.Provider>
    );
}

export default StyleContainer;
