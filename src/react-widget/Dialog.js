import cls from './css/dialog.css';

import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';


/**
 * 弹出窗组件
 */
export default class Dialog extends Component {
    constructor(props) {
        super(props);
        this.id = 'dlg_' + (new Date()).getTime();
        this.state = {
            width: props.width,
            height: props.height
        };
    }
    componentDidMount() {
        this.bindResizeEvent();
        this.onShow();
    }
    componentWillUnmount() {
        this.unbindResizeEvent();
    }
    render() {
        return <div ref="dlgCt">
            <div className="w-dlg" ref="dlg" style={this.positionStyle()}>
                {this.props.showClose ? <div className="w-dlg-close animated" onClick={this.onClose.bind(this)}></div> : null}
                <div className={"w-dlg-content " + this.props.className} ref="dlgBody">{this.props.children}</div>
            </div>
            <div className="w-dlg-mask" style={{zIndex: this.getDlgZIndex() - 1}}></div>
        </div>
    }
    //-----------------------------------------------------------------
    /**
     * 显示弹窗窗口
     */
    static show(dlgRcEl) {
        Dialog.cnt++;
        //删除旧的同ID窗口
        let ctId = dlgRcEl.props.ctId;
        let ctEl = document.getElementById(ctId);
        ctEl && Dialog.close(ctId);
        // 创建弹窗容器DOM
        ctEl = document.createElement('div');
        ctEl.setAttribute('id', ctId);
        document.body.appendChild(ctEl);

        // 渲染弹窗内容
        ReactDOM.render(dlgRcEl, ctEl);
    }
    /**
    * 窗口显示事件
    */
    onShow() {
        this.props.onShow && this.props.onShow();
    }
    /**
     * 关闭弹窗窗口
     */
    static close(ctId) {
        // 卸载组件，并删除弹窗容器DOM
        let ctEl = document.getElementById(ctId);
        ReactDOM.unmountComponentAtNode(ctEl);
        document.body.removeChild(ctEl);
        Dialog.cnt--;
    }
    //-----------------------------------------------------------------
    /**
     * 窗口关闭事件
     */
    onClose() {
        Dialog.close(this.props.ctId);
        this.props.onClose && this.props.onClose();
    }
    /**
     * 设置弹窗的高宽和位置
     */
    positionStyle() {
        var style = {
            width: this.state.width,
            height: this.state.height,
            minHeight: this.props.minHeight
        };

        // 设置窗口宽度
        var winWidth = window.innerWidth ||
            (document.documentElement && document.documentElement.clientWidth) || document.body.clientWidth;
        if (style.width) {
            style.width = String(style.width);
            if (style.width.indexOf('%') > 0) {
                style.width = (winWidth * style.width.replace('%', '') / 100).toFixed(0);
            }
        }
        style.width = Number(style.width);

        // 设置窗口高度
        var winHeight = window.innerHeight ||
            (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight;
        if (style.height) {
            style.height = String(style.height);
            if (style.height.indexOf('%') > 0) {
                style.height = (winHeight * style.height.replace('%', '') / 100).toFixed(0);
            }
        }
        style.height = Number(style.height);

        // 窗口定位
        var pageYOffset = self.pageYOffset ||  document.documentElement.scrollTop,
            widthspace = (winWidth - style.width),
            heightspace = (winHeight - style.height);
        widthspace < 0 && (widthspace = 0);
        heightspace < 0 && (heightspace = 0);
        style.left = (widthspace / 2 - 2) < 0 ? 0 : (widthspace / 2 - 2);
        style.top = (pageYOffset + heightspace / 2 - 2) < 0 ? 0 : (pageYOffset + heightspace / 2 - 2);
        style.zIndex = this.getDlgZIndex();

        return style;
    }
    /**
     * 获取弹窗的z-index值
     */
    getDlgZIndex() {
        return Dialog.seedZIndex + Dialog.cnt;
    }
    /**
     * 绑定window大小变化时触发的弹窗位置变化事件
     */
    bindResizeEvent() {
        var id = this.id;
        Dialog.positionEvents[id] && this.unbindResizeEvent();
        var eventHandle = Dialog.positionEvents[id] = (() => this.setState(this.positionStyle()));
        if (window.addEventListener) {
            window.addEventListener('resize', eventHandle, false);
        } else {
            window.attachEvent('onresize', eventHandle);
        }
    }
    /**
     * 解绑window大小变化时触发的弹窗位置变化事件
     */
    unbindResizeEvent() {
        var eventHandle = Dialog.positionEvents[this.id];
        if (!eventHandle) {
            return;
        }
        if (window.addEventListener){
            window.removeEventListener('resize', eventHandle, false);
        } else {
            window.detachEvent('onresize', eventHandle);
        }
        Dialog.positionEvents[this.id] = null;
    }
}

Dialog.propTypes = {
    ctId: PropTypes.string.isRequired,
    className: PropTypes.string,
    onShow: PropTypes.func,
    onClose: PropTypes.func
};

Dialog.defaultProps = {
    width: 400,
    height: 200,
    minHeight: 200,
    className: '', // 窗口样式
    showClose: true // 是否显示默认关闭图标
};

Dialog.positionEvents = {};
Dialog.seedZIndex = 10000;
Dialog.cnt = 0;
