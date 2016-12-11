/**
 * 是否是数字
 */
let isNumber = function(v) {
	return typeof v === 'number' && isFinite(v);
}
export default isNumber;