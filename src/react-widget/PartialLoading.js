import plCss from './css/partialloading.css';

import React, {Component} from 'react';

/**
 * 局部区域加载中组件
 */
class PartialLoading extends Component {

    render() {
        return (
            <div className="partial-loading">
                <div className="loading-gif"></div>
                <div className="loading-text">加载中...</div>
            </div>
        );
    }
}

export {PartialLoading}
