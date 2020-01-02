import React, { Component } from 'react';
import i18next from 'i18next';
import { Button } from 'antd';

import { Form } from '../../form';

class TooltipPanel extends Component {
    render() {
        return (
            <div className="editor-property">
                <div className="editor-property-header">
                    <Button icon="close">{i18next.t('action.clear')}</Button>
                </div>
                <div className="editor-property-content">
                    <Form
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
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default TooltipPanel;
