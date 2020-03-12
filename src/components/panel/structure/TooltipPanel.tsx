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

    handleValuesChange = (changedValues: any, allValues: any) => {
        console.log(changedValues, allValues);
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
                                span: 8,
                            },
                            showContent: {
                                label: i18next.t('widget.tooltip.show-content'),
                                type: 'boolean',
                                span: 8,
                            },
                            alwaysShowContent: {
                                label: i18next.t('widget.tooltip.always-show-content'),
                                type: 'boolean',
                                span: 8,
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
                            triggerOn: {
                                label: i18next.t('widget.tooltip.trigger-on'),
                                type: 'select',
                                items: [
                                    {
                                        label: i18next.t('event.mousemove'),
                                        value: 'mousemove',
                                    },
                                    {
                                        label: i18next.t('event.click'),
                                        value: 'click',
                                    },
                                    {
                                        label: i18next.t('event.mousemove-click'),
                                        value: 'mousemove|click',
                                    },
                                    {
                                        label: i18next.t('event.none'),
                                        value: 'none',
                                    },
                                ],
                            },
                            showDelay: {
                                label: i18next.t('widget.tooltip.show-delay'),
                                type: 'number',
                                span: 12,
                            },
                            hideDelay: {
                                label: i18next.t('widget.tooltip.hide-delay'),
                                type: 'number',
                                span: 12,
                            },
                            transitionDuration: {
                                label: i18next.t('widget.tooltip.transition-duration'),
                                type: 'slider',
                                step: 0.1,
                                min: 0,
                                max: 1,
                            },
                            enterable: {
                                label: i18next.t('widget.tooltip.enterable'),
                                type: 'boolean',
                                span: 12,
                            },
                            confine: {
                                label: i18next.t('widget.tooltip.confine'),
                                type: 'boolean',
                                span: 12,
                            },
                            renderMode: {
                                label: i18next.t('widget.tooltip.renderMode'),
                                type: 'select',
                                items: [
                                    {
                                        label: i18next.t('common.html'),
                                        value: 'html',
                                    },
                                    {
                                        label: i18next.t('widget.rich-text'),
                                        value: 'richText',
                                    },
                                ],
                            },
                            // position: {

                            // },
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
