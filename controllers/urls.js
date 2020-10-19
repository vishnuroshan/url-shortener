const urlController = {};
const Url = require('../models/urls');

urlController.getUrlFromKey = async (key) => {
	try {
		let shortURL = await Url.getUrlFromKey(key);
		return shortURL;
	} catch (err) {
		console.log(err);
	}
};

urlController.addAnalytics = async (key, analytics) => {
	try {
		let res = await Url.addAnalytics(key, analytics);
		return res;
	} catch (err) {
		console.log(err);
	}
};

urlController.createUrl = async (newUrl) => {
	try {
		let shortURL = await Url.createUrl(newUrl);
		return shortURL;
	} catch (err) {
		console.log(err);
	}
};

urlController.getUrlsForUser = async ({ userId }, offset = 0, limit = 30) => {
	try {
		let count = await Url.getUrlCount({ userId });
		console.log('count:::>> ', count);

		let urls = await Url.getUrlsForUser(userId, offset, limit);
		return {
			count,
			totalPages: Math.ceil(count / limit),
			resultPerPage: limit,
			skip: offset,
			data: urls
		};
	} catch (err) {
		console.log(err);
	}
};

module.exports = urlController;