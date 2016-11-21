import {observable, autorun} from 'mobx';
import {listReq} from '../../comm/todo';
import isEmpty from '../../fe-util/is/isEmpty';

//==================================
// Todo状态数据
//==================================

/**
 * Todo列表
 */
export let page = observable({
    /**
     * 列表客户总数
     */
    recordsAllCnt: 0,
    /**
     * 客户列表当前页数据（null：表示尚未查询；[]：表示查询结果为空）
     */
    currPageRecords: null
});

/**
 * Todo列表查询条件
 */
export let conds = observable({
    /**
     * 每页加载记录数
     */
    pageSize: 30,
    /**
     * 当前页第一条数据在整个列表的数组位置
     */
    startIndex: 0
});

/**
 * Todo列表加载状态
 */
export let loadingState = observable({
    loading: false
});

/**
 * 加载Todo列表
 */
let listAjaxObj = null;
export let loadPage = () => {
    // 加载列表数据
    listAjaxObj && !listAjaxObj.loaded && listAjaxObj.abort();
    loadingState.loading = true;

    listAjaxObj = listReq(conds).then(result => {
        listAjaxObj.loaded = true;

        let {success, records, total} = result;
        if (success) {
            // 加载成功
            page.recordsAllCnt = total * 1;
            page.currPageRecords = isEmpty(records) ? [] : records;
        }

        loadingState.loading = false;
    });
};

autorun(() => {
    loadPage();
})
