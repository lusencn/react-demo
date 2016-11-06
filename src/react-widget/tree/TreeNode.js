import React, {Component, PropTypes} from 'react';

import isEmpty from '../../lib/is/isEmpty';
import isFunction from '../../lib/is/isFunction';
import isString from '../../lib/is/isString';
import trim from '../../lib/string/trim';

class TreeNode extends Component {
    constructor(props) {
        super(props);

        let { displayText, data } = props;

        this.state = {
            // 展开折叠状态
            expCol: data.expCol || 'collapsed',
            // 编辑状态
            isEditing: false,
            // checkbox状态
            isChecked: false,
            // 编辑时的文本
            editText: (isFunction(displayText) ? displayText(data) : data[displayText])
        };

        // 子节点集合
        this.children = [];

        this.expand = this.expand.bind(this);
        this.onClick = props.onClick.bind(this, data);
        this.onEditClick = this.onEditClick.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onCheck = this.onCheck.bind(this);
        this.onChildCheck = this.onChildCheck.bind(this);
    }

    render() {
        let {
                data,
                editable,
                checkable,
                displayText
            } = this.props,
            { editText } = this.state,
            isEditing = this.state.isEditing,
            isLeaf = !this.hasChildren(),
            canEdit = isFunction(editable) ? editable(data) : editable,
            label = isEditing ? editText : (isFunction(displayText) ? displayText(data) : data[displayText]);

        return (
            <div className="tree-leaf">
                <div className="tree-leaf-content">
                    <span className={this.expCls() } onClick={this.expand}></span>
                    {checkable && <span className={this.chkCls() } onClick={this.onCheck}></span>}
                    <span className={this.typeCls() }></span>
                    {!isEditing && <span className="tree-leaf-text" onClick={this.onClick }>
                        {label}
                        {canEdit && <span className="tree-leaf-edit-icon" onClick={this.onEditClick}></span>}
                    </span>}
                    {(canEdit && isEditing) && <input type="text" className="tree-leaf-input" value={label} onKeyUp={this.onKeyUp} onChange={this.onEdit}/>}
                </div>
                {!isLeaf && this.renderChildren() }
            </div>
        );
    }

    /**
     * 递归渲染子节点
     */
    renderChildren() {
        let { expCol } = this.state,
            { hasNext, hasParent } = this.props,
            { child } = this.props.data,
            len = child.length;
        let dashCls = hasParent && hasNext ? 'dash-line' : '';
        this.children.length = 0;
        let childrenJsx = child.map((e, index) => {
            return (
                <TreeNode ref={(ref) => ref && this.children.push(ref) } {...(this.props) } data={e} key={index} hasParent hasNext={index < len - 1} onCheck={this.onChildCheck }/>
            );
        });
        return (
            <div className={`tree-leaf-children ${expCol} ${dashCls}`}>
                { childrenJsx }
            </div>
        );
    }

    /**
     * 展开收缩图标类
     */
    expCls() {
        let isLeaf = !this.hasChildren(),
            expCol = this.state.expCol,
            { hasNext, hasParent, isLast } = this.props,
            clazz = ['tree-leaf-expand-icon'];
        isLeaf && clazz.push('leaf');
        !isLeaf && clazz.push('branch');
        hasParent && clazz.push('hasparent');
        hasNext && clazz.push('hasnext');
        !hasNext && clazz.push('last');
        !isLeaf && clazz.push(expCol === 'expanded' ? ' expanded' : ' collapsed');
        return clazz.join(' ');
    }

    /**
     * checkbox类
     */
    chkCls() {
        let isChecked = this.state.isChecked;
        return 'tree-leaf-check-icon' + (isChecked ? ' checked' : '');
    }

    /**
     * 节点类型类
     */
    typeCls() {
        let { data, isSearchLeaf } = this.props;
        let isLeaf = isFunction(isSearchLeaf) ? isSearchLeaf(data) : !this.hasChildren(),
            expCol = this.state.expCol;
        return 'tree-leaf-type-icon' + (isLeaf ? ' leaf' : ' branch' + (expCol === 'expanded' ? ' expanded' : ' collapsed'));
    }
    // 展开折叠
    expand() {
        this.setState({ expCol: (this.state.expCol === 'expanded' ? 'collapsed' : 'expanded') });
    }

    setEditing(bool) {
        this.setState({ isEditing: bool });
    }

    hasChildren() {
        return !isEmpty(this.props.data.child);
    }

    /**
     * 设置checkbox状态
     * @param checked 是否选中
     * @param cascadeDown 向下级联，即同时选中或取消子孙节点
     * @param cascadeUp 向上级联，即同时更新父节点的状态
     */
    setChecked(checked = false, cascadeDown = false, cascadeUp = false) {
        this.setState({ isChecked: checked }, () => { cascadeUp && this.props.onCheck(this) });
        cascadeDown && this.children.forEach((item) => item.setChecked(checked, cascadeDown));
        this.props.handleCheck(this.props.data, checked);
    }

    isChecked() {
        return this.state.isChecked;
    }

    onEditClick(event) {
        event.stopPropagation();
        this.setEditing(true);
    }

    onCheck() {
        this.setChecked(!this.state.isChecked, true, true);
    }

    onChildCheck(childObj) {
        if (!childObj.isChecked()) {
            this.setChecked(false, false, true);
        } else {
            let allcheck = this.children.every((item) => item.isChecked());
            allcheck && this.setChecked(true, false, true);
        }
    }

    onEdit(event) {
        let val = trim(event.target.value);
        this.setState({ editText: val });
    }

    onKeyUp(event) {
        // 输入enter键更新操作
        if (event.keyCode === 13) {
            let val = trim(event.target.value);
            if (val) {
                let { displayText, data } = this.props;
                this.setEditing(false);
                if (isString(displayText)) {
                    data[displayText] = val;
                }
                this.props.onAfterEdit(val, data);
            }
        }
    }
}

TreeNode.propTypes = {
    checkable: PropTypes.bool,
    editable: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.func
    ]),
    data: PropTypes.object.isRequired
};

TreeNode.defaultProps = {
    /** 是否可编辑 */
    editable: false,
    /** 是否显示checkbox */
    checkable: false,
    /** 显示字段，字段名或函数 */
    displayText: 'text',
    /** 树形组件数据 */
    data: {},
    /** 点击事件 */
    onClick: (node) => { },
    /** 编辑后回调函数 */
    onAfterEdit: (node) => { },
    /** 监听子节点选中回调 */
    onCheck: () => { },
    /** 函数，是否是叶子(用于搜索结果) */
    isSearchLeaf: true
};

export default TreeNode;