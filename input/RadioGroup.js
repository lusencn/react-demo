import React, {Component, PropTypes} from 'react';

import isArray from '../../lib/is/isArray';
import isBlank from '../../lib/is/isBlank';
import isBoolean from '../../lib/is/isBoolean';
import isEmpty from '../../lib/is/isEmpty';
import isNumber from '../../lib/is/isNumber';
import rgCSS from '../css/radio-group.css';

/**
 * 选择项组（支持单选/多选）
 */
class RadioGroup extends Component {

    constructor(props) {
        super(props);
        let { value, values } = props;
        this.state = {
            value: value,
            values: values,
            collapsed: false,
        };
        this.value = value;
        this.values = values;
    }

    //-------------------- begin of 视图 -----------------------------
    render() {
        let { direction } = this.props,
            { collapsed } = this.state,
            collapsedCls = collapsed ? 'collapsed' : '';

        return (
            <div className={`radio-group ${direction} ${collapsedCls}`}>
                { this.renderCaption() }
                <div className="radio-group-list">
                    { this.renderItems() }
                </div>
            </div>
        );
    }

    renderCaption() {
        let { caption } = this.props,
            { collapsed } = this.state;
        return !isBlank(caption) ? (
            <div className="caption">
                <span className="text">{caption}</span>
                <i className="caret"
                    onClick={() => this.setState({ collapsed: !collapsed }) }></i>
            </div>
        ) : null;
    }

    renderItems() {
        let { items, textField } = this.props;
        return items.map((item, index) => {
            let sel = this.shouldItemBeChecked(item);
            return (
                <div key={index}
                    className={"radio-group-item " + (sel ? "checked" : "") }
                    onClick={this.onItemClick.bind(this, item) }>
                    <i className={"icons icon-radio" + (sel ? "-checked" : "") }></i>
                    <span>{item[textField]}</span>
                </div>
            );
        });
    }
    //-------------------- end of 视图 -----------------------------


    //-------------------- begin of 外部接口 -----------------------------
    setValue(value) {
        this.value = value;
        this.setState({ value: value });
        this.props.onChange(this.props.name, value, this);
    }

    getValue() {
        let { multiple } = this.props,
            value = this.value,
            values = this.values;
        return !multiple ? value : (isArray(values) ? values[0] : null);
    }

    setValues(values) {
        this.values = values;
        this.setState({ values: values });
        this.props.onChange(this.props.name, values, this);
    }

    getValues() {
        let { multiple } = this.props,
            value = this.value,
            values = this.values;
        return !multiple ? (value ? [value] : value) : (isArray(values) ? values : null);
    }

    /**
     * 清除值
     */
    clear() {
        this.value = null;
        this.values = null;
        this.setState({
            value: null,
            values: null
        });
    }
    //-------------------- end of 外部接口 -----------------------------


    //-------------------- begin of 内部函数 -----------------------------
    shouldItemBeChecked(item) {
        let { multiple, valueField } = this.props,
            value = item[valueField],
            curValue = this.value,
            curValues = this.values;
        return !multiple && curValue == value
            || multiple && isArray(curValues) && curValues.indexOf(value) != -1;
    }
    //-------------------- begin of 内部函数 -----------------------------


    //-------------------- begin of 事件处理 -----------------------------
    /**
     * 选中处理方法
     */
    onItemClick(item) {
        let { multiple, valueField } = this.props,
            value = item[valueField];
        if (!multiple) {
            this.value != value && this.setValue(value);
        } else {
            let values = this.values, index = -1;
            values = isArray(values) ? values : [];
            index = values.indexOf(value)
            if (index === -1) {
                values.push(value);
            } else {
                // 多选支持取消选中
                values.splice(index, 1);
            }
            this.setValues(!isEmpty(values) ? values : null);
        }
    }
    //-------------------- end of 事件处理 -----------------------------

}

RadioGroup.propTypes = {
    name: PropTypes.string,
    caption: PropTypes.string,
    multiple: PropTypes.bool,
    values: PropTypes.array,
    items: PropTypes.array.isRequired,
    textField: PropTypes.string,
    valueField: PropTypes.string,
    onChange: PropTypes.func
};

RadioGroup.defaultProps = {
    // radio name
    name: '',
    // 头部文字
    caption: '',
    // 排版方向，vertical/horizontal
    direction: 'horizontal',
    // 选项列表,每隔选项包含text和value属性
    items: [],
    // 单选初始值
    value: null,
    // 多选初始值列表，数组
    values: null,
    // 是否支持多选
    multiple: false,
    // 文本字段
    textField: 'text',
    // 值字段
    valueField: 'value',

    // Event handler
    onChange: (value) => { }
};

export default RadioGroup;
