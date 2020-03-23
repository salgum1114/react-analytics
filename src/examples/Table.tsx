import React, { useState, useEffect } from 'react';
import { VirtualizedTable } from '../components/virtualized';
import { Button } from 'antd';

const Table = () => {
	const [data, setDatas] = useState([]);
	const columns = [
		{ title: 'A', dataIndex: 'key' },
		{ title: 'B', dataIndex: 'key' },
		{ title: 'C', dataIndex: 'key' },
		{ title: 'D', dataIndex: 'key', width: 200 },
		{ title: 'E', dataIndex: 'key', width: 200 },
		{ title: 'F', dataIndex: 'key', width: 200 },
	];
	for (let i = 0; i < 100; i += 1) {
		data.push({
			key: i,
		});
	}
	// setDatas(datas);
	useEffect(() => {
		setTimeout(() => {
			for (let i = 0; i < 100; i += 1) {
				data.push({
					key: i,
				});
			}
			setDatas(data.concat(data));
		}, 5000);
	}, []);
	return (
		<div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
			<div style={{ display: 'flex', flex: 1, backgroundColor: 'red' }}>
				<div style={{ flex: 1, backgroundColor: 'yellow' }}>test</div>
				<div style={{ flex: 1 }}>
					<VirtualizedTable columns={columns} dataSource={data} />
				</div>
			</div>
		</div>
	);
};

export default Table;
