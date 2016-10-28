import gridCSS from './css/grid.css';

import React, {Component, PropTypes} from 'react';
import isEmpty from '../lib/is/isEmpty';
import isFunction from '../lib/is/isFunction';
import isNumber from '../lib/is/isNumber';
import isObject from '../lib/is/isObject';
import isArray from '../lib/is/isArray';
import uuid from '../lib/string/uuid';
import assign from '../lib/object/assign';
import Checkbox from './input/Checkbox';


/**
 * 列表组件
 */
export default class Grid extends Component {
	constructor(props) {
    	super(props);
    	this.seedId = uuid();
	}

	//-------------------------------------------------------------------------------------

	render() {
		let {isFixHeader, columns, checkColumn, actionColumn} = this.props;

    	this.initCheckProp(checkColumn);
    	this.initActionProp(actionColumn);
		this.initStyle(this.props);

		return <div className='w-grid-ct' style={this.ctStyle}>
			{isFixHeader ? this.headerView() : null}
			{this.bodyView()}
		</div>
	}

	/**
	 * 设置选择列属性
	 */
	initCheckProp(checkColumn) {
		this.checkColumn = this.initCol(Grid.checkColumn, checkColumn);
    	this.cbName = 'cb_' + this.seedId;
    	//this.selItems = {};
	}

	/**
	 * 设置选择列属性
	 */
	initActionProp(actionColumn) {
    	this.actionColumn = this.initCol(Grid.actionColumn, actionColumn);
	}

	/**
	 * 设置部分列信息
	 */
	initCol(defaultCol, propCol) {
		if (!propCol) {
			return null;
		}

		let {headerCellView, bodyCellView} = defaultCol;
		return assign({}, defaultCol, {
			headerCellView: headerCellView ? headerCellView.bind(this) : null,
			bodyCellView: bodyCellView ? bodyCellView.bind(this) : null
		}, propCol, {
			name: defaultCol.name
		});
	}

	/**
	 * table样式初始化
	 */
	initStyle(props) {
		let {
			width, headerHeight, isFixHeader, ctStyle,
			borderSpacing, thStyle, tdStyle
		} = props;
		this.width = width || '100%';

    	this.ctStyle = assign({}, isFixHeader ? {position: 'relative'} : null, ctStyle, {
    		width: this.width
    	});
    	isFixHeader && (this.fixedCtStyle = {
		    top: (headerHeight || 30) + 'px'
		});
		this.tableStyle = {
			width: this.width,
			borderSpacing: borderSpacing || 1
		};

		// 计算未设置width值的列的宽度
		this.calColWidth();
	}

	/**
	 * 计算未设置width值的列的宽度（如果有列设置width为百分数，或width设置不规范，则不执行该计算）
	 */
	calColWidth() {
		this.calColWidthVal = 'auto';

		let {columns, width, borderSpacing} = this.props;
		if (!width || !isNumber(width)) {
			return;
		}

		let calColumns = columns;
		if (calColumns == null) {
			return;
		}
		this.checkColumn && (calColumns = calColumns.concat(this.checkColumn));
		this.actionColumn && (calColumns = calColumns.concat(this.actionColumn));

		let isNoCal = false;
		let noWidthCnt = 0;
		let minusResult = width - (calColumns.length + 1) * (borderSpacing || 1);
		calColumns.some(col => {
			let colWidth = col.width;
			if (!colWidth) {
				noWidthCnt++;
				return false;
			}
			if (colWidth && (colWidth *= 1) && !isNumber(colWidth)) {
				isNoCal = true;
				return true;
			}
			minusResult -= colWidth;
		});

		if (!isNoCal && noWidthCnt) {
			this.calColWidthVal = minusResult / noWidthCnt
		}
		(this.calColWidthVal <= 0) && (this.calColWidthVal = 'auto');
	}

	/**
	 * 列表表头
	 */
	headerView() {
		return <div className='w-grid-table' style={this.tableStyle}>
			{this.rowView()}
		</div>
	}

	/**
	 * 列表表体
	 */
	bodyView() {
		let {records, columns, idName, isFixHeader} = this.props;
		records = isEmpty(records) ? [] : records;

		return <div ref="fixBodyCt" className="w-grid-fix" style={this.fixedCtStyle}>
			<div className="w-grid-table" style={this.tableStyle}>
				{isFixHeader ? null : this.headerView()}
				{isEmpty(records) ? this.emptyView() :
					records.map((record, rowIndex) => this.rowView(record, rowIndex))}
			</div>
		</div>
	}

