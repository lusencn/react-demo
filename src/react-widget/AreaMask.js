import maskCSS from './css/areamask.css';

import React, {Component, PropTypes} from 'react';
import isFunction from '../lib/is/isFunction';


/**
 * 局部区域加载中
 */
export default class AreaMask extends Component {
	constructor(props) {
		super(props);
	}

	componentWillReceiveProps(nextProps) {
		let {loading, onLoadingChange} = this.props;
		if (nextProps.loading != loading && isFunction(onLoadingChange)) {
			onLoadingChange(nextProps.loading);
		}
	}

	render() {
		let {loading} = this.props;
		if (!loading) {
			return null;
		}

		return <div className="w-area-mask">
			<div className="mask"></div>
			<div className="content">
				<div><i className="i-loading"></i></div>
				<div>正在加载数据，请稍候……</div>
			</div>
		</div>
	}
}

AreaMask.propTypes = {
	/**
	 * 加载中状态
	 */
	loading: PropTypes.bool.isRequired,
	/**
	 * 加载中状态变化事件
	 */
	onLoadingChange: PropTypes.func
}