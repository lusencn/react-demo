/**
 * 是否是空对象、数组、空字符串
 */
import isArray from './isArray';
import isString from './isString';
import isObject from './isObject';

let isEmpty = function(v, allowEmptyString) {
	if ( (typeof v === 'undefined') || 
		 (v === null) || 
		 (!allowEmptyString ? (isString(v) && v.trim() === '') : false) || 
		 (isArray(v) && v.length === 0) ) {
		return true;
	} else if (isObject(v)) {
		for (var key in v) {
			if (Object.prototype.hasOwnProperty.call(v, key)) {
				return false;
			}
		}
		return true;
	}
	return false;
};
export default isEmpty;