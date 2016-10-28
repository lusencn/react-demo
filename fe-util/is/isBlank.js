/**
 * 是否是空对象、数组、空白字符串
 */
import isEmpty from './isEmpty';

let isBlank = function(v) {
	return isEmpty(v) ? true : isEmpty(String(v).replace(/^\s+|\s+$/g, ''));
}
export default isBlank;