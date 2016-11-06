import cls from './css/toast.css';

import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';


/**
 * 提示信息组件
 */
class Toast extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.id = (new Date()).getTime();
        this.timerId = 0;
    }

    render() {
        return (
            <div ref={(ref) => this.el = ref} className="w-toast">
                <span className="w-toast-text">{this.props.text}</span>
                <div className="w-toast-mask"></div>
            </div>
        );
    }

    componentDidMount() {
        let pn = this.el.parentNode;
        if (pn) {
            let id = pn.getAttribute('id');
            if (!id) {
                pn.setAttribute('id', 'w_toast_' + this.id);
            }
        }

        var rect = this.el.getBoundingClientRect();
        var winWidth = window.innerWidth ||
			(document.documentElement && document.documentElement.clientWidth) || document.body.clientWidth,
            winHeight = window.innerHeight ||
    			(document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight;
        var pageYOffset = self.pageYOffset ||  document.documentElement.scrollTop,
        	widthspace = (winWidth - rect.width),
            heightspace = (winHeight - rect.height);
        widthspace < 0 && (widthspace = 0);
        heightspace < 0 && (heightspace = 0);
        this.el.style.left = ((widthspace / 2 - 2) < 0 ? 0 : (widthspace / 2 - 2)) + 'px';
        this.el.style.top = ((heightspace / 2 - 2) < 0 ? 0 : (heightspace / 2 - 2)) + 'px';

        this.timerId = setTimeout(function(pn) {
            ReactDOM.unmountComponentAtNode(pn);
            clearTimeout(this.timerId);
            this.timerId = 0;
        }.bind(this, pn), this.props.duration);
    }

    componentWillUnmount() {
        let pn = this.el.parentNode;
        if (pn) {
            let tId = setTimeout(function() {
                clearTimeout(tId);
                tId = 0;
                document.body.removeChild(pn);
            }.bind(this), 500);
        }
    }

    static show(text = '', duration = 3000) {
        let el = <Toast text={text} duration={duration}/>;
        let container = document.createElement('div');
        container.className = 'w-toast-container';
        document.body.appendChild(container);
        ReactDOM.render(el, container);
    }
}

Toast.DURATION_LONG = 3000;
Toast.DURATION_SHORT = 1000;

Toast.defaultProps = {
    text : '',
    duration : 3000
};

export {Toast}
