import commonCls from '../../css/common.css';
import resetCls from '../../css/reset.css';
import todoCls from '../../css/todo.css';

import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk'
import reducers from '../reducers/index';
import Container from './Container';

const store = compose(applyMiddleware(thunk))(createStore)(reducers);

render(
    <Provider store={store}>
        <Container />
    </Provider>,
    document.getElementById('mainCtId')
);
