import isEmpty from '../is/isEmpty';
import isFunction from '../is/isFunction';
import assign from '../object/assign';


/**
 * 将target增加事件源的功能
 */
export default function source(target) {
	let allListeners = {};
	let allEvents = {};

	return assign(target, {
		/**
		 * 获取一个事件的监听者集合
		 */
		getListeners: function(name, isInit = false) {
			let oneListeners = allListeners[name];
			if (!oneListeners && isInit) {
				oneListeners = allListeners[name] = [];
			}
			return oneListeners;
		},
		/**
		 * 为事件源添加事件监听者
		 */
		on: function(name, listener) {
			if (isEmpty(name) || !isFunction(listener)) {
				return this;
			}
			
			this.getListeners(name, true).push(listener);
			return this;
		},
		/**
		 * 为事件源注销事件监听者
		 */
		off: function(name, listener) {
			let listeners = this.getListeners(name);
			if (isEmpty(listeners)) {
				return this;
			}

			if (!listener) {
				listeners.length = 0;
			} else {
				let index = listeners.indexOf(listener);
				(index >= 0) && (listeners.splice(index, 1));
			}

			return this;
		},
		/**
		 * 派发事件
		 */
		trigger: function(name, ...args) {
			let listeners = this.getListeners(name);
			if (isEmpty(listeners)) {
				return this;
			}

			listeners.forEach(function(listener){
				listener.apply(null, [].concat({name}).concat(args));
			});

			return this;
		},
		/**
		 * 派发事件后注销
		 */
		once: function(name, ...args) {
			this.trigger(name, args);
			this.off(name);

			return this;
		},
		test: function(name) {
			let listeners = this.getListeners(name);
			return listeners.length;
		}
	});
};