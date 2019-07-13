const express = require('express');

const hostname = '127.0.0.1';
const port = 3000;

var app = express();

var Parser = require('rss-parser');
var parser = new Parser();
var bodyParser = require('body-parser');

var mysql = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'newsfeed',
	password : 'mysecretpassword',
	database : 'newsfeed'
});

connection.connect(function(err) {
	if ( !err ) {
		console.log("MySQL connection established.");
	} else if ( err ) {
		console.log(err);
	}
});

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/getNews', async function (req, res, next) {
	try {
		let feed = await parser.parseURL('http://feeds.reuters.com/Reuters/worldNews');
		res.json(feed);
	} catch (e) {
		res.status(503).send(e)
	}
});
app.get('/getComments', async function (req, res, next) {
	try {
		var query = 'SELECT * FROM comments WHERE url = ' 
					+ connection.escape(req.query.url) + ';';

		console.log(query);
		connection.query(query, function (error, results, fields) {
				if (error) {
        				res.status(503).send(error);
				} else {
						console.log(results);
						res.status(200);
						res.json(results);
				}
		});
	} catch (e) {
		res.status(503).send(e)
	}
});
app.post('/addComment', async function(req, res) {
    try {

		var query = 'INSERT INTO comments (comment, name, url) VALUES('
					+ connection.escape(req.body.comment) + ','
					+ connection.escape(req.body.name) + ','
					+ connection.escape(req.body.url) + ')';

		console.log(query);

		connection.query(query, function (error, results, fields) {
				if (error) {
        				res.status(503).send(error);
				} else {
						res.sendStatus(200);
				}
		});
    } catch (e) {
        res.status(503).send(e);
    }
});
app.use('/', express.static(__dirname + '/'));

var server = app.listen(port, hostname, () => {

	  console.log(`Server running at http://${hostname}:${port}/`);

});
