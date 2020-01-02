import React, { Component } from 'react';
import { Button } from 'antd';
import i18next from 'i18next';
import uuid from 'uuid';

import { DynamicForm } from '../../form';
import { IStructureContext, StructureContext } from '../../../containers/StructureContainer';

interface IState {
    collapsed: boolean;
    activeKey: string[];
    grid: { [key: string]: any };
}

class GridPanel extends Component<{}, IState> {
    static contextType = StructureContext;
    context: IStructureContext;

    constructor(props: {}, context: IStructureContext) {
        super(props, context);
        this.state = {
            grid: context.grid,
            activeKey: context.gridActiveKey,
            collapsed: false,
        }
    }

    handleChangeGrid = (grid: { [key: string]: any }) => {
        this.setState({
            grid: Object.assign({}, grid),
        }, () => {
            this.context.onChangeGrid(this.state.grid);
        });
    }

    handleChangeActiveKey = (activeKey: string[]) => {
        this.setState({
            activeKey,
        });
        this.context.onChangeGridActiveKey(activeKey);
    }

    handleAddGrid = () => {
        const id = uuid();
        this.setState({
            grid: Object.assign({}, this.state.grid, {
                [id]: {
                    show: false,
                },
            }),
            activeKey: this.state.activeKey.concat(id),
        }, () => {
            this.context.onChangeGrid(this.state.grid);
        });
    }

    handleCollapse = () => {
        const collapsed = !this.state.collapsed;
        const activeKey = collapsed ? [] : Object.keys(this.state.grid);
        this.setState({
            collapsed,
            activeKey,
        });
        this.context.onChangeGridActiveKey(activeKey);
    }

    render() {
        const { grid, gridActiveKey } = this.context;
        const { collapsed } = this.state;
        return (
            <div className="editor-property">
                <div className="editor-property-header">
                    <Button icon={collapsed ? 'arrows-alt' : 'shrink'} onClick={this.handleCollapse}>{collapsed ? i18next.t('action.expand') : i18next.t('action.collapse')}</Button>
                    <Button type="primary" icon="plus" onClick={this.handleAddGrid}>{i18next.t('widget.grid.title')}</Button>
                </div>
                <div className="editor-property-content">
                    <DynamicForm
                        value={grid}
                        label={i18next.t('widget.grid.title')}
                        addButton={false}
                        activeKey={gridActiveKey}
                        formSchema={{
                            name: {
                                label: i18next.t('common.name'),
                            },
                            show: {
                                label: i18next.t('common.visible'),
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
                        onChange={this.handleChangeGrid}
                        onChangeActiveKey={this.handleChangeActiveKey}
                    />
                </div>
            </div>
        );
    }
}

export default GridPanel;
