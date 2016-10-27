import isObject from '../is/isObject';
import isArray from '../is/isArray';


/**
 * 将source对象的属性，深拷贝到targe（数组直接覆盖复制）
 */            
export default function assignDeep(target = {}, ...sources) {
    for (let sourceObj of sources) {
        for (let prop in sourceObj) {
            if (sourceObj.hasOwnProperty(prop)) {
                if (isObject(sourceObj[prop])) {
                    !isObject(target[prop]) && (target[prop] = {}); 
                    target[prop] = assignDeep(target[prop], sourceObj[prop]);
                } else {
                    target[prop] = sourceObj[prop];
                }
            }
        }
    }
    return target;
}