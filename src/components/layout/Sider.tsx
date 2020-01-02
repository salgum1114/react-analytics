import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import i18next from 'i18next';
import { SelectParam } from 'antd/lib/menu';

interface IProps {
    onSelect?: (params: SelectParam) => void;
}

class Sider extends Component<IProps> {
    render() {
        const { onSelect } = this.props;
        return (
            <Layout.Sider theme="light">
                <Menu
                    onSelect={onSelect}
                    defaultSelectedKeys={['structure:series']}
                    defaultOpenKeys={['structure', 'style']}
                    theme="light"
                    mode="inline"
                >
                    <Menu.SubMenu key="structure" title={i18next.t('common.structure')}>
                        <Menu.Item key="structure:series">
                            {i18next.t('widget.series.title')}
                        </Menu.Item>
                        <Menu.Item key="structure:xAxis">
                            {i18next.t('widget.xaxis.title')}
                        </Menu.Item>
                        <Menu.Item key="structure:yAxis">
                            {i18next.t('widget.yaxis.title')}
                        </Menu.Item>
                        <Menu.Item key="structure:grid">
                            {i18next.t('widget.grid.title')}
                        </Menu.Item>
                        <Menu.Item key="structure:tooltip">
                            {i18next.t('widget.tooltip.title')}
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key="style" title={i18next.t('common.style')}>
                        <Menu.Item key="style:series">
                            {i18next.t('widget.series.title')}
                        </Menu.Item>
                        <Menu.Item key="style:xAxis">
                            {i18next.t('widget.xaxis.title')}
                        </Menu.Item>
                        <Menu.Item key="style:yAxis">
                            {i18next.t('widget.yaxis.title')}
                        </Menu.Item>
                        <Menu.Item key="style:grid">
                            {i18next.t('widget.grid.title')}
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key="animation" title={i18next.t('widget.animation.title')}>
                        <Menu.Item key="animation:series">
                            {i18next.t('widget.series.title')}
                        </Menu.Item>
                    </Menu.SubMenu>
                </Menu>
            </Layout.Sider>
        );
    }
}

export default Sider;
