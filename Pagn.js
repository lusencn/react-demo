import cls from './css/pagn.css';

import React, {Component, PropTypes} from 'react';


/**
 * 翻页组件
 */
export default class Pagn extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
	}
	componentDidUpdate() {
		this.refs.pagnIpt && (this.refs.pagnIpt.value = this.currPage);
	}
	render() {
		let {ctStyle} = this.props;
		this.pageCnt = Math.ceil(this.props.recordCnt / this.props.pageSize);
		this.currPage = this.props.currPage > this.pageCnt ? this.pageCnt : this.props.currPage;

		return <div className="w-pagn" style={ctStyle}>
			{
				this.pageCnt <= 0 ? null : (() => {
					return <div>
						{this.renderBtn()}
						{this.renderIndex()}
						{this.renderCnt()}
					</div>
				})()
			}
			<div style={{"clear": "both"}} />
		</div>
	}
	//----------------------------------------------------------------------
	/**
	 * 渲染“输入下标精确翻页”区域
	 */
	renderCnt() {
		return <div className="w-pagn-cnt-ct">
        	共{this.props.recordCnt}条记录，{this.pageCnt}页
        </div>
	}
	/**
	 * 渲染“下标翻页”区域
	 */
	renderIndex() {
		var currPage = this.currPage;
		var pageCnt = this.pageCnt;

		// 翻页下标
		var items = [];
		var start = 1;
		var end = pageCnt;
		var viewType = 1; // oxxxx类型
        if (pageCnt > this.props.showIndexCnt) {
        	if (currPage <= 3) {
        		// xxox…x 类型
	        	end = 4;
	        	viewType = 2;
	        } else if (currPage > (pageCnt - 3)) {
	        	// x…xoxx 类型
	        	start = pageCnt - 3;
	        	viewType = 3;
	        	items.push(<li key="1" onClick={this.onClickIndex.bind(this, 1)}>{1}</li>);
	        	items.push(<span key="elip1" className="w-pagn-elip">...</span>);
	        } else {
	        	// x…xox…x 类型
	        	start = currPage - 1;
	        	end = currPage + 1;
	        	viewType = 4;
	        	items.push(<li key="1" onClick={this.onClickIndex.bind(this, 1)}>1</li>);
	        	items.push(<span key="elip1" className="w-pagn-elip">...</span>);
	        }
        }
		for (var i = start; i <= end; i++) {
			items.push(<li 
				key={i} 
				className={currPage == i ? 'on' : ''}
				onClick={this.onClickIndex.bind(this, i)}
			>{i}</li>);
		}
		if (viewType == 2) {
			items.push(<span key="elip2" className="w-pagn-elip">...</span>);
			items.push(<li key={pageCnt} onClick={this.onClickIndex.bind(this, pageCnt)}>{pageCnt}</li>);
		} else if (viewType == 4) {
			items.push(<span key="elip2" className="w-pagn-elip">...</span>);
			items.push(<li key={pageCnt} onClick={this.onClickIndex.bind(this, pageCnt)}>{pageCnt}</li>);
		}

		this.disablePrev = currPage <= 1 ? true : false;
		this.disableNext = (pageCnt <= 1 || currPage >= pageCnt) ? true : false;

		return <ul className="w-pagn-idx-ct">
			<li 
				className={'w-pagn-cs-idx ' + (this.disablePrev ? 'disabled' : '')} 
				onClick={this.disablePrev ? undefined : this.onClickPrev.bind(this)}
			>上一页</li>
			{items}
			<li 
				className={'w-pagn-cs-idx ' + (this.disableNext ? 'disabled' : '')}
				onClick={this.disableNext ? undefined : this.onClickNext.bind(this)}
			>下一页</li>
		</ul>
	}
	/**
	 * 渲染“汇总数据”区域
	 */
	renderBtn() {
		return <div className="w-pagn-btn-ct">
			<div className="w-pagn-btn-info">
				<span>到第</span>
				<input ref="pagnIpt" type="text" onChange={this.onChangeIpt.bind(this)}/>
				<span>页</span>
			</div>
			<div className="w-pagn-btn-target" onClick={this.onClickBtn.bind(this)}>确定</div>	
		</div>
	}
	//----------------------------------------------------------------------
	/**
	 * “上一页”翻页事件
	 */
	onClickPrev() {
		var currPage = this.currPage - 1;
		this.props.onPagnChange(currPage);
	}
	/**
	 * 下标数字翻页事件
	 */
	onClickNext() {
		var currPage = this.currPage + 1;
		this.props.onPagnChange(currPage);
	}
	/**
	 * “下一页”翻页事件
	 */
	onClickIndex(index) {
		var currPage = index;
		this.props.onPagnChange(currPage);
	}
	/**
	 * 按钮翻页
	 */
	onClickBtn() {
		var currPage = this.refs.pagnIpt.value;
		this.props.onPagnChange(currPage);
	}
	/**
	 * 翻页下标输入框change事件
	 */
	onChangeIpt(e) {
		var iptValue = e.target.value || this.currPage;
		try {
			iptValue = parseInt(iptValue);
		} catch (e) {
		}
		iptValue = (typeof iptValue === 'number' && isFinite(iptValue)) ? iptValue : this.currPage;
		iptValue = Math.min(Math.max(iptValue, 1), this.pageCnt);
		this.refs.pagnIpt.value = iptValue;
	}
}

Pagn.propTypes = {
	ctStyle: PropTypes.object,
	showIndexCnt: PropTypes.number,
	recordCnt: PropTypes.number.isRequired,
	currPage: PropTypes.number.isRequired,
	pageSize: PropTypes.number.isRequired,
	onPagnChange: PropTypes.func.isRequired
};

Pagn.defaultProps = {
	showIndexCnt: 5,
	recordCnt: 0
};
