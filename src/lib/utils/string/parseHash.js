import isEmpty from '../is/isEmpty';
import urlDecode from './urlDecode';


/**
 * 解析hash url
 */
export default function parseHash(hash) {
	if (isEmpty(hash)) {
		return null;
	}

	let hashArr = hash.split('\?'),
		hashNav = hashArr[0],
		queryParams = hashArr.length >= 2 ? urlDecode(hashArr[1]) : null;
	return {
		path: hashNav,
		pathItem: hashNav.split('\/').filter(item => {
			return !isEmpty(item);
		}),
		query: queryParams
	};
}