import React, { useState, useRef, useEffect } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import { Table } from 'antd';
import classnames from 'classnames';
import { TableProps } from 'antd/lib/table';
import ResizeObserver from 'rc-resize-observer';
import Scrollbars from 'react-custom-scrollbars';

export type VirtualizedTableProps<T = any> = TableProps<T> & {
	headerHeight?: number;
};

const CustomScrollbars = React.forwardRef((props, ref) => {
	return <Scrollbars ref={ref} {...props} autoHide={true} />;
});

const VirtualizedTable: React.FC<VirtualizedTableProps> = props => {
	const { className, columns, headerHeight = 55 } = props;
	const gridRef = useRef<any>();
	const [tableWidth, setTableWidth] = useState(0);
	const [tableHeight, setTableHeight] = useState(0);
	const [connectObject] = useState<any>(() => {
		const obj = {};
		Object.defineProperty(obj, 'scrollLeft', {
			get: () => null,
			set: (scrollLeft: number) => {
				if (gridRef.current) {
					gridRef.current.scrollTo({ scrollLeft });
				}
			},
		});

		return obj;
	});
	useEffect(() => resetVirtualGrid, []);
	useEffect(() => resetVirtualGrid, [tableWidth]);
	const resetVirtualGrid = () => {
		gridRef.current.resetAfterIndices({
			columnIndex: 0,
			shouldForceUpdate: false,
		});
	};
	const widthColumnCount = columns.filter(({ width }) => !width).length;
	const mergedColumns = columns.map(column => {
		if (column.width) {
			return column;
		}
		return {
			...column,
			width: Math.floor(tableWidth / widthColumnCount),
		};
	});
	const handleResize = (size: { width: number; height: number }) => {
		setTableHeight(size.height);
		setTableWidth(size.width);
	};
	const renderVirtualGrid = (rawData: object[], { scrollbarSize, ref, onScroll }: any) => {
		ref.current = connectObject;
		return (
			<Grid
				ref={gridRef}
				className="virtual-grid"
				style={{ overflow: 'hidden' }}
				columnCount={mergedColumns.length}
				columnWidth={index => {
					const { width } = mergedColumns[index];
					return index === mergedColumns.length - 1
						? (width as number) - scrollbarSize - 1
						: (width as number);
				}}
				height={tableHeight - headerHeight}
				rowCount={rawData.length}
				rowHeight={() => 54}
				width={tableWidth}
				outerElementType={CustomScrollbars}
				onScroll={({ scrollLeft }) => {
					onScroll({ scrollLeft });
				}}
			>
				{({ columnIndex, rowIndex, style }) => (
					<div
						className={classnames('virtual-table-cell', {
							'virtual-table-cell-last': columnIndex === mergedColumns.length - 1,
						})}
						style={style}
					>
						{rawData[rowIndex][mergedColumns[columnIndex].dataIndex]}
					</div>
				)}
			</Grid>
		);
	};
	return (
		<ResizeObserver onResize={handleResize}>
			<div style={{ width: '100%', height: '100%' }}>
				<Table
					{...props}
					className={classnames(className, 'virtual-table')}
					columns={mergedColumns}
					style={{ height: tableHeight, width: tableWidth }}
					scroll={{ y: tableHeight - headerHeight }}
					pagination={false}
					components={{
						body: renderVirtualGrid,
					}}
				/>
			</div>
		</ResizeObserver>
	);
};

export default VirtualizedTable;
