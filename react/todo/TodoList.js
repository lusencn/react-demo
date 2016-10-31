import {listenState} from '../../fe-state/store';
import React, {Component} from 'react';

/**
 * 列表
 */
class TodoList extends Component {
	constructor(props) {
    	super(props);
	}

	render() {
		return <div>
            {this.itemsView()}
		</div>
	}

    itemsView() {
        let {records} = this.props;
        return records.map(record => {
            let {title} = record;
            return <div>{title}</div>
        });
    }
}

export default listenState((listState) => {
    let {currPageRecords, recordsAllCnt} = listState
    return {
		currPageRecords,
		recordsAllCnt
	}
})(TodoList, TODO_LIST);
