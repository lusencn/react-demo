import * as types from '../constants/actionType'
import {listReq} from '../../comm/todo';
import isEmpty from '../../fe-util/is/isEmpty';

/**
 * 列表查询条件变化
 */
export const changeConds = (newConds) => {
    return (dispatch, getState) => {
        dispatch(updateConds(newConds));
        loadPage(dispatch, Object.assign({}, getState().todo.conds, newConds));
    }
}

/**
 * 查询列表数据
 */
let listAjaxObj = null;
const loadPage = (dispatch, conds) => {
    // 加载列表数据
    listAjaxObj && !listAjaxObj.loaded && listAjaxObj.abort();
    dispatch(updateLoadingState(true));

    listAjaxObj = listReq(conds).then(result => {
        listAjaxObj.loaded = true;

        let {success, records, total} = result;
        if (success) {
            // 加载成功
            dispatch(updatePage({
                recordsAllCnt: total * 1,
                currPageRecords: isEmpty(records) ? [] : records
            }));
        }

        dispatch(updateLoadingState(false));
    });
}

const updateConds = conds => ({type: types.TODO_PAGE_CONDS, conds});

const updateLoadingState = loading => ({type: types.TODO_PAGE_LOADING, loading});

const updatePage = page => ({type: types.TODO_PAGE, page});
