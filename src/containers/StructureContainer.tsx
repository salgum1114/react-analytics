import React, { useState } from 'react';
import uuid from 'uuid';

export interface IStructureContext {
    series: any;
    seriesActiveKey: string[];
    onChangeSeries: (series: any) => void;
    onChangeSeriesActiveKey: (activeKey: string[]) => void;
    xAxis: any;
    xAxisActiveKey: string[]
    onChangeXAxis: (xAxis: any) => void;
    onChangeXAxisActiveKey: (activeKey: string[]) => void;
    yAxis: any;
    yAxisActiveKey: string[];
    onChangeYAxis: (yAxis: any) => void;
    onChangeYAxisActiveKey: (activeKey: string[]) => void;
}

export const StructureContext = React.createContext<IStructureContext>(null);

const StructureContainer: React.SFC = props => {
    const { children } = props;
    const [series, setSeries] = useState({
        [uuid()]: {
            type: 'line',
            data: Array.from({ length: 12 }, () => Math.random() * 1000 + 100),
        },
    });
    const [seriesActiveKey, setSeriesActiveKey] = useState([]);
    const [xAxis, setXAxis] = useState({
        [uuid()]: {
            type: 'category',
        },
    });
    const [xAxisActiveKey, setXAxisActiveKey] = useState([]);
    const [yAxis, setYAxis] = useState({
        [uuid()]: {
            type: 'value',
        },
    });
    const [yAxisActiveKey, setYAxisActiveKey] = useState([]);
    const handleChangeSeries = (series: any) => {
        setSeries(series);
    }
    const handleChangeSeriesActiveKey = (activeKey: string[]) => {
        setSeriesActiveKey(activeKey);
    }
    const handleChangeXAxis = (xAxis: any) => {
        setXAxis(xAxis);
    }
    const handleChangeXAxisActiveKey = (activeKey: string[]) => {
        setXAxisActiveKey(activeKey);
    }
    const handleChangeYAxis = (yAxis: any) => {
        setYAxis(yAxis);
    }
    const handleChangeYAxisActiveKey = (activeKey: string[]) => {
        setYAxisActiveKey(activeKey);
    }
    return (
        <StructureContext.Provider
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
            }}
        >
            {children}
        </StructureContext.Provider>
    );
}

export default StructureContainer;
