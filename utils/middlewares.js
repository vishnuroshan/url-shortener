const jwt = require('./jwt');
const User = require('../models/user');

exports.checkToken = (request, response, next) => {
	let token = request.headers.authorization;
	if (token) {
		if (token.startsWith('Bearer ')) token = token.slice(7, token.length);
		const { payload, err } = jwt.validateJWT(token);
		if (payload) {
			User.getUser(payload.email).then((user) => {
				request.user = user;
				next();
			});
		} else {
			console.log(err);
			return response.status(401).json({ status: 401, ...err });
		}
	} else {
		if (request.url === '/shorten') return next();
		// else token not sent 
		else return response.status(401).json({ status: 401, message: 'unAuthorized' });
	}
};
