import React, { Component } from 'react';
import { Button } from 'antd';
import i18next from 'i18next';
import uuid from 'uuid';

import { DynamicForm } from '../../form';
import { StructureContext, IStructureContext } from '../../../containers/StructureContainer';

interface IState {
    series: { [key: string]: any };
    activeKey: string[];
    collapsed: boolean;
}

class SeriesPanel extends Component<{}, IState> {
    static contextType = StructureContext;
    context: IStructureContext;

    constructor(props: {}, context: IStructureContext) {
        super(props, context);
        this.state = {
            series: context.series,
            activeKey: context.seriesActiveKey,
            collapsed: false,
        }
    }

    handleChangeSeries = (series: { [key: string]: any }) => {
        this.setState({
            series: Object.assign({}, series),
        }, () => {
            this.context.onChangeSeries(this.state.series);
        });
    }

    handleChangeActiveKey = (activeKey: string[]) => {
        this.setState({
            activeKey,
        });
        this.context.onChangeSeriesActiveKey(activeKey);
    }

    handleAddSeries = () => {
        const id = uuid();
        this.setState({
            series: Object.assign({}, this.state.series, {
                [id]: {
                    type: 'line',
                    data: Array.from({ length: 12 }, () => Math.random() * 1000 + 100),
                },
            }),
            activeKey: this.state.activeKey.concat(id),
        }, () => {
            this.context.onChangeSeries(this.state.series);
        });
    }

    handleCollapse = () => {
        const collapsed = !this.state.collapsed;
        const activeKey = collapsed ? [] : Object.keys(this.state.series);
        this.setState({
            collapsed,
            activeKey,
        });
        this.context.onChangeSeriesActiveKey(activeKey);
    }

    render() {
        const { series, seriesActiveKey, xAxis, yAxis } = this.context;
        const { collapsed } = this.state;
        return (
            <div className="editor-property">
                <div className="editor-property-header">
                    <Button icon={collapsed ? 'arrows-alt' : 'shrink'} onClick={this.handleCollapse}>{collapsed ? i18next.t('action.expand') : i18next.t('action.collapse')}</Button>
                    <Button type="primary" icon="plus" onClick={this.handleAddSeries}>{i18next.t('widget.series.title')}</Button>
                </div>
                <div className="editor-property-content">
                    <DynamicForm
                        value={series}
                        label={i18next.t('widget.series.title')}
                        addButton={false}
                        activeKey={seriesActiveKey}
                        formSchema={{
                            type: {
                                label: i18next.t('common.type'),
                                type: 'select',
                                initialValue: 'line',
                                style: { width: '100%' },
                                items: [
                                    {
                                        label: i18next.t('chart.line'),
                                        value: 'line',
                                    },
                                    {
                                        label: i18next.t('chart.bar'),
                                        value: 'bar',
                                    },
                                    {
                                        label: i18next.t('chart.scatter'),
                                        value: 'scatter',
                                    },
                                    {
                                        label: i18next.t('chart.area'),
                                        value: 'area',
                                    },
                                    {
                                        label: i18next.t('chart.pie'),
                                        value: 'pie',
                                    },
                                ],
                            },
                            name: {
                                label: i18next.t('common.name'),
                            },
                            xData: {
                                label: i18next.t('widget.xaxis.data'),
                                type: 'select',
                                style: { width: '100%' },
                                span: 12,
                            },
                            yData: {
                                label: i18next.t('widget.yaxis.data'),
                                type: 'select',
                                style: { width: '100%' },
                                span: 12,
                            },
                            xAxis: {
                                label: i18next.t('widget.xaxis.title'),
                                type: 'select',
                                style: { width: '100%' },
                                span: 12,
                                items: Object.keys(xAxis).map((key, index) => {
                                    const { name } = xAxis[key];
                                    return {
                                        label: name && name.length ? name : `x${index}`,
                                        value: key,
                                    };
                                }),
                            },
                            yAxis: {
                                label: i18next.t('widget.yaxis.title'),
                                type: 'select',
                                style: { width: '100%' },
                                span: 12,
                                items: Object.keys(yAxis).map((key, index) => {
                                    const { name } = yAxis[key];
                                    return {
                                        label: name && name.length ? name : `y${index}`,
                                        value: key,
                                    };
                                }),
                            },
                        }}
                        onChange={this.handleChangeSeries}
                        onChangeActiveKey={this.handleChangeActiveKey}
                    />
                </div>
            </div>
        );
    }
}

export default SeriesPanel;
