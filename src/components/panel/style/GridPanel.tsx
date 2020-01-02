import React, { Component } from 'react';
import { Button } from 'antd';
import i18next from 'i18next';
import { IStyleContext, StyleContext } from '../../../containers/StyleContainer';
import { DynamicForm } from '../../form';

interface IState {
    collapsed: boolean
    grid: Record<string, any>;
    activeKey: string[];
}

class GridPanel extends Component<{}, IState> {
    static contextType = StyleContext;
    context: IStyleContext;

    constructor(props: {}, context: IStyleContext) {
        super(props, context);
        this.state = {
            grid: context.grid,
            activeKey: context.gridActiveKey,
            collapsed: false,
        }
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

    render() {
        const { grid, gridActiveKey } = this.context;
        const { collapsed } = this.state;
        return (
            <div className="editor-property">
                <div className="editor-property-header">
                    <Button
                        icon={collapsed ? 'arrows-alt' : 'shrink'}
                        onClick={this.handleCollapse}
                    >
                        {collapsed ? i18next.t('action.expand') : i18next.t('action.collapse')}
                    </Button>
                </div>
                <div className="editor-property-content">
                    <DynamicForm
                        label={i18next.t('widget.grid.title')}
                        addButton={false}
                        deleteButton={false}
                        cloneButton={false}
                        value={grid}
                        activeKey={gridActiveKey}
                        formSchema={{
                            containLabel: {
                                label: i18next.t('widget.contain-label'),
                                type: 'boolean',
                                initialValue: false,
                            },
                            left: {
                                label: i18next.t('layout.left'),
                                initialValue: '10%',
                                span: 12,
                            },
                            right: {
                                label: i18next.t('layout.right'),
                                initialValue: '10%',
                                span: 12,
                            },
                            top: {
                                label: i18next.t('layout.top'),
                                initialValue: 60,
                                span: 12,
                            },
                            bottom: {
                                label: i18next.t('layout.bottom'),
                                initialValue: 60,
                                span: 12,
                            },
                            width: {
                                label: i18next.t('layout.width'),
                                initialValue: 'auto',
                                span: 12,
                            },
                            height: {
                                label: i18next.t('layout.height'),
                                initialValue: 'auto',
                                span: 12,
                            },
                            backgroundColor: {
                                label: i18next.t('layout.background-color'),
                                type: 'color',
                                initialValue: 'transparent',
                            },
                            borderColor: {
                                label: i18next.t('layout.border-color'),
                                type: 'color',
                                initialValue: '#ccc',
                            },
                            borderWidth: {
                                label: i18next.t('layout.border-width'),
                                type: 'number',
                                min: 0,
                                max: 100,
                                initialValue: 1,
                            },
                            shadowColor: {
                                label: i18next.t('layout.shadow-color'),
                                type: 'color',
                            },
                            shadowBlur: {
                                label: i18next.t('layout.shadow-blur'),
                                type: 'number',
                            },
                            shadowOffsetX: {
                                label: i18next.t('layout.shadow-offset-x'),
                                type: 'number',
                                span: 12,
                                initialValue: 0,
                            },
                            shadowOffsetY: {
                                label: i18next.t('layout.shadow-offset-y'),
                                type: 'number',
                                span: 12,
                                initialValue: 0,
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
