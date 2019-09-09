const crypto = require('crypto');
const express = require('express');
const router = express.Router();

const hashUser = (str) => crypto.createHash('sha1').update(str).digest('hex');

const admins = [
	'admin:admin'
].map(hashUser);


router.post('/admin/authenticate', require('../helpers/routeWrapper')(async (req) => {
	return req.body || 'no body';
}))

module.exports = router;