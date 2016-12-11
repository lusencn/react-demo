/**
 * 是否是函数
 */
let isFunction = function(v) {
	return Object.prototype.toString.apply(v) === '[object Function]';
}
export default isFunction;