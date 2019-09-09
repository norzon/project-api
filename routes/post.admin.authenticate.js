const express = require('express');
const router = express.Router();
const hashUser = require('../helpers/hashUser');

router.post('/admin/authenticate', require('../helpers/routeWrapper')(async (req) => {
	if (!req.body.username || !req.body.password) {
		throw new Error('Username or password not given');
	}

	const user = `${req.body.username}:${req.body.password}`;
	const hash = hashUser(user);

	if (req.app.get('admins').includes(hash)) {
		return hash;
	} else {
		throw new Error('Invalid username or password');
	}
}));

module.exports = router;