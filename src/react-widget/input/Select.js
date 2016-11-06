import cls from '../css/input.css';

import React, {Component, PropTypes} from 'react';
import isEmpty from '../../lib/is/isEmpty';
import {InputText} from './InputText';
import showErrMsg from './showErrMsg';


/**
 * 下拉选择框
 */
class Select extends InputText {
	constructor(props) {
    	super(props);

    	let {value} = props;
    	this.state = {
    		value
    	};
	}

	render() {
		let {ctProps, iptProps} = this.getProps();
		let {width, isMust, defaultText, items} = this.props;
		let {value} = this.state;

		if (isMust && !isEmpty(items) && !this.isValueInRange(value, items)) {
			this.state.value = value = items[0].value;
		}
		iptProps.value = value;
		iptProps.className = 'w-sel';
		iptProps.style.width = width;

		return <div {...ctProps}>
			<select {...iptProps}>
				{isMust ? null : <option>{defaultText}</option>}
				{
					items.map((item, index) =>
						<option key={index} value={item.value}>{item.text}</option>
					)
				}
			</select>
		</div>
	}

	//------------------------------------------------------------

    onChange(e) {
    	let {onChange} = this.props;
    	let {value} = e.target;

		this.setState({
			value: value
		});
        onChange && onChange(value);
	}

	getValue() {
		return this.state.value;
	}

    setValue(val) {
        this.state.value = val;
        this.setState({value: val});
    }

	getText(val) {
		let {items} = this.props;
		let text = '';

		items.some(item => {
			let flag = false;
			if (item.value == val) {
				text = item.text;
				flag = true;
			}
			return flag;
		});

		return text;
	}

	/**
	 * 数据验证
	 */
	validate() {
		var result = {success: true};
		return result;
	}

	/**
	 * 检查传入值是否在选项范围内
	 */
	isValueInRange(value, items) {
		return items.some(item => (item.value == value));
	}
}

Select.propTypes = Object.assign({}, InputText.propTypes, {
	value: PropTypes.oneOfType([
		PropTypes.string, 
		PropTypes.number
	]),
	defaultText: PropTypes.string,
	items: PropTypes.array,
	onChange: PropTypes.func
})

let {height, width, border, borderColor} = InputText.defaultProps;
Select.defaultProps = {
	height: height,
	width: width,
	border: border,
	borderColor: borderColor,
	defaultText: '-请选择-',
	items: [],
    onChange : (val) => {}
}

export {Select}
