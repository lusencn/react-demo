let router = require('express').Router();

const LIST_COUNT = 1000;
const PAGE_SIZE = 30;

router.get('/page', function(req, res){
    let records = [];
    let {startIndex, pageSize} = req.query;
    !startIndex && (startIndex = 0);
    startIndex *= 1;
    !pageSize && (pageSize = PAGE_SIZE);


    for (let i = 0; i < pageSize; i++) {
        if (startIndex + i > LIST_COUNT) {
            break;
        }

        let val = `${startIndex + i}`;
        records.push({
            title: '待办-' + val,
            content: '内容-' + val,
            group: {
                id: 0,
                name: '默认分组'
            }
        })
    }

    let result = {
        success: true,
        data: {
            list: records,
            count: LIST_COUNT
        }
    }
    res.json(result);
});

router.get('/search', function(req, res){
});

module.exports = router;
