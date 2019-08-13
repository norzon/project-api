const express = require("express"),
	app = express()

const DB = require("./db");
const db = new DB();

// global controller
app.use((req, res, next) => {
	try {
		res.contentType('application/json');
		res.header('Access-Control-Allow-Origin', '*');
		next();
	} catch (error) {
		return res.json({
			success: false,
			descritpion: error
		});
	}
});

app.get('/', async (req, res) => res.json({
	success: true,
	descritpion: 'API running'
}));

// Routes
require('./routes/get.ingredients.all')(app, db);
require('./routes/get.decisions.all')(app, db);

db.tryStatement()
	.then((results) => {
		console.log("API running on port: 8000");
		app.listen(8000);
	})
	.catch(e => {
		console.error(e);
	});
