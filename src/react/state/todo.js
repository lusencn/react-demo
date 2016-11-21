import {listReq} from '../../comm/todo';
import {TODO_LIST, TODO_LIST_CONDS, TODO_LIST_LOAD} from './constant';
import isEmpty from '../../fe-util/is/isEmpty';
import {defineStore, getStoreState, loadStoreState, updateStoreState} from '../../fe-state/store';

/**
 * Todo列表及选中状态数据
 */
defineStore(TODO_LIST, {
	state: {
	    /**
	     * 列表客户总数
	     */
	    recordsAllCnt: 0,
	    /**
	     * 客户列表当前页数据（null：表示尚未查询；[]：表示查询结果为空）
	     */
	    currPageRecords: null
	},
	load: (() => {
		let listAjaxObj = null;
		return () => {
			// 加载列表数据
			listAjaxObj && !listAjaxObj.loaded && listAjaxObj.abort();
			updateStoreState(TODO_LIST_LOAD, {
				loading: true
			});

			listAjaxObj = listReq(getStoreState(TODO_LIST_CONDS)).then(result => {
				listAjaxObj.loaded = true;

				let {success, records, total} = result;
				if (success) {
					// 加载成功
					updateStoreState(TODO_LIST, {
						recordsAllCnt: total * 1,
						currPageRecords: isEmpty(records) ? [] : records
					});
				}

				updateStoreState(TODO_LIST_LOAD, {
					loading: false
				});
			});
		}
	})()
});

/**
 * Todo列表查询条件
 */
defineStore(TODO_LIST_CONDS, {
	state: {
		/**
	     * 每页加载记录数
	     */
	    pageSize: 30,
	    /**
	     * 当前页第一条数据在整个列表的数组位置
	     */
	    startIndex: 0,
	    /**
	     * 查询条件
	     */
	    conds: {
	    }
	},
	onBeforeUpdate: (newState) => {
		if (!('startIndex' in newState)) {
			// 修改筛选条件，未传入startIndex条件时，按startIndex=0查询
			newState.startIndex = 0;
			// 非翻页修改筛选条件，records设置为null，
			// 视图组件通过这个值来判断列表是初始加载还是翻页加载
			let listState = getStoreState(TODO_LIST);
			listState.records = null;
		}
	},
	onAfterUpdate: () => {
        loadStoreState(TODO_LIST);
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
