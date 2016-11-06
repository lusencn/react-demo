import ReactDOM from 'react-dom';
import React, {Component} from 'react';

import cls from './css/loading.css';

/**
 * 加载中遮罩
 */
class Loading extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div ref={(ref) => this.el = ref} className="w-loading">
                <img src="/images/loading.gif"/>
                <div className="w-loading-text">{this.props.text}</div>
                <div className="w-loading-bg"></div>
            </div>
        );
    }

    static show(text = '') {
        let lc = document.getElementById('w-loading-container');
        if (lc) {
            ReactDOM.unmountComponentAtNode(lc);
            document.body.removeChild(lc);
        }
        lc = document.createElement('div');
        lc.className = 'w-loading-container';
        lc.setAttribute('id', 'w-loading-container');
        document.body.appendChild(lc);
        ReactDOM.render(<Loading text={text}/>, lc);
        let mask = document.createElement('div');
        mask.className = 'w-loading-mask';
        lc.appendChild(mask);
    }

    static close() {
        let lc = document.getElementById('w-loading-container');
        if (lc) {
            ReactDOM.unmountComponentAtNode(lc);
            document.body.removeChild(lc);
        }
    }
}

Loading.defaultProps = {
    text: ''
};

export {Loading}
