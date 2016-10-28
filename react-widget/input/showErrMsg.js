/**
 * 显示错误信息
 */
import { Toast } from '../Toast';

var showErrMsg = function(message) {
	//alert(message);
	Toast.show(message);
};

export default showErrMsg;