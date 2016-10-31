import equals from '../fe-util/object/equals';
import {getStoreEventEmitter, getStoreState} from 'store';
import isEmpty from '../fe-util/is/isEmpty';
import React, {Component} from 'react';

//====================================
// 监听React视图状态变化
//====================================

/**
 * 监听React组件用到的全局状态变化
 */
export let listenState = (mapResultToProps) => {
    return (ViewComp, ...stateNames) => {
        /**
         * 包装React ViewComp组件的容器，实现对视图组件状态变化的监听
         */
        return class ContainerComp extends Component {
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

                this.updateFn = (() => this.forceUpdate()).bind(this);
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
             * 挂载容器组件
             */
            componentDidMount() {
            	// 获取stateNames对应的全局状态的更新事件监听器
                stateNames.forEach(name => {
                    let eventEmitter = getStoreEventEmitter(name);
                    eventEmitter && eventEmitter.on('update', this.updateFn);
                });
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

            /**
             * 卸载容器组件
             */
            componentWillUnmount() {
                // 获取stateNames对应的全局状态的更新事件监听器
                stateNames.forEach(name => {
                    let eventEmitter = getStoreEventEmitter(name);
                    eventEmitter && eventEmitter.off('update', this.updateFn);
                });
            }

            /**
             * 渲染ViewComp组件
             */
            render() {
                let storeStates = [];
                stateNames.forEach(name => {
                    let state = getStoreState(name);
                    state && storeStates.push(state);
                });

                let {compRef} = this.props;
            	return <ViewComp {...mapResultToProps(...storeStates)} {...this.realProps} ref={compRef}>
            		{this.props.children}
            	</ViewComp>
            }
        }
    }
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
