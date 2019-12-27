import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';

class Sider extends Component {
    render() {
        return (
            <Layout.Sider collapsed={true} trigger={null}>
                <Menu theme="dark">
                    <Menu.Item title={null}>
                        <Icon type="heart" />
                        <span>test</span>
                    </Menu.Item>
                </Menu>
            </Layout.Sider>
        );
    }
}

export default Sider;
