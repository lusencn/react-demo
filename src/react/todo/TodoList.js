import React, {Component, PropTypes} from 'react';
import {listenState} from '../../fe-state/react';
import {loadStoreState} from '../../fe-state/store';
import {TODO_LIST} from '../../state/constant';
import todoState from '../../state/todo';
import GridBody from '../../react-widget/grid/GridBody'

/**
* Todo列表
 */
class TodoList extends Component {
    static propTypes = {
        // 列表当前页数据
        currPageRecords: PropTypes.array,
        // 列表全部记录数
        recordsAllCnt: PropTypes.number
    }

    //-------------------------------------------------------------

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        loadStoreState(TODO_LIST);
    }

    render() {
        let {currPageRecords} = this.props;
        !currPageRecords && (currPageRecords = []);
        let gridProps = {
            columns: [{
                name: 'title',
                label: '标题'
            }, {
                name: 'content',
                label: '内容'
            }],
            records: currPageRecords,
            width: 800
        }
        return <div>
            <GridBody {...gridProps} />
        </div>
    }
    //{//this.itemsView()}

    itemsView() {
        let {currPageRecords} = this.props;
        !currPageRecords && (currPageRecords = []);
        return currPageRecords.map((record, i) => {
            let {title} = record;
            return <div key={i}>{title}</div>
        });
    }
}

export default listenState((listState) => {
    let {currPageRecords, recordsAllCnt} = listState
    return {currPageRecords, recordsAllCnt}
})(TodoList, TODO_LIST);
