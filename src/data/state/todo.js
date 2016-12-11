import {listReq} from '../comm/todo';
import {defineStore, getStore} from 'lib/state/store';
import isEmpty from 'lib/utils/is/isEmpty';
import {TODO_LIST, TODO_LIST_CONDS, TODO_LIST_LOAD} from './constant';


defineStore(TODO_LIST, {
    state: {
        // 列表总数
        allRecordsCnt: 0,
        // 列表当前页数据（null：表示尚未查询；[]：表示查询结果为空）
        currPageRecords: null
    },
    actions: {
        load: (() => {
            let listAjaxObj = null;
            return () => {
                // 加载列表数据
                listAjaxObj && !listAjaxObj.loaded && listAjaxObj.abort();
                getStore(TODO_LIST_LOAD).update({
                    loading: true
                });

                listAjaxObj = listReq(getStore(TODO_LIST_CONDS)).then(result => {
                    listAjaxObj.loaded = true;

                    let {success, records, total} = result;
                    if (success) {
                        // 加载成功
                        getStore(TODO_LIST).update({
                            allRecordsCnt: total * 1,
                            currPageRecords: isEmpty(records) ? [] : records
                        });
                    }

                    getStore(TODO_LIST_LOAD).update({
                        loading: false
                    });
                });
            }
        })()
    }
});

/**
 * Todo列表查询条件
 */
defineStore(TODO_LIST_CONDS, {
	state: {
		// 每页加载记录数
	    pageSize: 30,
	    // 当前页第一条数据在整个列表的数组位置
	    startIndex: 0,
	    // 查询条件
	    conds: {
	    }
	},
	onBeforeUpdate: newState => {
		if (!('startIndex' in newState)) {
			// 修改筛选条件，未传入startIndex条件时，按startIndex=0查询
			newState.startIndex = 0;
		}
	},
	onAfterUpdate: () => {
        getStore(TODO_LIST).load();
	}
});

/**
 * Todo列表加载状态
 */
defineStore(TODO_LIST_LOAD, {
    state: {
		loading: false
	}
});
