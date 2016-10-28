import source from '../lib/event/source';

//====================================
// 监听全局状态变化事件相关
//====================================

/**
 * 全局状态相关数据
 * 例：
 *  {
 *     state: <object>,
 *     eventSource: <function>,
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
	store[name] = assign({
		eventSource: source({})
	}, data);
};
