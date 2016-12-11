import isArray from '../is/isArray';
import isObject from '../is/isObject';

/**
 * 将source对象的属性，深拷贝到target（数组合并）
 */            
export default function merge(target = {}, ...sources) {
    for (let index in sources) {
        let sourceObj = sources[index];
        for (let prop in sourceObj) {
            if (sourceObj.hasOwnProperty(prop)) {
                if (isObject(sourceObj[prop])) {
                    target[prop] = merge(target[prop], sourceObj[prop]);
                } else if (isArray(sourceObj[prop])) {
                    if (!isArray(target[prop])) {
                        target[prop] = [];
                    }
                    target[prop] = merge(target[prop], sourceObj[prop]);
                } else {
                    target[prop] = sourceObj[prop];
                }
            }
        }
    }
    return target;
}
