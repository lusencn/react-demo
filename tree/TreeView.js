import ReactDOM from 'react-dom';
import React, {Component, PropTypes} from 'react';

import isArray from '../../lib/is/isArray';
import isDefined from '../../lib/is/isDefined';
import isEmpty from '../../lib/is/isEmpty';
import isFunction from '../../lib/is/isFunction';
import merge from '../../lib/object/merge';
import TreeNode from './TreeNode';
import { SearchBox } from '../SearchBox';

require('./css/treeview.css');

class TreeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seachText: ''
        };
        let { searchable, data } = props;
        if (searchable) {
            /** 数据扁平化，以备搜索 */
            this.dataArr = [];
            this.flattenData(data, this.dataArr);
        }
        /** 渲染的数据 */
        this.dataToRender = data;
        this.handleSearch = this.handleSearch.bind(this);

        /** 保存checkbox选中的节点 */
        this.checkedNodes = [];
        this.handleCheck = this.handleCheck.bind(this);
    }

    render() {
        let data = this.dataToRender;
        let isDataArray = isArray(data), len = isDataArray ? data.length : 0;
        return (
            <div className="tree-view">
                { this.renderSearchbox() }
                {isDataArray ? (len > 0 ?
                    (data.map((dataItem, index) => 
                        <TreeNode {...(this.props) } data={dataItem} key={index} hasNext={index < len - 1} isLast={index === len - 1} isSearchLeaf={(node) => {return node.group == 0}} handleCheck={this.handleCheck }/>)
                    ) : this.renderNoResult()
                ) : <TreeNode {...(this.props) } handleCheck={this.handleCheck }/> }
            </div>
        );
    }
    /**
     * 绘制搜索框
     */
    renderSearchbox() {
        let { searchable, searchPlaceHolder } = this.props;
        return searchable ? (
            <div ref={(ref) => this.searchRef = ref} 
                className="tree-search-box">
                <SearchBox ref={(ref) => this.searchBoxRef = ref} 
                    placeholder={searchPlaceHolder}
                    handleSearch={this.handleSearch}/>
            </div>
        ) : null;
    }
    /**
     * 搜索无结果显示信息
     */
    renderNoResult() {
        let { searchNoresult } = this.props;
        return (<div className="tree-search-noresult">
             <span>{searchNoresult}</span>
        </div>);
    }

    componentDidMount() {
        let { searchable } = this.props;
        if (searchable) {
            let rect = ReactDOM.findDOMNode(this.searchRef).getBoundingClientRect();
            this.searchBoxRef.setWidth(rect.width - 16);
        }
    }
    /**
     * 搜索处理函数
     */
    handleSearch(text) {
        if (isEmpty(text)) {
            this.dataToRender = this.props.data;
        } else {
            let dtr = [], dispT = '', { displayText, searchHandler } = this.props;
            if (isFunction(searchHandler)) { /** 自定义搜索函数 */
                this.dataArr.forEach((dt) => {
                    if (searchHandler(dt, text)) {
                        dtr.push(dt);
                    }
                });
            } else {
                this.dataArr.forEach((dt) => {
                    dispT = isFunction(displayText) ? displayText(dt) : dt[displayText];
                    if (dispT.indexOf(text) !== -1) {
                        dtr.push(dt);
                    }
                });
            }
            this.dataToRender = dtr;
        }
        this.setState({ seachText: text });
    }
    /**
     * 处理checkbox
     */
    handleCheck(node = {}, checked = false) {
        let idx = this.checkedNodes.indexOf(node);
        if (checked) {
            (idx === -1) && this.checkedNodes.push(node);
        } else {
            (idx !== -1) && this.checkedNodes.splice(idx, 1);
        }
    }
    /**
     * 获取checkbox选中的节点
     */
    getCheckedNodes() {
        return this.checkedNodes;
    }
    /**
     * 将树形结构数据扁平化，方便搜索
     */
    flattenData(src, target = []) {
        if (!isDefined(src)) return;
        if (isArray(src)) {
            src.forEach(e => {
                let $e = merge({}, e);
                $e.child = null;
                target.push($e);
                this.flattenData(e.child, target);
            });
        } else {
            let $e = merge({}, src);
            $e.child = null;
            target.push($e);
            this.flattenData(src.child, target);
        }
    }
};

TreeView.propTypes = {
    editable: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.func
    ]),
    checkable: PropTypes.bool,
    displayText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
    ]),
    data: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]).isRequired,
    onClick: PropTypes.func,
    onAfterEdit: PropTypes.func,
    searchPlaceHolder: PropTypes.string,
    searchNoresult: PropTypes.string,
    searchHandler: PropTypes.func
};

TreeView.defaultProps = {
    /** CSS 类 */
    className: '',
    /** 是否可编辑 */
    editable: false,
    /** 是否显示checkbox */
    checkable: false,
    /** 是否显示搜索框 */
    searchable: true,
    /** 显示字段，字段名或函数 */
    displayText: 'text',
    /** 树形组件数据 */
    data: {},
    /** 点击事件 */
    onClick: (node) => { },
    /** 编辑后回调函数 */
    onAfterEdit: (node) => { },
    /** 搜索框占位文字 */
    searchPlaceHolder: '请输入关键字',
    /** 搜索无结果提示 */
    searchNoresult: '无查询结果',
    /** 自定义搜索处理函数 */
    searchHandler: null
};

export default TreeView;