	/**
	 * 表格行视图
	 */
	rowView(record, rowIndex) {
		let {columns, idName} = this.props;
		let trProps = {className: 'w-grid-tr'}
		record && (trProps.key = `gridRow_${record[idName] || rowIndex}`);

		return <ul {...trProps}>
			{this.cellView(this.checkColumn, record, rowIndex)}
			{columns.map(column => this.cellView(column, record, rowIndex))}
			{this.cellView(this.actionColumn, record, rowIndex)}
		</ul>
	}

	/**
	 * 单元格视图
	 */
	cellView(column, record, rowIndex) {
		if (column == null) {
			return null;
		}

		let {name, label, headerCellView, bodyCellView} = column;

		// 单元格内容
		let content = null;
		if (record) {
			// 表格内容
			let value = record[name];
			content = isFunction(bodyCellView) ? bodyCellView(value, rowIndex, record, column) : value;
		} else {
			// 表头内容
			content = isFunction(headerCellView) ? headerCellView(column) : label;
		}

		// 单元格标签属性
		let {tdProps, boxProps, contentProps} = this.cellProps(column, record, content);

		return <li {...tdProps}>
			<div {...boxProps}>
				<div {...contentProps}>{content}</div>
			</div>
		</li>
	}

	/**
	 * 单元格标签属性
	 */
	cellProps(column, record, content) {
		let {tdStyle, thStyle} = this.props;
		let {name, label, width, headerStyle, bodyStyle} = column;
		let value = record ? record[name] : null;

		let colClassName = '',
			colStyle = null,
			contentStyle = null;
		if (record) {
			// 表体
			colClassName = 'w-grid-td';
			colStyle = tdStyle;
			contentStyle = bodyStyle;
		} else {
			// 表头
			colClassName = 'w-grid-th';
			colStyle = thStyle;
			contentStyle = headerStyle;
		}

		// 表格元素标签属性
		width || (width = this.calColWidthVal);
		let tdProps = {
			key: `gridHeader${name}`,
			title: (isObject(content) || isArray(content)) ?
				((isObject(value) || isArray(value)) ? null : value) : content,
			className: colClassName,
			style: assign({}, colStyle, width ? {width} : null)
		}
		let boxProps = {
			className: 'w-grid-box',
			style: assign({}, width ? {width} : null)
		}
		let contentProps = {
			className: 'w-grid-content',
			style: assign({}, contentStyle)
		}

		return {tdProps, boxProps, contentProps};
	}

	/**
	 * 空数据视图
	 */
	emptyView() {
		let {emptyView} = this.props;
		return isFunction(emptyView) ? emptyView() :
			<div className="w-grid-empty"><i className="i-empty"></i></div>
	}

	//-------------------------------------------------------------------------------------

	/**
	 * 选择控件视图
	 */
	checkView(rowIndex, record) {
		let props = {};
		if (record) {
			// 表体复选框
			let {name, value} = this.bodyCheckProps(rowIndex, record);
			assign(props, {
				name,
				ref: name,
				itemValue: value,
				onChange: this.onCheckChange.bind(this)
			});
		} else {
			// 表头复选框
			let {name} = this.headerCheckProps();
			assign(props, {
				name,
				ref: name,
				onChange: this.onHeaderCheckChange.bind(this)
			});
		}
		return <Checkbox {...props} />
	}

	/**
	 * 表头选择控件属性
	 */
	headerCheckProps() {
		let name = this.cbName;
		return {name};
	}

	/**
	 * 表体选择控件属性
	 */
	bodyCheckProps(rowIndex, record) {
		let {idName} = this.props;
		let value = idName ? record[idName] : rowIndex;
		let name = `${this.cbName}_${value}`;

		return {name, value};
	}

	/**
	 * 表体选择控件状态变化事件
	 */
	onCheckChange(isCheck, val) {
		let {onCheckChange} = this.props;
		/*if (isCheck) {
			this.selItems[val] = {};
		} else {
			(val in this.selItems) && delete this.selItems[val];
		}*/

		isFunction(onCheckChange) && onCheckChange(isCheck, val);
	}

