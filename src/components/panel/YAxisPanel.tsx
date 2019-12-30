import React, { Component } from 'react';
import { Button } from 'antd';
import i18next from 'i18next';
import uuid from 'uuid';

import Panel from './Panel';
import { DynamicForm } from '../form';
import { StructureContext, IStructureContext } from '../../containers/StructureContainer';

interface IState {
    yAxis: { [key: string]: any };
    activeKey: string[];
    collapsed: boolean;
}

class YAxisPanel extends Component<{}, IState> {
    static contextType = StructureContext;
    context: IStructureContext;

    constructor(props: {}, context: IStructureContext) {
        super(props, context);
        this.state = {
            yAxis: context.yAxis,
            activeKey: context.yAxisActiveKey,
            collapsed: false,
        }
    }

    handleChangeYAxis = (yAxis: { [key: string]: any }) => {
        this.setState({
            yAxis: Object.assign({}, yAxis),
        }, () => {
            this.context.onChangeYAxis(this.state.yAxis);
        });
    }

    handleChangeActiveKey = (activeKey: string[]) => {
        this.setState({
            activeKey,
        });
        this.context.onChangeYAxisActiveKey(activeKey);
    }

    handleAddYAxis = () => {
        const id = uuid();
        this.setState({
            yAxis: Object.assign({}, this.state.yAxis, {
                [id]: {
                    type: 'value',
                    show: true,
                },
            }),
            activeKey: this.state.activeKey.concat(id),
        }, () => {
            this.context.onChangeYAxis(this.state.yAxis);
        });
    }

    handleCollapse = () => {
        const collapsed = !this.state.collapsed;
        const activeKey = collapsed ? [] : Object.keys(this.state.yAxis);
        this.setState({
            collapsed,
            activeKey,
        });
        this.context.onChangeYAxisActiveKey(activeKey);
    }

    render() {
        const { yAxis, yAxisActiveKey } = this.context;
        const { collapsed } = this.state;
        return (
            <Panel>
                <div className="editor-property">
                    <div className="editor-property-header">
                        <Button icon={collapsed ? 'arrows-alt' : 'shrink'} onClick={this.handleCollapse}>{collapsed ? i18next.t('action.expand') : i18next.t('action.collapse')}</Button>
                        <Button type="primary" icon="plus" onClick={this.handleAddYAxis}>{i18next.t('widget.yaxis.title')}</Button>
                    </div>
                    <div className="editor-property-content">
                        <DynamicForm
                            value={yAxis}
                            label={i18next.t('widget.yaxis.title')}
                            addButton={false}
                            activeKey={yAxisActiveKey}
                            formSchema={{
                                type: {
                                    label: i18next.t('common.type'),
                                    type: 'select',
                                    initialValue: 'value',
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
                            onChange={this.handleChangeYAxis}
                            onChangeActiveKey={this.handleChangeActiveKey}
                        />
                    </div>
                </div>
            </Panel>
        );
    }
}

export default YAxisPanel;
