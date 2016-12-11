import {TODO_LIST, TODO_LIST_CONDS, TODO_LIST_LOAD} from 'data/state/constant';
import {toJS} from 'mobx';
import React, {Component, PropTypes} from 'react';
import AreaMask from 'lib/react-widget/AreaMask';
import Grid from 'lib/react-widget/grid/Grid';
import Pagn from 'lib/react-widget/Pagn';
import {listenState} from 'lib/state/store';


/**
* Todo列表
 */
class TodoList extends Component {
    static propTypes = {
        // 列表全部记录数
        allRecordsCnt: PropTypes.number,
        // 列表当前页数据
        currPageRecords: PropTypes.array,
        // 加载列表方法
        loadList: PropTypes.func,
        // 列表每页最多显示记录数
        pageSize: PropTypes.number,
        // 列表当前页第一条记录在完整列表中的索引位置（从0开始计数）
        startIndex: PropTypes.number,
        // 更新列表筛选条件方法
        updateListConds: PropTypes.func
    }

    constructor(props) {
        super(props);

        this.fn = {
            onLoadingChange: this.onLoadingChange.bind(this),
            onPagnChange: this.onPagnChange.bind(this)
        }
    }

    componentDidMount() {
        let {loadList} = this.props;
        loadList();
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
        let {pageSize, allRecordsCnt, startIndex} = this.props;
        let pagnProps = {
            currPage: (startIndex / pageSize) + 1,
            onPagnChange: this.fn.onPagnChange,
            pageSize,
            recordCnt: allRecordsCnt
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
        let {pageSize, updateListConds} = this.props;
        updateListConds({
            startIndex: (nextPagnNo - 1) * pageSize
        });
    }
}

/**
 * 加载中遮罩
 */
const LoadingMask = listenState(listLoadStore => {
	let {loading} = listLoadStore;
	return {loading}
})(AreaMask, TODO_LIST_LOAD);

export default listenState((listStore, listCondsStore) => {
    let {allRecordsCnt, currPageRecords, load} = listStore;
    let {pageSize, startIndex, update} = listCondsStore;
    return {
        pageSize, allRecordsCnt, startIndex,
        currPageRecords: currPageRecords ? toJS(currPageRecords).slice() : currPageRecords,
        loadList: load,
        updateListConds: update.bind(listCondsStore)
    }
})(TodoList, TODO_LIST, TODO_LIST_CONDS);
