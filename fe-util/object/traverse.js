import isArray from '../is/isArray';
import isObject from '../is/isObject';
import isEmpty from '../is/isEmpty';
import isFunction from '../is/isFunction';

/**
 * 深遍历对象/数组
 */
export default function traverse(target = {}, fn) {
    if (!isFunction(fn)) {
        throw Error('parameter fn must be a function!');
    }
    if (isArray(target)) {
        for (let ele of target) {
            fn(ele);
            if (isObject(target[ele]) || isArray(target[ele])) {
                traverse(target[ele], fn);
            }
        }
    } else if (isObject(target)) {
        for (let key in target) {
            if (target.hasOwnProperty(key)) {
                fn(target[key], key);
                if (isObject(target[key]) || isArray(target[key])) {
                    traverse(target[key], fn);
                }
            }
        }
    }
};
