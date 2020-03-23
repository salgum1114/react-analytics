import React from 'react';
import { TableOutlined, LineChartOutlined, DashboardOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import i18next from 'i18next';
import { useHistory } from 'react-router';

const Menus = () => {
	const history = useHistory();
	return (
		<Layout.Sider collapsed={true}>
			<Menu theme="light">
				<Menu.Item onClick={() => history.push('/')}>
					<DashboardOutlined />
					<span>{i18next.t('dashboard.dashboard')}</span>
				</Menu.Item>
				<Menu.Item onClick={() => history.push('/psychrometrics/kelvin')}>
					<LineChartOutlined />
					<span>{i18next.t('dashboard.dashboard')}</span>
				</Menu.Item>
				<Menu.Item onClick={() => history.push('/table')}>
					<TableOutlined />
					<span>{i18next.t('dashboard.dashboard')}</span>
				</Menu.Item>
			</Menu>
		</Layout.Sider>
	);
};

export default Menus;
