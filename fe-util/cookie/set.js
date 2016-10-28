import assign from '../object/assign';
/**
 * 设置cookie
 */

// cookie参数
let defaultOptions = {
    path: '/',
    domain: window.location.host
};

// 设置cookie
var set = function(name, value, options) {
    var _options = Object.assign({}, defaultOptions, options);
	(value === null) && (_options.expires = -1);

    if (typeof _options.expires === 'number') {
        var time = new Date();
		time.setDate(time.getDate() + _options.expires);
		_options.expires = time;
    }

    if (window.location.protocol === 'https') {
        _options.secure = true;
    }

    return (document.cookie = [
        encodeURIComponent(name), '=', encodeURIComponent(value),
        _options.expires ? '; expires=' + _options.expires.toUTCString() : '',
        _options.path    ? '; path=' + _options.path : '',
        _options.domain  ? '; domain=' + _options.domain : '',
        _options.secure  ? '; secure' : ''
    ].join(''));
}

/**
 * 删除cookie
 */
var remove = function(name, options) {
    set(name, null, options);
};

/**
 * 清空cookie
 */
var clear = function(options) {
    var rs = document.cookie.match(new RegExp("([^ ;][^;]*)(?=(=[^;]*)(;|$))", "gi"));
    for (var i in rs){
        remove(rs[i], options);
    }
};

export { set, remove, clear };
