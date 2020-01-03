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
import { FormProps as AntFormProps, ValidationRule } from 'antd/lib/form';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import i18next from 'i18next';
import isEmpty from 'lodash/isEmpty';

import DynamicForm from './DynamicForm';
import { ColorPicker } from '../picker';

export type FormComponentType = 'divider'
| 'label'
| 'text'
| 'textarea'
| 'number'
| 'boolean'
| 'select'
| 'template'
| 'templatearea'
| 'json'
| 'cron'
| 'tags'
| 'dynamic'
| 'custom'
| 'password'
| 'color'
| 'form'
;

export type FormSchema = MultipleFormConfig | FormConfig;

export interface MultipleFormConfig {
    [key: string]: FormConfig;
}

export interface SelectItemConfig {
    label: string;
    value: string | number;
    forms?: FormSchema;
}

export type SelectMode = 'default' | 'multiple' | 'tags' | 'combobox';

export interface FormConfig {
    type?: FormComponentType;
    disabled?: boolean;
    icon?: string;
    extra?: React.ReactNode;
    help?: React.ReactNode;
    description?: React.ReactNode;
    span?: number;
    max?: number;
    min?: number;
    placeholder?: string;
    valuePropName?: string;
    required?: boolean;
    initialValue?: any;
    label?: React.ReactNode;
    style?: React.CSSProperties;
    /**
     * Press enter
     */
    onPressEnter?: () => void;
    /**
     * Required Items when type is Select
     */
    items?: SelectItemConfig[];
    rules?: ValidationRule[];
    /**
     * Required Render when type is Custom
     */
    render?: (form: WrappedFormUtils, values: any, disabled: boolean, validate: (errors: any) => void) => React.ReactNode;
    hasFeedback?: boolean;
    /**
     * Required Component when type is Custom
     */
    component?: React.ComponentClass<any>;
    /**
     * Required Mode when type is Select
     */
    mode?: SelectMode;
    /**
     * If type is dynamic, require formSchema
     */
    forms?: FormSchema;
    /**
     * If type is dynamic, require header
     */
    header?: React.ReactNode;
    ref?: React.Ref<any>;
}

export interface FormProps extends Omit<AntFormProps, 'onValuesChange'> {
    /**
     * Whether to wrap it with a form component
     * @default true
     */
    useForm?: boolean;
    wrappedComponentRef?: any;
    /**
     * Row gutter
     * @default 8
     */
    gutter?: number;
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
    onValuesChange?: (allValues: any, formKey: string, isSingle: boolean) => void;
}

interface IState {
    errors: any;
    selectedValues: any;
}

class Form extends Component<FormProps, IState> {
    static Item: typeof AntForm.Item;

    state: IState = {
        errors: null,
        selectedValues: {},
    }

    UNSAFE_componentWillReceiveProps(nextProps: FormProps) {
        if (JSON.stringify(nextProps.values) !== JSON.stringify(this.props.values)) {
            nextProps.form.resetFields();
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
        let value = !isEmpty(values) ? key.split('.').reduce((prev, curr) => {
            if (typeof prev !== 'object') {
                return prev;
            }
            return prev[curr];
        }, values) : initialValue;
        if (typeof value === 'undefined') {
            value = initialValue;
        }
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
                // TODO... When value render form
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
            case 'color':
                component = <ColorPicker />;
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
            case 'form':
                component = (
                    <div style={style}>
                        <span style={{ fontWeight: 'bold', marginBottom: 4 }}>
                            {label}
                        </span>
                        {Object.keys(forms).map(formKey => this.createFormItem(`${key}.${formKey}`, (forms as MultipleFormConfig)[formKey]))}
                    </div>
                )
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
                    {
                        type === 'form' ? component : (
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
                        )
                    }
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
            onValuesChange,
            formSchema,
            form,
            gutter = 8,
            values = {},
            layout = 'vertical',
            colon = false,
            useForm = true,
            formKey,
            isSingle,
            render,
            ...other
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
        return useForm ? (
            <AntForm colon={colon} layout={layout} {...other}>
                {component}
            </AntForm>
        ) : component;
    }
}

Form.Item = AntForm.Item;

export default AntForm.create<FormProps>({
    onValuesChange: (props: any, _changedValues: any, allValues: any) => {
        const { onValuesChange, formKey, isSingle } = props;
        if (onValuesChange) {
            onValuesChange(allValues, formKey, isSingle);
        }
    },
})(Form);
