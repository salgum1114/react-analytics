import React, { Component, ErrorInfo } from 'react';
import { Layout } from 'antd';

import { i18nClient } from '../../i18n';

import { Sider, Content } from '../layout';

import '../../styles/index.less';
import StructureContainer from '../../containers/StructureContainer';
import { SelectParam } from 'antd/lib/menu';
import { ErrorBoundary } from '../error';

i18nClient();

interface IState {
    panelKey: string;
}

class Editor extends Component<{}, IState> {
    state: IState = {
        panelKey: 'structure:series',
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
            <ErrorBoundary>
                <StructureContainer>
                    <Layout className="editor-container">
                        <Sider onSelect={this.handleSelectMenu} />
                        <Layout>
                            <Content panelKey={panelKey} />
                        </Layout>
                    </Layout>
                </StructureContainer>
            </ErrorBoundary>
        );
    }
}

export default Editor;
