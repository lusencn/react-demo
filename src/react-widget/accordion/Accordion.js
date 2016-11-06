import ReactDOM from 'react-dom';
import React, { Component, PropTypes } from 'react';

import adCSS from './css/accordion.css';
import AccordionItem from './AccordionItem';

class Accordion extends Component {

    constructor(props) {
        super(props);
        this.expandedItem = null;
        this.items = [];
        this.itemContentHeight = [];

        this.relayout = this.relayout.bind(this);
    }

    render() {
        let { className, children, itemCls, selected } = this.props;
        this.items.length = 0;
        return (
            <div className={`accordion ${className}`} ref={(ref) => this.self = ref}>
                {children.map((child, index) => {
                    return (
                        <AccordionItem
                            key={index}
                            ref={(ref) => ref && this.items.push(ref) }
                            title={child && child.props.title}
                            className={itemCls}
                            collapsed={selected != index}
                            onExpand={this.onItemExpand.bind(this) }
                            contentHeight={this.itemContentHeight[index]}>
                            { child }
                        </AccordionItem>
                    );
                }) }
            </div>
        );
    }

    componentDidMount() {
        this.relayout();
        window.addEventListener('resize', this.relayout, false);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.relayout, false);
    }

    onItemExpand(item, expand) {
        let { multiple } = this.props;
        if (!multiple) {
            if (expand) {
                if (this.expandedItem) {
                    this.expandedItem.collapse();
                } else {
                    for (let it of this.items) {
                        if (it && it.isExpanded()) {
                            it.collapse();
                        }
                    }
                }
            }
            this.expandedItem = item;
        }
        let time = setTimeout(() => {
            clearTimeout(time);
            this.relayout();
        }, 0);
        
    }

    relayout() {
        let selfEl = ReactDOM.findDOMNode(this.self),
            parentEl = selfEl.parentNode;
        let parentRect = parentEl.getBoundingClientRect(),
            { width, height } = parentRect;
        let itemEls = selfEl.children;
        let totalTitleHight = 0, itemContentHight = 0, heightArr = [], expCnt = 0;
        for (let i = 0; i < itemEls.length; i++) {
            if (this.items[i].isExpanded()) {
                expCnt++;
                heightArr[i] = -1;
            } else {
                heightArr[i] = 0;
            }
            totalTitleHight += itemEls[i].firstChild.getBoundingClientRect().height;
        }
        this.itemContentHeight = heightArr.map((val) => (val === -1 ? (height - itemEls.length - totalTitleHight) / expCnt : val));
        this.setState({ random: Math.random() });
    }


}

Accordion.defaultProps = {
    className: '',
    itemCls: '',
    multiple: false,
    selected: 0
};

export default Accordion;
