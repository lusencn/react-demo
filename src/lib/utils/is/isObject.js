/**
 * 是否是对象
 */
let isObject = function(value) {
	if (Object.prototype.toString.call(null) === '[object Object]') {
		return value !== null && value !== undefined && Object.prototype.toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
	} else {
		return Object.prototype.toString.call(value) === '[object Object]';
	}
};
export default isObject;