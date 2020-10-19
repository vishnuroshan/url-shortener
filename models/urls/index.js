const Url = require('./urlModel');
exports.createUrl = (newURL) => Url.create(newURL);
exports.addAnalytics = (key, analytics) => Url.updateOne({ key, userId: { $exists: true }, status: 'active' }, { $push: { analytics } });
exports.getUrlsForUser = (email) => Url.find({ email }).lean();
exports.getUrlFromKey = (key) => Url.findOneAndUpdate({ key, status: 'active' }, { $inc: { 'clicks': 1 } }, { new: true }).lean();