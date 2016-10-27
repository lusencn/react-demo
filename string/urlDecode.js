import isEmpty from '../is/isEmpty';


/**
 *  URL参数转化为json对象
 *  例：urlDecode("foo=1&bar=2")返回{foo: "1", bar: "2"}
 *	urlDecode("foo=1&bar=2&bar=3&bar=4", false)返回{foo: "1", bar: ["2", "3", "4"]}
 */
export default function urlDecode(string, overwrite){
    if (isEmpty(string)) {
        return {};
    }

    let obj = {},
        pairs = string.split('&'),
        name = null,
        value = null;

	pairs.forEach(pair => {
		let index = pair.indexOf('=');
        name = decodeURIComponent(pair.substr(0, index));
        value = decodeURIComponent(pair.substr(index + 1));
        obj[name] = (overwrite || !(name in obj)) ? value : [].concat(obj[name]).concat(value);
	});
    return obj;
};