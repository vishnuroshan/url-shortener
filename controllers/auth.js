const authController = {};
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('../utils/jwt');

authController.createUser = async (newUser) => {
	try {
		const user = await (await User.createUser(newUser)).toJSON();
		return { status: 200, user };
	} catch (err) {
		console.log(err);
	}
};

authController.login = async ({ email, password }) => {
	const user = await User.getUser(email);
	// .then(async (user) => {
	if (user) {
		const isAuth = await bcrypt.compare(password, user.password);
		if (isAuth) {
			const { token, err } = jwt.generateJWT({ userId: user.userId, email });
			if (err) {
				return { type: 'error', message: 'token issue', ...err };
			}
			return { status: 200, token };
		} else {
			return { type: 'warning', message: 'invalid credentials' };
		}
	} else {
		// no user found
		return { status: 'warning', message: 'user not found' };
	}
};

module.exports = authController;