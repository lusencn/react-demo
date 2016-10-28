import cls from './css/alert.css';

import React, {Component, PropTypes} from 'react';
import {Dialog} from './Dialog';


/**
 * 操作选择弹窗组件
 */
class Alert extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let props = this.props;
        return (
            <div className="dlg-modal dlg-alert">
                <div className="title">{props.titleText}</div>
                <div className="content">{props.content}</div>
                <div className="footer">
                    <div className="btn btn-green outline" onClick={this.close.bind(this)}>取消</div>
                    <div className="btn btn-green" onClick={this.onOk.bind(this)}>确定</div>
                </div>
            </div>
        );
    }

    onOk() {
        this.props.onOk();
        Dialog.close(this.props.dlgId);
    }

    close() {
        this.props.onCancel();
        Dialog.close(this.props.dlgId);
    }

    static show(alertTagEl) {
        let dlgId=alertTagEl.props.dlgId,
            width = alertTagEl.props.width,
            height = alertTagEl.props.height;
        Dialog.show(<Dialog ctId={dlgId} width={width} height={height}>{alertTagEl}</Dialog>);
    }
}

Alert.defaultProps = {
    dlgId : '',
    width : 400,
    height : 235,
    titleText : '',
    content : '',
    onOk : () => {},
    onCancel : () => {}
};

export {Alert}
