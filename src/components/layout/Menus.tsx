import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import i18next from 'i18next';
import { useHistory } from 'react-router';

const Menus = () => {
    const history = useHistory();
    return (
        <Layout.Sider collapsed={true}>
            <Menu theme="light">
                <Menu.Item onClick={() => history.push('/')}>
                    <Icon type="dashboard" />
                    <span>{i18next.t('dashboard.dashboard')}</span>
                </Menu.Item>
                <Menu.Item onClick={() => history.push('/psychrometrics')}>
                    <Icon type="line-chart" />
                    <span>{i18next.t('dashboard.dashboard')}</span>
                </Menu.Item>
            </Menu>
        </Layout.Sider>
    );
};

export default Menus;
