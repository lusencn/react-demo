import React, {Component} from 'react';
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
