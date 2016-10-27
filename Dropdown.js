import dropdownCSS from './css/dropdown.css';

import React, {Component, PropTypes} from 'react';


/**
 * 下拉选择组件
 */
class Dropdown extends Component {
	constructor(props) {
		super(props);
		this.id = 'dd_' + (new Date()).getTime() + '_' + Math.floor(Math.random() * 100);
		this.state = {
			showItems: false
		}

		let {items, value} = props;
		if (!items.some(item => {
			var result = item.value == value;
			result && (this.state.value = item.value, this.state.text = item.text);
			return result;
		})) {
			this.state.value =items[0].value;
			this.state.text = items[0].text;
		}
	}
	componentDidMount() {
		this.bindWindowClickEvent();
    }
    componentWillUnmount() {
        this.unbindWindowClickEvent();
    }
	render() {
		var itemEl = <div className="w-dd-items">
			<ul>{
				this.props.items.map((item, i) => {
					var style = {};
					var selected = false;
					if (item.value == this.state.value) {
						selected = true;
						style.color = this.props.selectedItemColor;
					}
					return <li key={i} style={style} onClick={this.onSelItem.bind(this, item.value, item.text)}>
						{item.text}
						{selected ? <img src={this.props.selectedIcon} /> : null}
					</li>
				})
			}</ul>
		</div>

		return <div className={"w-dd-ct " + (this.props.className || '')} style={{width: this.props.width - 2}}>
			<div className="w-dd-rs" onClick={this.onShowItems.bind(this)}>
				{this.state.text}
				<div className="w-dd-arr"></div>
			</div>
			{ this.state.showItems ? itemEl : null }
		</div>
	}
	//-------------------------------------------------------
	/**
	 * 显示下拉选项
	 */
	onShowItems(e) {
		this.setState({
			showItems: true
		});

		e.stopPropagation();
	}
	/**
	 * 隐藏下拉选项
	 */
	onHideItems() {
		this.setState({
			showItems: false
		});
	}
	/**
	 * 选择下拉选项
	 */
	onSelItem(value, text, e) {
		this.setState({
			showItems: false,
			value: value,
			text: text
		}, () => this.props.onSelItem(value, text));

		e.stopPropagation();
	}
	bindWindowClickEvent() {
		var id = this.id;
		Dropdown.winClickEvents[id] && this.unbindWindowClickEvent();
		var eventHandle = Dropdown.winClickEvents[id] = (() => this.onHideItems());
		if (window.addEventListener) {
            window.addEventListener('click', eventHandle, false);
        } else {
            window.document.attachEvent('onclick', eventHandle);
        }
	}
	unbindWindowClickEvent() {
		var eventHandle = Dropdown.winClickEvents[this.id];
		if (!eventHandle) {
			return;
		}
		if (window.addEventListener){
            window.removeEventListener('click', eventHandle, false);
        } else {
            window.document.detachEvent('onclick', eventHandle);
        }
        Dropdown.winClickEvents[this.id] = null;
	}
}

Dropdown.propTypes = {
	items: PropTypes.array.isRequired,
	value: PropTypes.string,
	width: PropTypes.number,
	selectedItemColor: PropTypes.string,
	className: PropTypes.string,
	onSelItem: PropTypes.func
};

Dropdown.defaultProps = {
	propTypes: {
		items: PropTypes.array.isRequired,
		value: PropTypes.string,
		width: PropTypes.number,
		selectedItemColor: PropTypes.string,
		className: PropTypes.string,
		onSelItem: PropTypes.func
	},
	width: 150,
	selectedItemColor: '#49c2c4',
	selectedIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAYAAAD+Bd/7AAAAAXNSR0IArs4c6QAAAIVJREFUCB1jZMABAs+cy/j/n6GQKerSJUF0NQFnzyf8+/9/MlC8genrrz9XAk6fbYAp8j97Nvz/v3+zmZgY0jaYGi1nYWRgSvzP+G8TUNE3IPvm////Fv9nZMpfb2w4H6SJEUQAdfky/mdYC2L/Z2Cq2mhi2ANio4Cgc+f8As6cy0QRBHIAp340e1+oGBcAAAAASUVORK5CYII='
}

Dropdown.winClickEvents = {};

export {Dropdown}