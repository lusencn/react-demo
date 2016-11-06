import isString from '../is/isString';
import ajaxEventSource from './event';
import reqwest from 'reqwest';

/**
 * Ajax Get请求
 */
let get = function(params = {}) {
	isString(params) && (params = { url: params });

	var _params = { data: params.data, method: 'GET' };
	ajaxEventSource.trigger('beforeAjax', _params);
	params.data = _params.data;

	return reqwest(params).then(response => { 
		ajaxEventSource.trigger('afterAjaxSuccess', response);
		return response;
	}, ...args => {
		ajaxEventSource.trigger('afterAjaxFailure', args);
		return args[0];
	});
}
export { get };