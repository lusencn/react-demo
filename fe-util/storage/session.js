import uuid from '../string/uuid';

//======================================
// 浏览器本地存储（生命周期为会话）
//======================================


let sessionStorage = window.sessionStorage;

/**
 * 存储key的前缀
 */
export const keyPrefix = 'sesStorageKeyPrefix';

/**
 * 获取本地存储
 */
export let getSesCache = function(key) {
	if (!sessionStorage) {
		return null;
	}
	try {
		let result = JSON.parse(sessionStorage.getItem(key) || null);
		if (result && result.data) {
			return result.data;
		}
	} catch (e) {
	}
	return null;
}

/**
 * 设置本地存储
 */
export let setSesCache = function(key, data) {
	let str = '';
	try {
		str = JSON.stringify({
			data: data
		});
	} catch (e) {
		return false;
	}
	return setSesStr(key, str);
}

/**
 * 设置本地存储
 */
export let setSesStr = function(key, str) {
	let result = true;
	try {
		sessionStorage.setItem(key, str);
	} catch (e) {
		result = false;
		if (e.name == 'QuotaExceededError') {
			// 超出存储大小限制
		}
	}
	return result;
}

/**
 * 删除存储
 */
export let removeSesCache = function(key) {
	sessionStorage.removeItem(key);
}

/**
 * 清空存储
 */
export let clearSesCache = function() {
	sessionStorage.clear();
}