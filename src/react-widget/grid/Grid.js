import cls from './css/grid.css';

import React, {Component, PropTypes} from 'react';
import {isEmpty, isFunction, isNumber} from '../utils';
import GridCell from './GridCell';


/**
 * 列表组件
 */
export default class Grid extends Component {
    /**
	 * 组件参数
	 */
    static propTypes = {
        // 列表border宽度
        borderSpacing: PropTypes.number,
        // 列属性
        // 例：[{
        //      bodyCellStyle: <表体单元格样式（object）>,
        //      bodyCellView: <表体单元格视图（func）>,
        //      bodyTdStyle: <表体Td元素样式（object）>,
        //      headerCellStyle: <表头单元格样式（object）>,
        //      headerCellView: <表头单元格视图（func）>,
        //      headerTdStyle: <表头Td元素样式（object）>,
        //      label: <显示名称（必选）>,
        //      name: <字段名称（必选）>,
        //      width: <宽度>
        //  }, ……]
        columns: PropTypes.array.isRequired,
        // 列表空数据视图
        emptyView: PropTypes.func,
        // 表头高度
        headerHeight: PropTypes.number,
        // 表头是否固定，不随滚动条滚动
        isFixHeader: PropTypes.bool,
        // 列表数据
        records: PropTypes.array.isRequired,
        // 列表容器样式
        style: PropTypes.object,
        // 列表容器宽度
        width: PropTypes.number
    }

    /**
	 * 组件默认属性值
	 */
	static defaultProps = {
		borderSpacing: 1,
        headerHeight: 30
	}

    //--------------------------------------------------------------------------

	constructor(props) {
    	super(props);
	}

    render() {
        this.initStyle();
        return <div className='w-grid-ct' style={this.ctStyle}>
			{this.headerView()}
			{this.bodyView()}
		</div>
    }

    /**
     * 设置样式
     */
    initStyle() {
        let {borderSpacing, headerHeight, isFixHeader, style, width} = this.props;

        // 列表容器样式
        this.ctStyle = Object.assign({}, isFixHeader ? {position: 'relative'} : null, style, {
    		width: width
    	});

        // 表头悬浮显示时，表体容器样式
        isFixHeader && (this.fixedCtStyle = {
		    top: (headerHeight || 30) + 'px'
		});

        // 表头/表体table样式
        this.tableStyle = {
			width: width,
			borderSpacing: borderSpacing || 1
		};

        this.calColWidth();
    }

    /**
	 * 计算未设置width值的列的宽度（如果有列设置width为百分数，或width设置不规范，则不执行该计算）
	 */
	calColWidth() {
		this.calColWidthVal = 'auto';

		let {borderSpacing, columns, width} = this.props;
		if (!width || !isNumber(width)) {
			return;
		}
		if (columns == null) {
			return;
		}

        // 是否计算每列宽度
		let isNoCal = false;
        // 未设置宽度的列的数量
		let noWidthCnt = 0;
        // 用于平均计算的宽度值
		let minusResult = width - (columns.length + 1) * (borderSpacing || 1);
		columns.some(column => {
			let itemWidth = column.width;
			if (!itemWidth) {
				noWidthCnt++;
				return false;
			}
			if (itemWidth && (itemWidth *= 1) && !isNumber(itemWidth)) {
                // 有列设置了非数字的宽度，导致无法为每列计算宽度
				isNoCal = true;
				return true;
			}
			minusResult -= itemWidth;
		});

		if (!isNoCal && noWidthCnt) {
			this.calColWidthVal = minusResult / noWidthCnt
		}
		(this.calColWidthVal <= 0) && (this.calColWidthVal = 'auto');
	}

    /**
     * 表头视图
     */
    headerView() {
        return <div className="w-grid-table" style={this.tableStyle}>
			{this.rowView({}, -1)}
		</div>
    }

    /**
     * 表体视图
     */
    bodyView() {
        let {isFixHeader, records} = this.props;
        let fixedCtProps = {};
        isFixHeader && (fixedCtProps = {
            className: 'w-grid-fix',
            style: this.fixedCtStyle
        })

		return <div {...fixedCtProps}>
            <div className="w-grid-table" style={this.tableStyle}>
    			{isEmpty(records) ? this.emptyView() :
    				records.map((record, rowIndex) => this.rowView(record, rowIndex))}
    		</div>
        </div>
    }

    /**
	 * 表格行视图
	 */
	rowView(record, rowIndex) {
		let {columns} = this.props;
		let trProps = {
            className: 'w-grid-tr',
            key: `gridRow_${rowIndex}`
        }

		return <ul {...trProps}>
			{columns.map(column => {
                let {
                    name, width, headerCellView, bodyCellView,
                    headerCellStyle, bodyCellStyle, headerTdStyle, bodyTdStyle
                } = column;
                width = width || this.calColWidthVal;
                let isHeader = this.isHeaderRow(rowIndex);

                let tdProps = {
                    className: isHeader ? 'w-grid-th' : 'w-grid-td',
        			key: `gridHeader_${name}`,
        			style: Object.assign({}, isHeader ? headerTdStyle : bodyTdStyle,
                        width ? {width} : null)
        		}
                let cellProps = {
                    column, record, rowIndex, width,
                    cellView: isHeader ? headerCellView : bodyCellView,
                    style: isHeader ? headerCellStyle : bodyCellStyle
                }
                return <li {...tdProps}><GridCell {...cellProps} /></li>
            })}
		</ul>
	}

    /**
     * 是否是表头行
     */
    isHeaderRow(rowIndex) {
        return rowIndex < 0
    }

    /**
     * 通过rowIndex判断，获取表头或表体的视图信息
     */
    headerOrBodyInfo(colInfo, name, rowIndex) {
        if (!colInfo) {
            return null;
        }

        let {body, header} = colInfo;
        !body && (body = {});
        !header && (header = {});
        return rowIndex >= 0 ? body[name] : header[name];
    }

	/**
	 * 空数据视图
	 */
	emptyView() {
		let {emptyView} = this.props;
		return isFunction(emptyView) ? emptyView() :
			<div className="w-grid-empty"><i className="i-empty"></i></div>
	}
}
