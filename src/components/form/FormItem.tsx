import React, { Component } from 'react';
import {
    Form as AntForm,
    Row,
    Divider,
    Input,
    InputNumber,
    Switch,
    Select,
    Tooltip,
    Col,
    Icon,
} from 'antd';
import { ValidationRule } from 'antd/lib/form';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import i18next from 'i18next';
import isEmpty from 'lodash/isEmpty';

import DynamicForm from './DynamicForm';
import { FormSchema, FormConfig, MultipleFormConfig } from './LegacyForm';

export interface FormItemProps {
    /**
     * Row gutter
     * @default 16
     */
    gutter?: number;
    colon?: boolean;
    formKey?: string;
    /**
     * Whether form schema is single
     * @default false
     */
    isSingle?: boolean;
    values?: any;
    formSchema?: FormSchema;
    form: WrappedFormUtils;
    render?: (form: WrappedFormUtils) => React.ReactNode;
}

interface IState {
    errors: any;
    selectedValues: any;
}

class FormItem extends Component<FormItemProps, IState> {
    state: IState = {
        errors: null,
        selectedValues: {},
    }

    UNSAFE_componentWillReceiveProps(nextProps: FormItemProps) {
        if (JSON.stringify(nextProps.values) !== JSON.stringify(this.props.values)) {
            this.setState({
                selectedValues: {},
            });
        }
    }

    createFormItem = (key: string, formConfig: FormConfig) => {
        const { colon = false, isSingle, values, form } = this.props;
        let component = null;
        const {
            disabled,
            icon,
            extra,
            help,
            description,
            span,
            max,
            min,
            placeholder,
            valuePropName,
            items,
            required,
            rules,
            initialValue,
            label,
            type,
            render,
            hasFeedback,
            mode,
            style,
            forms,
            header,
            onPressEnter,
            ref,
        } = formConfig;
        let value = !isEmpty(values) ? values[key] : initialValue;
        if (isSingle) {
            value = values || initialValue;
        }
        let newRules = required ? [{ required: true, message: i18next.t('validation.enter-arg', { arg: label }) }] : [] as ValidationRule[];
        if (rules) {
            newRules = newRules.concat(rules);
        }
        let selectFormItems = null;
        switch (type) {
            case 'divider':
                component = <Divider style={style} key={key}>{label}</Divider>;
                return component;
            case 'label':
                component = (
                    <span style={{ fontWeight: 'bold' }}>
                        {initialValue}
                    </span>
                );
                break;
            case 'text':
                component = <Input ref={ref} onPressEnter={onPressEnter} style={style} disabled={disabled} minLength={min} maxLength={max} placeholder={placeholder} />;
                break;
            case 'password':
                component = <Input.Password ref={ref} onPressEnter={onPressEnter} style={style} disabled={disabled} minLength={min} maxLength={max} placeholder={placeholder} />;
                break;
            case 'textarea':
                component = <Input.TextArea ref={ref} style={style} disabled={disabled} placeholder={placeholder} />;
                break;
            case 'number':
                component = <InputNumber ref={ref} style={{ ...style, width: '100%' }} disabled={disabled} min={min} max={max} />;
                break;
            case 'boolean':
                component = <Switch style={style} disabled={disabled} />;
                if (typeof value === 'undefined') {
                    value = true;
                }
                break;
            case 'select':
                value = this.state.selectedValues[key] || value;
                component = (
                    <Select style={style} mode={mode} placeholder={placeholder} disabled={disabled} onSelect={selectedValue => this.handlers.onSelect(selectedValue, key)}>
                        {
                            Array.isArray(items) && items.map((item: any) => {
                                if (item.forms && item.value === value) {
                                    selectFormItems = Object.keys(item.forms).map(formKey =>
                                        this.createFormItem(formKey, item.forms[formKey]));
                                }
                                return (
                                    <Select.Option key={item.value} value={item.value}>
                                        {item.label}
                                    </Select.Option>
                                );
                            })
                        }
                    </Select>
                );
                break;
            case 'tags':
                component = (
                    <Select
                        style={style}
                        mode="tags"
                        dropdownStyle={{ display: 'none' }}
                        placeholder={placeholder}
                        disabled={disabled}
                    >
                        {
                            value && value.map((item: any) => (
                                <Select.Option key={item} value={item}>
                                    {item}
                                </Select.Option>
                            ))
                        }
                    </Select>
                );
                break;
            case 'dynamic':
                component = <DynamicForm formSchema={forms} label={header} />;
                break;
            case 'custom':
                component = render ? render(form, values, disabled, this.validators.validate) : (formConfig.component ? (
                    <formConfig.component
                        ref={ref}
                        onPressEnter={onPressEnter}
                        style={style}
                        onValidate={this.validators.validate}
                        form={form}
                        values={values}
                        disabled={disabled}
                    />
                ) : null);
                break;
            default:
                component = <Input ref={ref} onPressEnter={onPressEnter} style={style} minLength={min} maxLength={max} placeholder={placeholder} disabled={disabled} />;
        }
        const newLabel = description ? (
            <>
                {icon ? <Icon type={icon} /> : null}
                <span>{label}</span>
                <Tooltip title={description} placement="topRight">
                    <span style={{ float: 'right' }}>
                        <Icon type="question-circle" />
                    </span>
                </Tooltip>
            </>
        ) : (
                <>
                    {icon ? <Icon type={icon} /> : null}
                    <span>{label}</span>
                </>
            );
        return (
            <React.Fragment key={key}>
                <Col md={24} lg={span || 24}>
                    <AntForm.Item
                        colon={colon}
                        label={label ? newLabel : null}
                        help={help}
                        extra={extra}
                        hasFeedback={hasFeedback}
                    >
                        {
                            form.getFieldDecorator(key, {
                                initialValue: value,
                                rules: newRules,
                                valuePropName: typeof value === 'boolean' ? 'checked' : valuePropName || 'value',
                            })(component)
                        }
                    </AntForm.Item>
                </Col>
                {selectFormItems}
            </React.Fragment>
        );
    }

    handlers = {
        onSelect: (selectedValue: any, key: any) => {
            const { selectedValues } = this.state;
            this.setState({
                selectedValues: Object.assign({}, selectedValues, { [key]: selectedValue }),
            });
        },
    }

    validators = {
        validate: (errors: any) => {
            this.setState({
                errors,
            });
        },
        aceEditorValidator: (_rule: any, _value: any, callback: any) => {
            if (this.state.errors && this.state.errors.length) {
                callback(this.state.errors);
                return;
            }
            callback();
        },
        cronValidator: (_rule: any, _value: any, callback: any) => {
            if (this.state.errors && this.state.errors.length) {
                callback(this.state.errors);
                return;
            }
            callback();
        },
    }

    createForm = () => {
        const { gutter = 16, isSingle, formKey, formSchema } = this.props;
        let components;
        if (isSingle) {
            components = this.createFormItem(formKey, formSchema);
        } else {
            const schema = formSchema as MultipleFormConfig;
            components = Object.keys(formSchema).map(key => this.createFormItem(key, schema[key]));
        }
        return (
            <Row gutter={gutter}>
                {components}
            </Row>
        );
    }

    render() {
        const {
            children,
            formSchema,
            form,
            render,
        } = this.props;
        let component;
        if (formSchema) {
            component = this.createForm();
        } else if (typeof children === 'function') {
            component = children(form);
        } else if (typeof render === 'function') {
            component = render(form);
        } else {
            component = children;
        }
        return component;
    }
}

export default FormItem;
