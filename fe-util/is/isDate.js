/**
 * 是否日期类型
 */
let isDate = function(v) {
	return Object.prototype.toString.apply(v) === '[object Date]';
}
export default isDate;