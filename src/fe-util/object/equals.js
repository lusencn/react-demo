import isDate from '../is/isDate';
import isObject from '../is/isObject';
import isArray from '../is/isArray';
import isEmpty from '../is/isEmpty';
import isDefined from '../is/isDefined';


/**
 * 比较target和source是否相等
 * @param isShallowEqual 对象是否浅比较
 */
export default function equals(target, source, isShallowEqual = false) {
    if (target == source) {
        return true;
    }

    if (!isDefined(target) || !isDefined(source)) {
        return !isDefined(target) && !isDefined(source);
    } else if (isDate(target) && isDate(source)) {
        return target.getTime() === source.getTime();
    } else if (isArray(target) && isArray(source)) {
        if (target.length !== source.length) {
            return false;
        } else {
            for (let i = 0; i < target.length; i++) {
                if (!equals(target[i], source[i]), isShallowEqual) {
                    return false;
                }
            }
            return true;
        }
    } else if (isObject(target) && isObject(source)) {
        if (Object.getOwnPropertyNames) {
            let cnts = [target, source].map(item => (Object.getOwnPropertyNames(item) || []).length);
            if (cnts[0] !== cnts[1]) {
                return false;
            }
        }
        for (let o in target) {
            if (target.hasOwnProperty(o) && source.hasOwnProperty(o)) {
                if (isShallowEqual) {
                    if (target[o] !== source[o]) {
                        return false;
                    }
                } else if (!equals(target[o], source[o], isShallowEqual)) {
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    }

    return false;
}
