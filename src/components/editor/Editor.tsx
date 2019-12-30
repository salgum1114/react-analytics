import React, { Component } from 'react';
import { Layout } from 'antd';

import { Sider, Content } from '../layout';

import '../../styles/index.less';
import StructureContainer from '../../containers/StructureContainer';
import { SelectParam } from 'antd/lib/menu';

interface IState {
    panelKey: string;
}

class Editor extends Component<{}, IState> {
    state: IState = {
        panelKey: 'series',
    }

    handleSelectMenu = (param: SelectParam) => {
        const { key } = param;
        this.setState({
            panelKey: key,
        });
    }

    render() {
        const { panelKey } = this.state;
        return (
            <StructureContainer>
                <Layout className="editor-container">
                    <Sider onSelect={this.handleSelectMenu} />
                    <Layout>
                        <Content panelKey={panelKey} />
                    </Layout>
                </Layout>
            </StructureContainer>
        );
    }
}

export default Editor;
