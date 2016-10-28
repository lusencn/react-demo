import React, { Component, PropTypes } from 'react';

import aiCSS from '../css/accordion-item.css';
import isArray from '../../lib/is/isArray';
import isBlank from '../../lib/is/isBlank';
import isBoolean from '../../lib/is/isBoolean';
import isEmpty from '../../lib/is/isEmpty';
import isNumber from '../../lib/is/isNumber';

/**
 * AccordionItem
 * created by huangsl
 */

class AccordionItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed : props.collapsed
        };
    }

    render() {
        let { title, iconCls, collapsible, className, children, contentHeight } = this.props,
            { collapsed } = this.state,
            collapsedCls = collapsed ? 'collapsed' : '',
            style = contentHeight ? { height: contentHeight } : {};
        return (
            <div className={`accordion-item ${className} ${collapsedCls}`}>
                <div className="title">
                    {iconCls ? <i className={`icons ${iconCls}`}></i> : null}
                    <span>{title}</span>
                    {collapsible ? <i className={`icons icon-caret`}
                    onClick={this.onExpand.bind(this)}></i> : null}
                </div>
                <div className="content" style={style}>
                    { children }
                </div>
            </div>
        );
    }

    collapse() {
        this.setState({
            collapsed : true
        });
    }

    isExpanded() {
        return !this.state.collapsed;
    }

    onExpand() {
        let { collapsed } = this.state;
        this.setState({
            collapsed : !collapsed
        });
        this.props.onExpand(this, collapsed);
    }
}

AccordionItem.defaultProps = {
    propTypes : {
        title : PropTypes.string.isRequired,
        iconCls : PropTypes.string,
        selected : PropTypes.boolean,
        collapsible : PropTypes.boolean,
        collapsed : PropTypes.boolean
    },

    // 标题
    title : '',
    // 图标类
    iconCls : '',
    // 是否可展开
    collapsible : true,
    // 是否展开
    collapsed : false,

    className : '',

    // 展开事件
    onExpand : () => {}
};

export default AccordionItem;
