import ajaxEventSource from './event';
import isString from '../is/isString';
import reqwest from 'reqwest';


/**
 * Ajax Post请求
 */
var post = function(params = {}) {
	isString(params) && (params = { url: params });
	params.method = 'POST';
	
	var _params = { data: params.data, method: params.method };
	ajaxEventSource.trigger('beforeAjax', _params);
	params.data = _params.data;

	var csrfReSended = false;
	var promise = new Promise(function(resolve, reject){
		reqwest(params).then(response => { 
			if (csrftokenResendHandle(resolve, reject, params, response, csrfReSended)) {
				csrfReSended = true;
				return;
			}
			resolve(response);
			ajaxEventSource.trigger('afterAjaxSuccess', response);
		}, ...args => {
			if (csrftokenResendHandle(resolve, reject, params, args[0], csrfReSended)) {
				csrfReSended = true;
				return;
			}
			reject(args);
			ajaxEventSource.trigger('afterAjaxFailure', args);
		});
	});
	return promise;
};

/**
 * csrftoken认证失败的重试机制
 */
var context = window || this;
var csrftokenResendHandle = function(resolve, reject, params, response, csrfReSended) {
	if (context && !context.csrftokenResend) {
		// 没有csrftoken认证失败的重试机制
		return false;
	}
	var ajax = context.csrftokenResend(response, csrfReSended);
	if (!ajax) {
		// 没有csrftoken认证失败
		return false;
	}
	// csrftoken认证失败，已发出更新csrftoken的请求
	ajax.then(response => {
		if (response) {
			// csrftoken更新成功，post请求重试一次
			var _params = { data: params.data, method: params.method };
			ajaxEventSource.trigger('beforeAjax', _params);
			params.data = _params.data;

			reqwest(params).then(response => {
				resolve(response);
				ajaxEventSource.trigger('afterAjaxSuccess', response);
			}, ...args => {
				reject(args);
				ajaxEventSource.trigger('afterAjaxFailure', args);
			});
		} else {
			// csrftoken更新失败
			reject();
			ajaxEventSource.trigger('afterAjaxFailure');
		}
	}, ...args => {
		// csrftoken更新失败
		reject();
		ajaxEventSource.trigger('afterAjaxFailure');
	});
	
	return true;	
};

export { post };