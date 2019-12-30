import React, { Component } from 'react';
import { Button } from 'antd';
import i18next from 'i18next';
import uuid from 'uuid';

import Panel from './Panel';
import { DynamicForm } from '../form';
import { StructureContext, IStructureContext } from '../../containers/StructureContainer';

interface IState {
    xAxis: { [key: string]: any };
    activeKey: string[];
    collapsed: boolean;
}

class XAxisPanel extends Component<{}, IState> {
    static contextType = StructureContext;
    context: IStructureContext;

    constructor(props: {}, context: IStructureContext) {
        super(props, context);
        this.state = {
            xAxis: context.xAxis,
            activeKey: context.xAxisActiveKey,
            collapsed: false,
        }
    }

    handleChangeXAxis = (xAxis: { [key: string]: any }) => {
        this.setState({
            xAxis: Object.assign({}, xAxis),
        }, () => {
            this.context.onChangeXAxis(this.state.xAxis);
        });
    }

    handleChangeActiveKey = (activeKey: string[]) => {
        this.setState({
            activeKey,
        });
        this.context.onChangeXAxisActiveKey(activeKey);
    }

    handleAddXAxis = () => {
        const id = uuid();
        this.setState({
            xAxis: Object.assign({}, this.state.xAxis, {
                [id]: {
                    type: 'category',
                    show: true,
                },
            }),
            activeKey: this.state.activeKey.concat(id),
        }, () => {
            this.context.onChangeXAxis(this.state.xAxis);
        });
    }

    handleCollapse = () => {
        const collapsed = !this.state.collapsed;
        const activeKey = collapsed ? [] : Object.keys(this.state.xAxis);
        this.setState({
            collapsed,
            activeKey,
        });
        this.context.onChangeXAxisActiveKey(activeKey);
    }

    render() {
        const { xAxis, xAxisActiveKey } = this.context;
        const { collapsed } = this.state;
        return (
            <Panel>
                <div className="editor-property">
                    <div className="editor-property-header">
                        <Button icon={collapsed ? 'arrows-alt' : 'shrink'} onClick={this.handleCollapse}>{collapsed ? i18next.t('action.expand') : i18next.t('action.collapse')}</Button>
                        <Button type="primary" icon="plus" onClick={this.handleAddXAxis}>{i18next.t('widget.xaxis.title')}</Button>
                    </div>
                    <div className="editor-property-content">
                        <DynamicForm
                            value={xAxis}
                            label={i18next.t('widget.xaxis.title')}
                            addButton={false}
                            activeKey={xAxisActiveKey}
                            formSchema={{
                                type: {
                                    label: i18next.t('common.type'),
                                    type: 'select',
                                    initialValue: 'category',
                                    style: { width: '100%' },
                                    items: [
                                        {
                                            label: i18next.t('common.value'),
                                            value: 'value',
                                        },
                                        {
                                            label: i18next.t('common.time'),
                                            value: 'time',
                                        },
                                        {
                                            label: i18next.t('common.category'),
                                            value: 'category',
                                        },
                                        {
                                            label: i18next.t('common.log'),
                                            value: 'log',
                                        },
                                    ],
                                },
                                show: {
                                    label: i18next.t('common.visible'),
                                    type: 'boolean',
                                    initialValue: true,
                                    span: 12,
                                },
                                inverse: {
                                    label: i18next.t('common.inverse'),
                                    type: 'boolean',
                                    initialValue: false,
                                    span: 12,
                                },
                                name: {
                                    label: i18next.t('common.name'),
                                },
                            }}
                            onChange={this.handleChangeXAxis}
                            onChangeActiveKey={this.handleChangeActiveKey}
                        />
                    </div>
                </div>
            </Panel>
        );
    }
}

export default XAxisPanel;
