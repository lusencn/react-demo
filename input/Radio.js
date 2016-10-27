import cls from '../css/input.css';

import React, {Component, PropTypes} from 'react';
import showErrMsg from './showErrMsg';


/**
 * 单选框
 */
class Radio extends Component {
	constructor(props) {
    	super(props);
    	this.state = { value: props.value == null ? '' : props.value };
    	this.id = 'wRd_' + (new Date()).getTime();
	}

	render() {
		if (this.props.items.length > 0 && !this.isValueInRange(this.state.value, this.props.items)) {
			this.state.value = this.props.items[0].value;
		}

		return <div className="w-radio-ct" style={{
			height: this.props.height,
			lineHeight: this.props.height + 'px'
		}}>
			{
				this.props.items.map((item, index) => {
					let itemId = this.id + '_' + index;
					let params = {};
					(item.value == this.state.value) && (params.checked = 'checked');
					this.props.readonly && (params.disabled = 'disabled');

					return <ul key={index} className="w-radio-item" style={{
						height: this.props.height,
						lineHeight: this.props.height + 'px',
						marginRight: this.props.itemSp + 'px'
					}}>
						<input
							id={itemId}
							type="radio"
							className="w-radio-ipt"
							name={this.props.name}
							value={item.value}
							onChange={this.onChange.bind(this)}
							{...params} />
						<label className="w-radio-text" htmlFor={itemId}>{item.text}</label>
					</ul>
				})
			}
		</div>
	}

	//---------------------------------------------------------------------

	onChange(e) {
		this.setValue(e.target.value);
        this.props.onChange(this.props.name, e.target.value);
	}

	getValue() {
		return this.state.value;
	}

	setValue(val) {
		this.setState({
			value: val == null ? '' : val
		});
	}

	/**
	 * 检查传入值是否在选项范围内
	 */
	isValueInRange(value, items) {
		return items.some((item) => {
			return item.value == value;
		});
	}
}

Radio.propTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([
		PropTypes.string, 
		PropTypes.number
	]),
	items: PropTypes.array,
	uncheckedValue: PropTypes.string,
	label: PropTypes.string,
	isMust: PropTypes.bool,
	readonly: PropTypes.bool,
	height: PropTypes.number,
	itemSp: PropTypes.number,
	onChange: PropTypes.func
}

Radio.defaultProps = {
	name: 'radioName',
	itemSp: 15,
	items: [],
    onChange: (val) => {}
}

export {Radio}
