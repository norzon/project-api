const express = require('express');
const router = express.Router();
const hashUser = require('../helpers/hashUser');

router.post('/admin/authenticate', require('../helpers/routeWrapper')(async (req) => {
	if (!req.body.email || !req.body.password) {
		throw new Error('Email or password not given');
	}

	const user = `${req.body.email}:${req.body.password}`;
	const hash = hashUser(user);

	if (req.app.get('admins').includes(hash)) {
		return hash;
	} else {
		throw new Error('Invalid email or password');
	}
}));

module.exports = router;