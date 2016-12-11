let express = require('express');
let path = require('path');
let compress = require('compression');
let todo = require('./api/todo');

let app = express();
app.use(compress());
app.use(express.static(path.resolve(__dirname, '../dist')));
app.use('/api/v1/todo', todo);

let server = app.listen(3000, function () {
	let host = server.address().address;
	let port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});
