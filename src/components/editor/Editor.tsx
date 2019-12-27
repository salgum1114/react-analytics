import React, { Component } from 'react';
import { Layout } from 'antd';

import { Sider, Content } from '../layout';

import '../../styles/index.less';

class Editor extends Component {
    render() {
        return (
            <Layout className="editor-container">
                <Sider />
                <Layout>
                    <Content />
                </Layout>
            </Layout>
        );
    }
}

export default Editor;
