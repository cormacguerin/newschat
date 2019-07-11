const express = require('express');

var app = express();

var Parser = require('rss-parser');
var parser = new Parser();

const hostname = '127.0.0.1';
const port = 3000;

app.get('/getNews', async function (req, res, next) {
	try {
		let feed = await parser.parseURL('https://news.google.com/rss');
		res.json(feed);
	} catch (e) {
		res.status(503).send(e)
	}
});
app.use('/', express.static(__dirname + '/'));

var server = app.listen(port, hostname, () => {

	  console.log(`Server running at http://${hostname}:${port}/`);

});
