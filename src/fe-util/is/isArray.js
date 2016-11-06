/**
 * 是否是数组
 */
let isArray = function(v) {
	return Object.prototype.toString.apply(v) === '[object Array]';
}
export default isArray;