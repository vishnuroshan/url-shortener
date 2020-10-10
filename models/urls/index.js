const Url = require('./urlModel');
exports.createUrl = (newURL) => Url.create(newURL);
exports.getUrlsForUser = (email) => Url.find({ email }).lean();
exports.getUrlFromKey = (key) => Url.findOneAndUpdate({ key, status: 'active' }, { $inc: { 'clicks': 1 } }, { new: true }).lean();