	/**
	 * 表头选择控件状态变化事件
	 */
	onHeaderCheckChange(isCheck) {
		let {onCheckAll, onUnCheckAll, records} = this.props;
		if (isCheck) {
			records.forEach((record, rowIndex) => {
				let {name} = this.bodyCheckProps(rowIndex, record);
				this.refs[name].check();
			})
			isFunction(onCheckAll) && onCheckAll();
		} else {
			records.forEach((record, rowIndex) => {
				let {name, value} = this.bodyCheckProps(rowIndex, record);
				this.refs[name].uncheck();
			})
			isFunction(onUnCheckAll) && onUnCheckAll();
		}
	}

	//-------------------------------------------------------------------------------------

	/**
	 * 滚动到指定位置
	 */
	scrollTo(pos) {
		try {
			if (!isEmpty(pos)) {
				let el = this.refs.fixBodyCt;
				el && (el.scrollTop = pos);
			}
		} catch (e) {
		}
	}

	/**
	 * 获取滚动条位置
	 */
	getScrollTop() {
		let el = this.refs.fixBodyCt;
		return el ? (el.scrollTop || 0) : 0;
	}
}

assign(Grid, {
	/**
	 * 组件属性定义
	 */
	propTypes: {
		/**
		 * 列元数据
		 * 例：
		 * [
		 *     {
		 *  		name: <string>,
		 *     		label: <string>,
		 *			width: <number/string>,
		 *     		headerCellView: <func>,
		 *			bodyCellView: <func>,
		 *     		headerStyle: <obj>,
		 *     		bodyStyle: <obj>
		 *     },
		 *     ……
		 *  ]
		 */
		columns: PropTypes.array.isRequired,
		/**
		 * 选择列元数据
		 */
		checkColumn: PropTypes.object,
		/**
		 * 操作列元数据
		 */
		actionColumn: PropTypes.object,
		/**
		 * 列表数据
		 */
		records: PropTypes.array,
		/**
		 * 列表数据中，id字段的名称
		 */
		idName: PropTypes.string,
		/**
		 * 容器宽度
		 */
		width: PropTypes.number,
		/**
		 * 表格borderSpacing样式
		 */
		borderSpacing: PropTypes.number,
		/**
		 * 容器样式
		 */
		ctStyle: PropTypes.object,
		/**
		 * 表头th样式
		 */
		thStyle: PropTypes.object,
		/**
		 * 表体td样式
		 */
		tdStyle: PropTypes.object,
		/**
		 * 表头是否固定，不随滚动条滚动
		 */
		isFixHeader: PropTypes.bool,
		/**
		 * 表头高度
		 */
		headerHeight: PropTypes.number,
		/**
		 * 空数据视图
		 */
		emptyView: PropTypes.func,
		/**
		 * 单行选中状态变化事件
		 */
		onCheckChange: PropTypes.func,
		/**
		 * 全选事件
		 */
		onCheckAll: PropTypes.func,
		/**
		 * 取消全选事件
		 */
		onUnCheckAll: PropTypes.func
	},
	/**
	 * 组件默认属性值
	 */
	defaultProps: {
		borderSpacing: 1
	},
	/**
	 * 选择列属性
	 */
	checkColumn: {
		name: 'checkColName',
		width: 26,
		headerStyle: {padding: 0},
		bodyStyle: {padding: 0},
		headerCellView: function(column){
			return this.checkView();
		},
		bodyCellView: function(value, rowIndex, record){
			return this.checkView(rowIndex, record);
		}
	},
	/**
	 * 操作列
	 */
	actionColumn: {
		name: 'actionColName',
		label: '操作',
		width: 100,
		bodyStyle: {
			padding: '0 18px 0 10px'
		},
		bodyCellView: function(value, rowIndex, record, column){
			let {actions} = column;
			if (!isArray(actions)) {
				return null;
			}

			let isFirstShow = true;
			return actions.map((action, index) => {
				let {label, hide, onClick, href, className, style} = action;
				if (isFunction(hide) && hide(value, rowIndex, record, column)) {
					return null;
				}

				let props = {
					key: `action_${rowIndex}_${index}`,
					onClick: onClick.bind(this, value, rowIndex, record, column),
					href: href || 'javascript:void(0)',
					target: href ? '_blank' : null,
					className: className || 'w-grid-action',
					style: assign(isFirstShow ? {paddingLeft: 0} : {}, style)
				}
				isFirstShow = false;
				return <a {...props}>{label}</a>
			})
		}
	}
});
