/**
 * 待办元数据
 */
export const TODO_META = {
    title: {
        label: '主题',
        isMust: true,
        maxLength: 256
    },
    group: {
        label: '分组',
        isMust: true,
        type: 'object'
    },
    content: {
        label: '内容',
        maxLength: 2000
    }
}
