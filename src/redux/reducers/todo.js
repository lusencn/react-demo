import * as types from '../constants/actionType';

let initTodoState = {
    // 列表客户总数
    page: {
        // 列表客户总数
        recordsAllCnt: 0,
        // 客户列表当前页数据（null：表示尚未查询；[]：表示查询结果为空）
        currPageRecords: null
    },
    // Todo列表查询条件
    conds: {
        // 每页加载记录数
        pageSize: 30,
        //  当前页第一条数据在整个列表的数组位置
        startIndex: 0
    },
    // Todo列表加载状态
    loadingState: {
        loading: false
    }
}

export default function todo(state = {}, action) {
    let oldTodoState = state || {};
    let newTodoState = initTodoState;
    switch (action.type) {
        case types.TODO_PAGE_CONDS:
            newTodoState = {
                ...oldTodoState,
                conds: Object.assign({}, oldTodoState.conds, action.conds)
            }
            break;
        case types.TODO_PAGE_LOADING:
            newTodoState = {
                ...oldTodoState,
                loadingState: {loading: action.loading}
            }
            break;
        case types.TODO_PAGE:
            newTodoState = {
                ...oldTodoState,
                page: Object.assign({}, oldTodoState.page, action.page)
            }
            break;
    }

    return newTodoState;
}
