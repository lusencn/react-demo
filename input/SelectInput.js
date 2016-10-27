import cls from '../css/input.css';

import React, {Component, PropTypes} from 'react';
import isEmpty from '../../lib/is/isEmpty';
import assign from '../../lib/object/assign';
import {InputText} from './InputText';
import showErrMsg from './showErrMsg';


/**
 * 支持文字输入的下拉选择框
 */
class SelectInput extends Component {
	constructor(props) {
		super(props);

		let {value, items} = props;
		let {selVal, iptVal} = value || {};
		this.state = {
			items: isEmpty(items) ? [] : items,
			value: {
				selVal: isEmpty(selVal) ? '' : selVal,
				iptVal: isEmpty(iptVal) ? '' : iptVal
			}
		};
		this.setWH(props);
	}

	componentDidMount() {
		// 挂载组件后，加载列表数据
		let {loadItems, value} = this.props;
		let {selVal, iptVal} = value || {};

		loadItems().then(result => {
			let {records} = result;
			!isEmpty(records) && this.setState({
				items: records.map(record => {
					let {userId, name} = record;
					return {
						value: userId,
						text: name
					}
				}),
				value: {
					selVal: isEmpty(selVal) ? '' : selVal,
					iptVal: isEmpty(iptVal) ? '' : iptVal
				}
			})
		});
	}

	/**
	 * 设置下拉选项和输入框同时显示时，输入框宽度
	 */
	setWH(props) {
		let {width, height, border} = props;
		this.spWidth = 5;
		this.selWidth = width / 2 - this.spWidth - border * 2;
		this.iptWidth = width - this.selWidth - this.spWidth - border * 2;
	}

	//------------------------------------------------------------------------

	render() {
		let {height} = this.props;
		let ctProps = {
			className: 'w-selipt',
			style: {
				height: height,
				lineHeight: height + 'px'
			}
		}

		return <div {...ctProps}>
			{this.selView()}
			{this.isIptAct() ? this.iptView() : null}
		</div>
	}

	/**
	 * 是否显示输入框
	 */
	isIptAct() {
		let {iptActSelVal} = this.props;
		let {value, items} = this.state;
		let {selVal, iptVal} = value || {};

		return (selVal == iptActSelVal ||
			isEmpty(items) ||
			!selVal && !isEmpty(iptVal)
		);
	}

	/**
	 * 输入框标签属性
	 */
	iptCtProps() {
		let {height, readonly, border, borderColor} = this.props;

		return {
			className: 'w-ipt-ct ' + (readonly ? 'disabled' : ''),
			style: {
				height: height,
				lineHeight: height + 'px',
				border: border + 'px solid ' + borderColor
			}
		};
	}

	/**
	 * 下拉框视图
	 */
	selView() {
		let {width, height, readonly, isMust, iptActSelVal, iptActSelTxt} = this.props;
		let {value, items} = this.state;
		let {selVal} = value;
		let ctProps = this.iptCtProps();
		Object.assign(ctProps.style, {
			marginRight: this.spWidth + 'px',
			padding: '0px'
		});

		// select标签属性
		let selProps = {
			ref: 'sel',
			className: 'w-sel',
			style: {
				width,
				height,
				lineHeight: height + 'px'
			},
			onChange: this.onSelChange.bind(this)
		};
		let isIptAct = this.isIptAct();
		if (isIptAct) {
			Object.assign(selProps.style, {
				width: this.selWidth
			});
			selVal = iptActSelVal;
		} else if (!this.isValueInRange(selVal, items)) {
			selVal = items[0].value;
		}
		this.state.value.selVal = selProps.value = selVal;
		readonly && (selProps.disabled = 'disabled');

		return <div {...ctProps}>
			<select {...selProps}>
				{items.map((item, index) => <option key={index} value={item.value}>{item.text}</option>)}
				<option value={iptActSelVal}>{iptActSelTxt}</option>
			</select>
		</div>
	}

	/**
	 * 输入框视图
	 */
	iptView() {
		let {height, readonly, isMust, maxlength} = this.props;
		let {iptVal} = this.state.value;
		let ctProps = this.iptCtProps();

		// input标签属性
		let iptProps = {
			ref: 'ipt',
			className: 'w-ipt',
			value: iptVal,
			style: {
				width: this.iptWidth - 2 * paddingH,
				height: height,
				lineHeight: height + 'px'
			},
			onChange: this.onIptChange.bind(this)
		};
		readonly && (iptProps.disabled = 'disabled');
		maxlength && (iptProps.maxLength = maxlength);

		return <div {...ctProps}><input {...iptProps}></input></div>
	}

	/**
	 * 检查传入值是否在选项范围内
	 */
	isValueInRange(value, items) {
		return items.some(item => (item.value == value));
	}

	/**
	 * 显示错误信息
	 */
	showErrorMsg(message) {
		showErrMsg(message);
	}

	//------------------------------------------------------------------------

	/**
	 * 下拉框变化事件
	 */
	onSelChange(e) {
		let {value} = this.state;
		this.setState({
			value: Object.assign(value, {
				selVal: e.target.value
			})
		});
	}

	/**
	 * 输入框变化事件
	 */
	onIptChange(e) {
		let {value} = this.state;
		this.setState({
			value: Object.assign(value, {
				iptVal: e.target.value
			})
		});
	}

	/**
	 * 数据验证
	 */
	validate() {
		let {label, maxlength, isMust, iptActSelVal} = this.props;
		let {selVal, iptVal} = this.state.value;
		let result = {success: true};

		if (isMust && (selVal == iptActSelVal) && isEmpty(iptVal)) {
			result.success = false;
			result.message = '请输入' + label;
		} else if ((selVal == iptActSelVal) && maxlength && (iptVal.length > maxlength)) {
			result.success = false;
			result.message = label + '最多只能输入' + maxlength + '个字';
		}
		if (!result.success) {
			this.showErrorMsg(result.message);
			return result;
		}

		return result;
	}

	getValue() {
		let {value, items} = this.state;
		let {selVal} = value;
		items.some(item => {
			let flag = (item.value == selVal);
			flag && (value.selTxt = item.text);
			return flag;
		});
		return value;
	}

    setValue(val) {
        this.state.value = val;
        this.setState({value: val});
    }
}

SelectInput.propTypes = Object.assign({}, InputText.propTypes, {
	value: PropTypes.object,
	items: PropTypes.array,
	iptActSelVal: PropTypes.number,
	iptActSelTxt: PropTypes.string,
	loadItems: PropTypes.func
});

let {height, width, paddingH, border, borderColor} = InputText.defaultProps;
SelectInput.defaultProps = {
	items: [],
	width: width,
	height: height,
	paddingH: paddingH,
	border: border,
	borderColor: borderColor,
	iptActSelVal: -2,
	iptActSelTxt: '-其它-'
}

export {SelectInput}