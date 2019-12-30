import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
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
                <Menu onSelect={onSelect} defaultSelectedKeys={['series']} defaultOpenKeys={['structure']} theme="light" mode="inline">
                    <Menu.SubMenu key="structure" title={'구조'}>
                        <Menu.Item key="series">
                            시리즈
                        </Menu.Item>
                        <Menu.Item key="xaxis">
                            X 축
                        </Menu.Item>
                        <Menu.Item key="yaxis">
                            Y 축
                        </Menu.Item>
                    </Menu.SubMenu>
                    {/* <Menu.SubMenu key="style" title={'스타일'}>
                        <Menu.Item>
                            시리즈
                        </Menu.Item>
                        <Menu.Item>
                            축
                        </Menu.Item>
                    </Menu.SubMenu> */}
                </Menu>
            </Layout.Sider>
        );
    }
}

export default Sider;
