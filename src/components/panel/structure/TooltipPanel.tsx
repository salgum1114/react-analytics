import React, { Component } from 'react';
import i18next from 'i18next';
import { Button } from 'antd';
import debounce from 'lodash/debounce';

import { Form } from '../../form';
import { StructureContext, IStructureContext } from '../../../containers/StructureContainer';

interface IState {
    tooltip: Record<string, any>;
}

class TooltipPanel extends Component<{}, IState> {
    static contextType = StructureContext;
    context: IStructureContext;

    constructor(props: {}, context: IStructureContext) {
        super(props, context);
        this.state = {
            tooltip: context.tooltip,
        }
    }

    handleValuesChange = (allValues: any) => {
        this.context.onChangeTooltip(allValues);
    }

    render() {
        const { tooltip } = this.context;
        return (
            <div className="editor-property">
                <div className="editor-property-header">
                    <Button icon="close">{i18next.t('action.clear')}</Button>
                </div>
                <div className="editor-property-content">
                    <Form
                        onValuesChange={debounce(this.handleValuesChange, 300)}
                        values={tooltip}
                        formSchema={{
                            show: {
                                label: i18next.t('common.visible'),
                                type: 'boolean',
                                initialValue: true,
                            },
                            trigger: {
                                label: i18next.t('widget.trigger.title'),
                                type: 'select',
                                initialValue: 'item',
                                items: [
                                    {
                                        label: i18next.t('common.item'),
                                        value: 'item',
                                    },
                                    {
                                        label: i18next.t('common.axis'),
                                        value: 'axis',
                                    },
                                    {
                                        label: i18next.t('common.none'),
                                        value: 'none',
                                    },
                                ],
                            },
                            axisPointer: {
                                label: i18next.t('widget.axis-pointer.title'),
                                type: 'form',
                                forms: {
                                    show: {
                                        label: i18next.t('common.visible'),
                                        type: 'boolean',
                                    },
                                    label: {
                                        label: i18next.t('common.label'),
                                        type: 'form',
                                        forms: {
                                            show: {
                                                label: i18next.t('common.visible'),
                                                type: 'boolean',
                                            },
                                        },
                                    },
                                    type: {
                                        label: i18next.t('common.type'),
                                        type: 'select',
                                        items: [
                                            {
                                                label: i18next.t('widget.line.title'),
                                                value: 'line',
                                            },
                                        ],
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default TooltipPanel;
