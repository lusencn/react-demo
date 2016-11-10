import React, {Component, PropTypes} from 'react';
import {isArray, isFunction, isObject} from '../utils';

/**
 * 列表单元格视图
 */
export default class GridCell extends Component {
    static propTypes = {
        // 单元格内容视图
        cellView: PropTypes.func,
        // 列元数据
        column: PropTypes.object.isRequired,
        // 单元格所在行的数据
        record: PropTypes.object.isRequired,
        // 单元格在整个列表中的行次（第一行数据的rowIndex为0，往下累加。表头rowIndex为-1）
        rowIndex: PropTypes.number.isRequired,
        // 单元格样式
        style: PropTypes.object,
        // 单元格宽度
        width: PropTypes.number
    }

    constructor(props) {
    	super(props);
	}

    render() {
        let {column, record, rowIndex, style, width} = this.props;
        if (column == null) {
			return null;
		}

		// 单元格内容
		let value = rowIndex >= 0 ? record[column.name] : column.label;
		let content = this.cellView(value);

        // 表格元素标签属性
		let boxProps = {
			className: 'w-grid-box',
			style: Object.assign({}, width ? {width} : null),
            title: (isObject(content) || isArray(content)) ?
				((isObject(value) || isArray(value)) ? null : value) : content,
		}
		let contentProps = {
			className: 'w-grid-content',
			style: Object.assign({}, style)
		}

        return <div {...boxProps}><div {...contentProps}>{content}</div></div>
    }

    /**
     * 单元格视图
     */
    cellView(value) {
        let {cellView, column, record, rowIndex} = this.props;
        return isFunction(cellView) ? cellView(value, rowIndex, record, column) : value;
    }
}
