const LIST_COUNT = 10000;

export let testTodoList = (params) => {
    let {startIndex, pageSize} = params;

    let records = [];
    for (var i = 0; i < pageSize; i++) {
        if (startIndex + i > LIST_COUNT) {
            break;
        }

        let val = `${startIndex}${i}`;
        records.push({
            title: '待办-' + val,
            content: '内容-' + val,
            group: {
                id: 0,
                name: '默认分组'
            }
        })
    }

    return Promise.resolve({
        success: true,
        records,
        count: LIST_COUNT
    });
}
