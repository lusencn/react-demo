import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import AreaMask from 'lib/react-widget/AreaMask';
import Grid from 'lib/react-widget/grid/Grid';
import Pagn from 'lib/react-widget/Pagn';


/**
 * Todo列表
 */
export default class TodoList extends Component {
    static propTypes = {
        // 列表当前页数据
        currPageRecords: PropTypes.array,
        // 列表加载状态
        loading: PropTypes.bool,
        // 列表每页最多显示记录数
        pageSize: PropTypes.number,
        // 列表全部记录数
        recordsAllCnt: PropTypes.number,
        // 列表当前页第一条记录在完整列表中的索引位置（从0开始计数）
        startIndex: PropTypes.number,
        // Redux Action
        actions: PropTypes.object
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
        let {actions} = this.props;
        actions.changeConds({
            startIndex: 0
        });
    }

    render() {
        let {currPageRecords, loading} = this.props;
        return <div className='todo-ct fixed'>
            {currPageRecords != null ? this.gridView() : null}
            {currPageRecords != null ? this.pagnView() : null}
			<AreaMask loading={loading} onLoadingChange={this.fn.onLoadingChange} />
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
        let {pageSize, actions} = this.props;
        let startIndex = (nextPagnNo - 1) * pageSize;
        actions.changeConds({startIndex});
    }
}
