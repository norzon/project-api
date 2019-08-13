module.exports = function(callback) {
	return async function(req, res, next) {
		try {
			req.app.set('body', await callback(req, res));
			res.status(200);
		} catch(e) {
			console.log(e);
			req.app.set('error', e.message || e);
			res.status(500);
		} finally {
			next();
		}
	}
}