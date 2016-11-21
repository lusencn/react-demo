import {observer} from 'mobx-react';
import {toJS} from 'mobx';
import React, {Component, PropTypes} from 'react';
import AreaMask from '../../react-widget/AreaMask';
import Grid from '../../react-widget/grid/Grid';
import Pagn from '../../react-widget/Pagn';
import {page, conds, loadingState} from '../state/todo';


/**
* Todo列表
 */
@observer
export default class TodoList extends Component {
    constructor(props) {
        super(props);

        this.fn = {
            onLoadingChange: this.onLoadingChange.bind(this),
            onPagnChange: this.onPagnChange.bind(this)
        }
    }

    componentDidMount() {
        conds.startIndex = 0;
    }

    render() {
        return <div className='todo-ct fixed'>
            {page.currPageRecords != null ? this.gridView() : null}
            {page.currPageRecords != null ? this.pagnView() : null}
			<AreaMask loading={loadingState.loading} onLoadingChange={this.fn.onLoadingChange} />
        </div>
    }

    /**
     * 渲染列表组件
     */
    gridView() {
        let currPageRecords = toJS(page.currPageRecords).slice();

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
        let pagnProps = {
            currPage: (conds.startIndex / conds.pageSize) + 1,
            onPagnChange: this.fn.onPagnChange,
            pageSize: conds.pageSize,
            recordCnt: page.recordsAllCnt
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
        conds.startIndex = (nextPagnNo - 1) * conds.pageSize;
    }
}
