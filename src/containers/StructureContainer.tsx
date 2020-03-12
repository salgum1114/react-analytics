import React, { useState } from 'react';
import uuid from 'uuid';
import StyleContainer from './StyleContainer';

export interface IStructureContext {
	series: any;
	seriesActiveKey: string[];
	onChangeSeries: (series: any) => void;
	onChangeSeriesActiveKey: (activeKey: string[]) => void;
	xAxis: any;
	xAxisActiveKey: string[];
	onChangeXAxis: (xAxis: any) => void;
	onChangeXAxisActiveKey: (activeKey: string[]) => void;
	yAxis: any;
	yAxisActiveKey: string[];
	onChangeYAxis: (yAxis: any) => void;
	onChangeYAxisActiveKey: (activeKey: string[]) => void;
	grid: any;
	gridActiveKey: string[];
	onChangeGrid: (grid: any) => void;
	onChangeGridActiveKey: (activeKey: string[]) => void;
	tooltip: any;
	onChangeTooltip: (tooltip: any) => void;
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
	const [xAxis, setXAxis] = useState({
		[uuid()]: {
			type: 'category',
			show: true,
		},
	});
	const [yAxis, setYAxis] = useState({
		[uuid()]: {
			type: 'value',
			show: true,
		},
	});
	const [grid, setGrid] = useState({
		[uuid()]: {
			show: false,
		},
	});
	const [tooltip, setTooltip] = useState<echarts.EChartOption.Tooltip>({
		show: true,
		showContent: true,
		alwaysShowContent: true,
		trigger: 'item',
		triggerOn: 'mousemove|click',
		showDelay: 0,
		hideDelay: 100,
		transitionDuration: 0.4,
		enterable: true,
		confine: false,
		renderMode: 'html',
		axisPointer: {
			show: true,
		},
	});
	const [xAxisActiveKey, setXAxisActiveKey] = useState([]);
	const [seriesActiveKey, setSeriesActiveKey] = useState([]);
	const [yAxisActiveKey, setYAxisActiveKey] = useState([]);
	const [gridActiveKey, setGridActiveKey] = useState([]);
	const handleChangeSeries = (series: any) => {
		setSeries(series);
	};
	const handleChangeXAxis = (xAxis: any) => {
		setXAxis(xAxis);
	};
	const handleChangeYAxis = (yAxis: any) => {
		setYAxis(yAxis);
	};
	const handleChangeGrid = (grid: any) => {
		setGrid(grid);
	};
	const handleChangeTooltip = (tooltip: any) => {
		setTooltip(tooltip);
	};
	const handleChangeSeriesActiveKey = (activeKey: string[]) => {
		setSeriesActiveKey(activeKey);
	};
	const handleChangeXAxisActiveKey = (activeKey: string[]) => {
		setXAxisActiveKey(activeKey);
	};
	const handleChangeYAxisActiveKey = (activeKey: string[]) => {
		setYAxisActiveKey(activeKey);
	};
	const handleChangeGridActiveKey = (activeKey: string[]) => {
		setGridActiveKey(activeKey);
	};
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
				grid,
				gridActiveKey,
				onChangeGrid: handleChangeGrid,
				onChangeGridActiveKey: handleChangeGridActiveKey,
				tooltip,
				onChangeTooltip: handleChangeTooltip,
			}}
		>
			<StyleContainer>{children}</StyleContainer>
		</StructureContext.Provider>
	);
};

export default StructureContainer;
