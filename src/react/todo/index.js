import commonCls from '../../css/common.css';
import resetCls from '../../css/reset.css';
import todoCls from '../../css/todo.css';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import TodoList from './TodoList';


/**
 * 页面入口
 */
class TodoMain extends Component {
	constructor(props) {
    	super(props);
	}

	render() {
		return <div>
            <TodoList />
		</div>
	}
}

ReactDOM.render(<TodoMain />, document.getElementById('mainCtId'));
