const User = require('./userModel');
exports.createUser = async (newUser) => User.create(newUser);
exports.getUser = async (email) => User.findOne({ email, status: 'active' }).lean();
exports.getUserById = (_id) => User.findById(_id).lean();