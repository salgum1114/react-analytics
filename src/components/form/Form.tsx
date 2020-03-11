import React, { useState } from 'react';
import { Form as AntForm, Col, Row, Tooltip, Input, Slider, Select, InputNumber, Divider, Switch } from 'antd';
import { Rule, FormInstance, FormProps as AntFormProps } from 'antd/lib/form';
import isEmpty from 'lodash/isEmpty';
import { QuestionCircleOutlined } from '@ant-design/icons';
import FormItem from 'antd/lib/form/FormItem';
import i18next from 'i18next';

import { ColorPicker } from '../picker';
import DynamicForm from './DynamicForm';
import { Label } from '../label';

export type FormComponentType =
	| 'divider'
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
	| 'slider';

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
	rules?: Rule[];
	/**
	 * Required Render when type is Custom
	 */
	render?: (form: FormInstance, values: any, disabled: boolean, validate: (errors: any) => void) => React.ReactNode;
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
	 * Row gutter
	 * @default 16
	 */
	gutter?: number;
	formKey?: string;
	values?: any;
	formSchema?: FormSchema;
	render?: (form: FormInstance) => React.ReactNode;
	onValuesChange?: (changedValues: any, allValues: any, formKey?: string) => void;
	children?: React.ReactNode;
}

const Form = React.forwardRef<any, FormProps>((props, ref) => {
	const { formKey, gutter = 16, formSchema, onValuesChange, values, layout = 'vertical', ...other } = props;
	const [selectedValues, setSelectedValues] = useState<Record<string, any>>({});
	const [errors, setErrors] = useState<Record<string, any>>({});
	const handleSelect = (selectedValue: any, key: string) => {
		setSelectedValues(Object.assign({}, selectedValues, { [key]: selectedValue }));
	};
	const handleValidate = (errors: any) => {
		setErrors(errors);
	};
	const handleDefaultValidator = (_rule: any, _value: any, callback: (errors?: any) => void) => {
		console.log(callback);
		if (errors && errors.length) {
			callback(errors);
			return;
		}
		callback();
	};
	const handleValuesChange = (changedValues: any, allValues: any) => {
		if (onValuesChange) {
			onValuesChange(changedValues, allValues, formKey);
		}
	};
	const createFormItem = (key: string, formConfig: FormConfig) => {
		const { colon = false, values, form } = props;
		let component = null as any;
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
			initialValue,
		} = formConfig;
		let value = !isEmpty(values)
			? key.split('.').reduce((prev, curr) => {
					if (typeof prev !== 'object') {
						return prev;
					}
					return prev[curr];
			  }, values)
			: initialValue;
		if (typeof value === 'undefined') {
			value = initialValue;
		}
		let newRules = required
			? [{ required: true, message: i18next.t('validation.enter-arg', { arg: label }) }]
			: ([] as Rule[]);
		if (rules) {
			newRules = newRules.concat(rules);
		}
		let selectFormItems = null;
		switch (type) {
			case 'divider':
				component = (
					<Divider style={style} key={key}>
						{label}
					</Divider>
				);
				return component;
			case 'label':
				component = <Label />;
				break;
			case 'text':
				component = (
					<Input
						ref={ref}
						onPressEnter={onPressEnter}
						style={style}
						disabled={disabled}
						minLength={min}
						maxLength={max}
						placeholder={placeholder}
					/>
				);
				break;
			case 'password':
				component = (
					<Input.Password
						ref={ref}
						onPressEnter={onPressEnter}
						style={style}
						disabled={disabled}
						minLength={min}
						maxLength={max}
						placeholder={placeholder}
					/>
				);
				break;
			case 'textarea':
				component = <Input.TextArea ref={ref} style={style} disabled={disabled} placeholder={placeholder} />;
				break;
			case 'number':
				component = (
					<InputNumber
						ref={ref}
						style={{ ...style, width: '100%' }}
						disabled={disabled}
						min={min}
						max={max}
					/>
				);
				break;
			case 'boolean':
				component = <Switch style={style} disabled={disabled} />;
				if (typeof value === 'undefined') {
					value = true;
				}
				// TODO... When value render form
				break;
			case 'select':
				value = selectedValues[key] || value;
				component = (
					<Select
						style={style}
						mode={mode}
						placeholder={placeholder}
						disabled={disabled}
						onSelect={selectedValue => handleSelect(selectedValue, key)}
					>
						{Array.isArray(items) &&
							items.map((item: any) => {
								if (item.forms && item.value === value) {
									selectFormItems = Object.keys(item.forms).map(formKey =>
										createFormItem(formKey, item.forms[formKey]),
									);
								}
								return (
									<Select.Option key={item.value} value={item.value}>
										{item.label}
									</Select.Option>
								);
							})}
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
						{value &&
							value.map((item: any) => (
								<Select.Option key={item} value={item}>
									{item}
								</Select.Option>
							))}
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
				component = render ? (
					render(form, values, disabled, handleValidate)
				) : formConfig.component ? (
					<formConfig.component
						ref={ref}
						onPressEnter={onPressEnter}
						style={style}
						onValidate={handleValidate}
						form={form}
						values={values}
						disabled={disabled}
					/>
				) : null;
				break;
			case 'form':
				component = (
					<div style={style}>
						<span style={{ fontWeight: 'bold', marginBottom: 4 }}>{label}</span>
						{Object.keys(forms).map(formKey =>
							createFormItem(`${key}.${formKey}`, (forms as MultipleFormConfig)[formKey]),
						)}
					</div>
				);
				break;
			case 'slider':
				component = <Slider style={style} min={min} max={max} />;
				break;
			default:
				component = (
					<Input
						ref={ref}
						onPressEnter={onPressEnter}
						style={style}
						minLength={min}
						maxLength={max}
						placeholder={placeholder}
						disabled={disabled}
					/>
				);
		}
		const newLabel = description ? (
			<>
				{icon || null}
				<span>{label}</span>
				<Tooltip title={description} placement="topRight">
					<span style={{ float: 'right' }}>
						<QuestionCircleOutlined />
					</span>
				</Tooltip>
			</>
		) : (
			<>
				{icon || null}
				<span>{label}</span>
			</>
		);
		let newValuePropName = typeof value === 'boolean' ? 'checked' : valuePropName || 'value';
		if (type === 'dynamic') {
			newValuePropName = 'values';
		}
		return (
			<React.Fragment key={key}>
				<Col md={24} lg={span || 24}>
					{type === 'form' ? (
						component
					) : (
						<FormItem
							colon={colon}
							label={label ? newLabel : null}
							help={help}
							extra={extra}
							hasFeedback={hasFeedback}
							rules={newRules}
							valuePropName={newValuePropName}
							name={key}
						>
							{component}
						</FormItem>
					)}
				</Col>
				{selectFormItems}
			</React.Fragment>
		);
	};
	const createFormItemList = () => {
		let components;
		const schema = formSchema as MultipleFormConfig;
		components = Object.keys(formSchema).map(key => createFormItem(key, schema[key]));
		return <Row gutter={gutter}>{components}</Row>;
	};
	return (
		<AntForm ref={ref} layout={layout} onValuesChange={handleValuesChange} initialValues={values} {...other}>
			{createFormItemList()}
		</AntForm>
	);
});

export default Form;
