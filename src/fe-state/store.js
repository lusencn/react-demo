import EventEmitter from 'EventEmitter2';
import isEmpty from '../fe-util/is/isEmpty';

//====================================
// 前端状态管理
//====================================

/**
 * 全局状态相关数据
 * 例：
 *  {
 *     state: <object>,
 *     eventEmitter: <object>,
 *     load: <function>,
 *     onBeforeUpdate: <function>,
 *     onAfterUpdate: <function>
 *  }
 */
const store = {};

/**
 * 定义全局状态
 */
export let defineStore = (name, data) => {
	store[name] = Object.assign({
		eventEmitter: new EventEmitter()
	}, data);
};

/**
 * 通过名称获取一个全局状态相关数据
 */
let getStoreProp = (name, propName) => {
    let storeItem = store[name] || {};
    return storeItem[propName];
};

/**
 * 获取全局状态state
 */
export let getStoreState = (name) => {
    return getStoreProp(name, 'state');
};

/**
 * 获取全局状态对应的eventEmitter
 */
export let getStoreEventEmitter = (name) => {
    return getStoreProp(name, 'eventEmitter');
};

/**
 * 加载name对应的全局状态state
 */
export let loadStoreState = (name) => {
    let load = getStoreProp(name, 'load');
    load && load();
};

/**
 * 更新全局状态state
 */
export let updateStoreState = (name, newState) => {
	let storeItem = store[name] || {};
	if (isEmpty(storeItem)) {
		return false;
	}

    let {state, eventEmitter, onBeforeUpdate, onAfterUpdate} = storeItem;
    onBeforeUpdate && onBeforeUpdate(newState);
	Object.assign(state, newState);
	eventEmitter.emit('update');
    onAfterUpdate && onAfterUpdate(state);

	return true;
};
