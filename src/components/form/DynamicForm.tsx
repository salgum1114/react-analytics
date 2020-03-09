import React, { Component } from 'react';
import uuid from 'uuid';
import { Collapse, Button, Empty } from 'antd';
import i18next from 'i18next';
import debounce from 'lodash/debounce';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import Form, { FormProps } from './Form';

export interface DynamicFormProps extends Omit<FormProps, 'onChange'> {
	values?: { [key: string]: DynamicData };
	label?: React.ReactNode;
	onChange?: (datas: { [key: string]: DynamicData }) => void;
	onChangeActiveKey?: (activeKey: string[]) => void;
	delay?: number;
	addButton?: boolean;
	deleteButton?: boolean;
	cloneButton?: boolean;
	allDelete?: boolean;
	activeKey?: string[];
}

interface DynamicData {
	[key: string]: any;
}

interface IState {
	datas?: { [key: string]: DynamicData };
	activeKey?: string[];
}

class DynamicForm extends Component<DynamicFormProps> {
	forms: { [key: string]: typeof Form } = {};

	state: IState = {
		datas: this.props.values || { [uuid()]: {} },
		activeKey: this.props.activeKey || [],
	};

	UNSAFE_componentWillReceiveProps(nextProps: DynamicFormProps) {
		if (JSON.stringify(nextProps.values) !== JSON.stringify(this.props.values)) {
			this.setState({
				datas: Object.assign({}, nextProps.values),
			});
		}
		if (JSON.stringify(nextProps.activeKey) !== JSON.stringify(this.props.activeKey)) {
			this.setState({
				activeKey: nextProps.activeKey,
			});
		}
	}

	handleAddForm = () => {
		const id = uuid();
		this.setState(
			{
				datas: Object.assign({}, this.state.datas, { [id]: {} }),
				activeKey: this.state.activeKey.concat(id),
			},
			() => {
				const { onChange, onChangeActiveKey } = this.props;
				if (onChange) {
					onChange(this.state.datas);
				}
				if (onChangeActiveKey) {
					onChangeActiveKey(this.state.activeKey);
				}
			},
		);
	};

	handleCloneForm = (data: DynamicData) => {
		const id = uuid();
		this.setState(
			{
				datas: Object.assign({}, this.state.datas, { [id]: data }),
				activeKey: this.state.activeKey.concat(id),
			},
			() => {
				const { onChange, onChangeActiveKey } = this.props;
				if (onChange) {
					onChange(this.state.datas);
				}
				if (onChangeActiveKey) {
					onChangeActiveKey(this.state.activeKey);
				}
			},
		);
	};

	handleRemoveForm = (id: string) => {
		delete this.state.datas[id];
		this.setState(
			{
				datas: this.state.datas,
				activeKey: this.state.activeKey.filter(activeKey => activeKey !== id),
			},
			() => {
				const { onChange, onChangeActiveKey } = this.props;
				if (onChange) {
					onChange(this.state.datas);
				}
				if (onChangeActiveKey) {
					onChangeActiveKey(this.state.activeKey);
				}
			},
		);
	};

	handleValuesChange = (changedValues: any, allValues: any, formKey: string) => {
		console.log(changedValues, allValues, formKey);
		const targetDatas = Object.assign({}, this.state.datas[formKey], allValues);
		const datas = Object.assign({}, this.state.datas, { [formKey]: targetDatas });
		const { onChange } = this.props;
		if (onChange) {
			onChange(datas);
		}
	};

	handleChangeActiveKey = (activeKey: string | string[]) => {
		this.setState({
			activeKey,
		});
		const { onChangeActiveKey } = this.props;
		if (onChangeActiveKey) {
			onChangeActiveKey(activeKey as string[]);
		}
	};

	render() {
		const {
			formSchema,
			label,
			addButton = true,
			onChange,
			onChangeActiveKey,
			activeKey: activeKeys,
			allDelete,
			cloneButton = true,
			deleteButton = true,
			delay = 300,
			...other
		} = this.props;
		const { datas, activeKey } = this.state;
		const datasLength = Object.keys(datas).length;
		return (
			<div className="dynamic-form">
				{datasLength ? (
					<Collapse activeKey={activeKey} onChange={this.handleChangeActiveKey}>
						{Object.keys(datas).map((key, index) => {
							return (
								<Collapse.Panel
									key={key}
									header={`${label}_${index}`}
									extra={[
										cloneButton && (
											<CopyOutlined
												key="copy"
												className="action-icon"
												onClick={e => {
													e.stopPropagation();
													this.handleCloneForm(datas[key]);
												}}
											/>
										),
										deleteButton && datasLength > 1 ? (
											<DeleteOutlined
												key="delete"
												className="action-icon"
												onClick={e => {
													e.stopPropagation();
													this.handleRemoveForm(key);
												}}
											/>
										) : (
											allDelete && (
												<DeleteOutlined
													key="delete"
													className="action-icon"
													onClick={e => {
														e.stopPropagation();
														this.handleRemoveForm(key);
													}}
												/>
											)
										),
									]}
								>
									<Form
										{...other}
										ref={(c: any) => {
											this.forms[key] = c;
										}}
										formSchema={formSchema}
										formKey={key}
										onValuesChange={debounce(this.handleValuesChange, delay < 0 ? 0 : delay)}
										values={datas[key]}
									/>
								</Collapse.Panel>
							);
						})}
					</Collapse>
				) : (
					<Empty />
				)}
				{addButton && (
					<Button icon="plus" onClick={this.handleAddForm}>
						{i18next.t('action.add')}
					</Button>
				)}
			</div>
		);
	}
}

export default DynamicForm;
