import React, {Component} from 'react';
import {listenState} from '../../fe-state/react';
import {loadStoreState} from '../../fe-state/store';
import {TODO_LIST} from '../../state/constant';

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
		return <div>
            {this.itemsView()}
		</div>
	}

    itemsView() {
        let {currPageRecords} = this.props;
        return currPageRecords.map(record => {
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
