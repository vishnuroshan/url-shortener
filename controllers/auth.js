const authController = {};
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('../utils/jwt');

authController.createUser = async (newUser) => {
	try {
		const user = await (await User.createUser(newUser)).toJSON();
		const token = jwt.generateJWT({ userId: user._id });
		return { user, token };
	} catch (err) {
		console.log(err);
	}
};

authController.login = async ({ email, password }) => {
	const user = await User.getUser(email);
	if (user) {
		const isAuth = await bcrypt.compare(password, user.password);
		if (isAuth) {
			const { token, err } = jwt.generateJWT({ userId: user._id });
			if (err) return { type: 'error', message: 'token issue', ...err };
			return { token, user };
		} else return { type: 'warning', message: 'invalid credentials' };
	} else return { status: 'warning', message: 'user not found' };
};

module.exports = authController;