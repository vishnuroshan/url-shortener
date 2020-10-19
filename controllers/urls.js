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

urlController.getUrlsForUser = async (email) => {
	try {
		let urls = await Url.getUrlsForUser(email);
		return urls;
	} catch (err) {
		console.log(err);
	}
};

module.exports = urlController;