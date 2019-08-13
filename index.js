const express = require("express"),
	app = express()

const DB = require("./db");
const db = new DB();
const watch = require('./helpers/stopwatch');


app.set('db', db);
app.set('watch', watch);

// Initial controller
app.use((req, res, next) => {
	watch.start();
	res.contentType('application/json');
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

app.get('/', async (req, res, next) => {
	req.app.set('body', 'API running');
	next();
});

// Routes
app.use(require('./routes/get.ingredients.all'));
app.use(require('./routes/get.decisions.all'));

// Final controller. Run after the routers
app.use((req, res, next) => {
	if (res.statusCode >= 200 && res.statusCode < 300) {
		return res.json({
			success: true,
			results: app.get('body'),
			execTime: watch.stop()
		})
	} else {
		return res.json({
			success: false,
			results: app.get('error'),
			execTime: watch.stop()
		})
	}
});

db.tryStatement()
	.then((results) => {
		console.log("API running on port: 8000");
		app.listen(8000);
	})
	.catch(e => {
		console.error(e);
	});
