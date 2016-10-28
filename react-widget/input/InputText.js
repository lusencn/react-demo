import cls from '../css/input.css';

import React, {Component, PropTypes} from 'react';
import showErrMsg from './showErrMsg';


/**
 * 输入框
 */
class InputText extends Component {
	constructor(props) {
    	super(props);

    	this.state = { 
    		value: props.value == null ? '' : props.value 
    	};
	}

	getProps() {
		let {
			width, height, paddingH, border, borderColor, name, placeholder, readonly, maxLength
		} = this.props;
		let {value} = this.state;
		let ctProps = {
			className: 'w-ipt-ct ' + (readonly ? 'disabled' : ''),
			style: {
				height: height,
				lineHeight: height + 'px',
				padding: '0 ' + (paddingH || 0) + 'px',
				border: border + 'px solid ' + borderColor
			}
		};
		let iptProps = {
			ref: 'ipt',
			type: 'text',
			className: 'w-ipt',
			name: name,
			value: value,
			style: {
				width: width - 2 * paddingH,
				height: height, 
				lineHeight: height + 'px'
			},
			placeholder: placeholder,
			onChange: this.onChange.bind(this)
		};
		readonly && (iptProps.disabled = 'disabled');
		maxLength && (iptProps.maxLength = maxLength);

		return {ctProps, iptProps};
	}

	render() {
		let {ctProps, iptProps} = this.getProps();

		return <div {...ctProps}>
			<input {...iptProps} />
		</div>
	}

	//------------------------------------------------------------

	onChange(e) {
		this.setState({
			value: e.target.value
		});
	}

	getValue() {
		return this.state.value.trim();
	}

	setValue(val) {
		this.setState({
			value: val == null ? '' : val
		});
	}

	/**
	 * 数据验证
	 */
	validate() {
		let {maxLength, label, isMust, validations} = this.props;
		let result = { success: true };
		let value = this.getValue();
		if (isMust && value.length <= 0) {
			result.success = false;
			result.message = '请输入' + label;
		} else if (maxLength && (value.length > maxLength)) {
			result.success = false;
			result.message = label + '最多只能输入' + maxLength + '个字';
		}
		if (!result.success) {
			this.showErrorMsg(result.message);
			return result;
		}
		validations && validations.every((validation) => {
			result = validation(value);
			return result.success;
		});
		return result;
	}

	/**
	 * 显示错误信息
	 */
	showErrorMsg(message) {
		showErrMsg(message);
	}
}

InputText.propTypes = {
	name: PropTypes.string,
	value: PropTypes.string,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	isMust: PropTypes.bool,
	readonly: PropTypes.bool,
	maxLength: PropTypes.number,
	validations: PropTypes.array,
	width: PropTypes.number,
	height: PropTypes.number,
	paddingH: PropTypes.number,
	border: PropTypes.number,
	borderColor: PropTypes.string
}

InputText.defaultProps = {
	height: 26,
	width: 100,
	paddingH: 5,
	border: 1,
	borderColor: '#ddd'
}

export {InputText}