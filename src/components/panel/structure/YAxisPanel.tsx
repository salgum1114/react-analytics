import React, { Component } from 'react';
import { Button } from 'antd';
import i18next from 'i18next';
import uuid from 'uuid';

import { DynamicForm } from '../../form';
import { StructureContext, IStructureContext } from '../../../containers/StructureContainer';

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
        const { yAxis, yAxisActiveKey, grid } = this.context;
        const { collapsed } = this.state;
        return (
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
                                        forms: {
                                            logBase: {
                                                label: i18next.t('widget.log-base'),
                                                type: 'number',
                                                initialValue: 10,
                                                min: 10,
                                            },
                                        },
                                    },
                                ],
                            },
                            grid: {
                                label: i18next.t('widget.grid.title'),
                                type: 'select',
                                style: { width: '100%' },
                                items: Object.keys(grid).map((key, index) => {
                                    const { name } = grid[key];
                                    return {
                                        label: name && name.length ? name : `grid${index}`,
                                        value: key,
                                    };
                                }),
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
                            scale: {
                                label: i18next.t('widget.scale'),
                                type: 'boolean',
                                initialValue: false,
                                span: 12,
                            },
                            silent: {
                                label: i18next.t('widget.silent'),
                                type: 'boolean',
                                initialValue: false,
                                span: 12,
                            },
                            name: {
                                label: i18next.t('common.name'),
                            },
                            interval: {
                                label: i18next.t('widget.interval'),
                                type: 'number',
                                span: 8,
                                min: 0,
                            },
                            minInterval: {
                                label: i18next.t('widget.min-interval'),
                                type: 'number',
                                span: 8,
                                initialValue: 0,
                                min: 0,
                            },
                            maxInterval: {
                                label: i18next.t('widget.max-interval'),
                                type: 'number',
                                span: 8,
                                min: 0,
                            },
                            splitNumber: {
                                label: i18next.t('widget.split-number'),
                                type: 'number',
                                initialValue: 5,
                                span: 8,
                                min: 0,
                            },
                            min: {
                                label: i18next.t('common.min'),
                                type: 'number',
                                initialValue: null,
                                span: 8,
                            },
                            max: {
                                label: i18next.t('common.max'),
                                type: 'number',
                                initialValue: null,
                                span: 8,
                            },
                            boundaryGap: {
                                label: i18next.t('widget.boundary-gap'),
                                type: 'boolean',
                                initialValue: true,
                                span: 12,
                            },
                            zLevel: {
                                label: i18next.t('widget.z-level'),
                                type: 'number',
                                initialValue: 0,
                                min: 0,
                                max: 1000,
                                span: 12,
                            },
                        }}
                        onChange={this.handleChangeYAxis}
                        onChangeActiveKey={this.handleChangeActiveKey}
                    />
                </div>
            </div>
        );
    }
}

export default YAxisPanel;
