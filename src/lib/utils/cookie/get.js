/**
 * 获取Cookie
 */
var get = function(name) {
	var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)"),
    	m = window.document.cookie.match(r);
    return (!m ? "" : decodeURIComponent(m[1]));
}

export { get };