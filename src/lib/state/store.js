import {action, observable, transaction} from 'mobx';
import {observer} from 'mobx-react';
import React, {Component} from 'react';
import {equals, isEmpty} from './utils';


//====================================
// 前端状态管理
//====================================

/**
 * 全局状态相关数据
 */
const stores = {};

/**
 * 定义全局状态
 * @param data
 * 例：
 *  {
 *     state: <object>,
 *     onBeforeUpdate: <function>,
 *     onAfterUpdate: <function>
 *  }
 */
export let defineStore = (name, data) => {
	let {actions, onBeforeUpdate, onAfterUpdate, state} = data;

	// state为被观察的状态
	let store = Object.assign({}, state);

	// update为更新state的方法
	if (actions) {
		for (let key in actions) {
			store[key] = action(actions[key]);
		}
	}
	store['update'] = action(function(arg){
		let newState = {};
		for (let key in state) {
			(key in arg) && (newState[key] = arg[key]);
		}

		transaction(() => {
            onBeforeUpdate && onBeforeUpdate.call(this, newState);
            Object.assign(this, newState)
        });
		onAfterUpdate && onAfterUpdate.call(this);
	});

	stores[name] = observable(store);
};

/**
 * 通过名称获取一个全局状态
 */
export let getStore = (name) => {
    return stores[name] || {};
};

/**
 * 监听React组件用到的全局状态变化
 */
export let listenState = mapResultToProps => (ViewComp, ...stateNames) => {
	// 包装React ViewComp组件的容器，实现对视图组件状态变化的监听
    @observer
    class ContainerComp extends Component {
		constructor(props) {
            super(props);
            this.realProps = this.getRealProps(props);

            // ViewComp通过检查新props和新state决定是否执行组件更新流程
            ViewComp.prototype.shouldComponentUpdate = function(nextProps, nextState) {
            	let result = true;
            	switch (this.stateEqualType) {
            		case STATE_EQUAL_TYPE.NONE:
            			// 不比较
            			break;
            		case STATE_EQUAL_TYPE.DEEP:
            			// 对象深比较
            			result = !equals(getRealProps(this.props), getRealProps(nextProps)) ||
                            !equals(this.state, nextState);
            			break;
            		default:
            			// 对象浅比较
            			result = !equals(this.props, nextProps, true) || !equals(this.state, nextState, true);
            	}
            	return result;
            }
        }

		/**
         * 设置realProps，去掉children值，用于shouldComponentUpdate的比较及传给ViewComp
         */
        getRealProps(props) {
            let realProps = {};
            if (!isEmpty(props)) {
                for (let name in props) {
                    if (name == 'children') {
                        continue;
                    }
                    realProps[name] = props[name];
                }
            }
            return realProps;
        }

		/**
         * 是否检查虚拟DOM状态变化
         */
        shouldComponentUpdate(nextProps, nextState) {
        	if (isEmpty(this.realProps)) {
        		// this.props为空时，ContainerComp组件只再初始渲染是执行渲染流程
        		// 后续不渲染自身，ViewComp的更新通过全局状态的监听事件来执行
        		return false;
        	}

        	// props浅比较，决定是否执行ContainerComp组件的渲染流程
        	let result = !equals(this.realProps, nextProps, true);
            result && (this.realProps = this.getRealProps(nextProps));

            return result;
        }

		render() {
            let stores4Comp = stateNames.map(name => stores[name]);
            let {compRef} = this.props;
        	return <ViewComp {...mapResultToProps(...stores4Comp)} {...this.realProps} ref={compRef}>
        		{this.props.children}
        	</ViewComp>
        }
	}
	return ContainerComp;
};

/**
 * 组件状态比较方式
 */
export const STATE_EQUAL_TYPE = {
    // 不比较
	NONE: 1,
    // 浅比较
	SHALLOW: 2,
    // 深比较
	DEEP: 3
};
