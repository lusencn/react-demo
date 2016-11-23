import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/todo';
import TodoList from './TodoList';

class Container extends Component {
    static propTypes = {
        todo: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
    }

    render() {
        let {todo, actions} = this.props;
        let props = {
            currPageRecords: todo.page.currPageRecords,
            // 列表加载状态
            loading: todo.loadingState.loading,
            // 列表每页最多显示记录数
            pageSize: todo.conds.pageSize,
            // 列表全部记录数
            recordsAllCnt: todo.page.recordsAllCnt,
            // 列表当前页第一条记录在完整列表中的索引位置（从0开始计数）
            startIndex: todo.conds.startIndex,
            actions
        }
        return <div>
            <TodoList {...props} />
        </div>
    }
}

const mapStateToProps = state => ({
    todo: state.todo
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Container)
