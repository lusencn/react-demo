import React, {Component, PropTypes} from 'react';
import {listenState} from '../state/react';
import {loadStoreState, updateStoreState} from '../state/store';
import {TODO_LIST, TODO_LIST_CONDS, TODO_LIST_LOAD} from '../state/constant';
import todoState from '../state/todo';
import AreaMask from 'lib/react-widget/AreaMask';
import Grid from 'lib/react-widget/grid/Grid';
import Pagn from 'lib/react-widget/Pagn';


/**
* Todo列表
 */
class TodoList extends Component {
    static propTypes = {
        // 列表当前页数据
        currPageRecords: PropTypes.array,
        // 列表每页最多显示记录数
        pageSize: PropTypes.number,
        // 列表全部记录数
        recordsAllCnt: PropTypes.number,
        // 列表当前页第一条记录在完整列表中的索引位置（从0开始计数）
        startIndex: PropTypes.number
    }

    //--------------------------------------------------------------------------

    constructor(props) {
        super(props);

        this.fn = {
            onLoadingChange: this.onLoadingChange.bind(this),
            onPagnChange: this.onPagnChange.bind(this)
        }
    }

    componentDidMount() {
        loadStoreState(TODO_LIST);
    }

    render() {
        let {currPageRecords} = this.props;
        return <div className='todo-ct fixed'>
            {currPageRecords != null ? this.gridView() : null}
            {currPageRecords != null ? this.pagnView() : null}
			<LoadingMask onLoadingChange={this.fn.onLoadingChange} />
        </div>
    }

    /**
     * 渲染列表组件
     */
    gridView() {
        let {currPageRecords} = this.props;
        let gridProps = {
            columns: [{
                name: 'title',
                label: '标题',
                bodyCellStyle: {'textAlign': 'left'}
            }, {
                name: 'content',
                label: '内容',
                bodyCellStyle: {'textAlign': 'left'}
            }],
            isFixHeader: true,
            records: currPageRecords,
            width: 800
        }
        return <Grid {...gridProps} />
    }

    /**
     * 渲染翻页组件
     */
    pagnView() {
        let {pageSize, recordsAllCnt, startIndex} = this.props;
        let pagnProps = {
            currPage: (startIndex / pageSize) + 1,
            onPagnChange: this.fn.onPagnChange,
            pageSize,
            recordCnt: recordsAllCnt
        }
        return <Pagn {...pagnProps} />
    }

    //--------------------------------------------------------------------------

    /**
     * 列表数据加载状态变化
     */
    onLoadingChange(loading) {
        if (loading) {
			return;
		}
        window.scrollTo(0, 0);
    }

    /**
     * 列表当前页条件变化
     */
    onPagnChange(nextPagnNo) {
        let {pageSize, recordsAllCnt, startIndex} = this.props;
        updateStoreState(TODO_LIST_CONDS, {
            startIndex: (nextPagnNo - 1) * pageSize
        })
    }
}

/**
 * 加载中遮罩
 */
const LoadingMask = listenState(listLoad => {
	let {loading} = listLoad;
	return {loading}
})(AreaMask, TODO_LIST_LOAD);

export default listenState((listState, listCondsState) => {
    let {currPageRecords, recordsAllCnt} = listState;
    let {pageSize, startIndex} = listCondsState;
    return {currPageRecords, pageSize, recordsAllCnt, startIndex}
})(TodoList, TODO_LIST, TODO_LIST_CONDS);
