import React, {Component, PropTypes} from 'react';

import css from './css/searchbox.css';

/**
 * 搜索框
 */
class SearchBox extends Component {
    constructor(props) {
        super(props);
        let {value} = props;
        (value == null) && (value = '');

        this.state = { 
            focused: false, 
            disabled: false,
            value: value,
            width: props.width
        };

        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onKeyUp = this.handleKeyup.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this._renderClass = this._renderClass.bind(this);
    }

    render() {
        let { placeholder } = this.props;
        let {disabled, value, width} = this.state;

        return <div className={this._renderClass()} style={{width: width}}>
            <input
                ref={(ref) => this._input = ref}
                placeholder={placeholder} 
                style={{width: width - 30}}
                value={value} 
                onChange={this.onChange}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                onKeyUp={this.onKeyUp}
                disabled={disabled ? 'disabled' : false} />
            <i className="i-search" onClick={this.handleSearch}></i>
        </div>
    }

    _renderClass() {
        let klass = [
            this.props.defaultCls,
            (this.props.className || ''),
            (this.state.focused ? 'focus' : ''),
            (this.state.disabled ? 'disabled' : '')
        ].join(' ');
        return klass;
    }

    //--------------------------------------------------------------------

    onChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    onBlur() {
        this.setState({focused: false});
    }

    onFocus() {
        this.setState({focused: true});
    }

    handleKeyup(evt) {
        if (evt.keyCode == 13) {
            this.handleSearch(evt);
        }
    }

    handleSearch(evt) {
        let value = this._trim(this._input.value);
        this.props.handleSearch(value);
    }

    enable() {
        this.setState({disabled: false});
    }

    disable() {
        this.setState({disabled: true});
    }

    setWidth(width = 100) {
        this.setState({ width: width });
    }

    getSearchText() {
        return this._trim(this._input.value);
    }

    _trim(txt = '') {
        return txt.replace(/^\s+|\s+$/g, '').replace(/^\t+|\t+$/g, '');
    }
}

SearchBox.propTypes = {
    width: PropTypes.number,
    value: PropTypes.string,
    defaultCls: PropTypes.string,
    placeholder: PropTypes.string,
    handleSearch: PropTypes.func
};

SearchBox.defaultProps = {
    width: 156,
    defaultCls: 'w-sch',
    placeholder: '请输入关键字...',
    handleSearch: (evt) => {}
};

export {SearchBox}
