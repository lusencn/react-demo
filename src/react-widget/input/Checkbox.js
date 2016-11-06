import cls from './css/input.css';

import React, {Component, PropTypes} from 'react';
import isEmpty from '../../lib/is/isEmpty';
import isFunction from '../../lib/is/isFunction';
import showErrMsg from './showErrMsg';


/**
 * 复选框
 */
export default class Checkbox extends Component {
	constructor(props) {
    	super(props);

    	let {uncheckedValue, name, value} = props;
    	this.state = { 
    		value: value === 'undefined' ? uncheckedValue : value 
    	};
    	this.id = 'wCb_' + ((!isEmpty(name) && !isEmpty(value)) ? 
    	    		`${name}_${value}` : ((new Date()).getTime() + Math.floor(Math.random() * 1000))); 
	}

	render() {
		let {readonly, itemValue, height, text, label} = this.props;
		let {value} = this.state;
		let heightStyle = {
			height: height, 
			lineHeight: height + 'px'
		}

		let iptProps = {
			id: this.id,
			type: 'checkbox',
			className: 'w-cb-ipt',
			value: itemValue,
			onChange: this.onChange.bind(this)
		};
		readonly && (iptProps.disabled = 'disabled');
		(!isEmpty(itemValue) && (itemValue == value)) && (iptProps.checked = 'checked');

		let labelContent = isEmpty(text) ? label : text;

		return <div className="w-cb-ct" style={heightStyle}>
			<ul className="w-cb-item" style={heightStyle}>
				<input {...iptProps} />
				{
					isEmpty(labelContent) ? null : 
					<label className="w-cb-text" htmlFor={this.id}>{labelContent}</label>
				}
			</ul>
		</div>
	}

	//---------------------------------------------------------------------

	onChange(e) {
		let {uncheckedValue, itemValue} = this.props;
		this.setValue(e.target.checked ? itemValue : uncheckedValue);
	}

	getValue() {
		return this.state.value;
	}

	setValue(val) {
		let {onChange, uncheckedValue} = this.props;
		this.setState({
			value: val
		}, () => {isFunction(onChange) && onChange(val !== uncheckedValue, val)});
	}

	/**
	 * 勾选
	 */
	check() {
		let {itemValue} = this.props;
		this.setValue(itemValue);
	}

	/**
	 * 取消勾选
	 */
	uncheck() {
		let {uncheckedValue} = this.props;
		this.setValue(uncheckedValue);
	}

	/**
	 * 数据验证
	 */
	validate() {
		let result = { success: true };
		let value = this.getValue();
		let {isMust, uncheckedValue, label} = this.props;

		if (isMust && value == uncheckedValue) {
			result.success = false;
			result.message = '请勾选' + label;
		}
		if (!result.success) {
			this.showErrorMsg(result.message);
		}

		return result;
	}

	/**
	 * 显示错误信息
	 */
	showErrorMsg(message) {
		showErrorMsg(message);
	}
}

Checkbox.propTypes = {
	/**
	 * 名称
	 */
	name: PropTypes.string,
	/**
	 * 复选框当前状态的取值（itemValue/uncheckedValue）
	 */
	value: PropTypes.oneOfType([
		PropTypes.string, 
		PropTypes.number
	]),
	/**
	 * 复选框选项对应的值
	 */
	itemValue: PropTypes.oneOfType([
		PropTypes.string, 
		PropTypes.number
	]),
	/**
	 * 取消勾选时控件的取值
	 */
	uncheckedValue: PropTypes.oneOfType([
		PropTypes.string, 
		PropTypes.number
	]),
	/**
	 * 与控件绑定的字段的中文名称
	 */
	label: PropTypes.string,
	/**
	 * 复选框选项的中文名称
	 */
	text: PropTypes.string,
	/**
	 * 是否必填
	 */
	isMust: PropTypes.bool,
	/**
	 * 只读状态
	 */
	readonly: PropTypes.bool,
	/**
	 * 高度
	 */
	height: PropTypes.number,
	/**
	 * 选中事件
	 */
	onChange: PropTypes.func
};

Checkbox.defaultProps = {
	name: '',
	height: 28,
	uncheckedValue: null
}