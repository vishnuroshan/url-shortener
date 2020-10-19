const Url = require('./urlModel');
exports.createUrl = (newURL) => Url.create(newURL);
exports.addAnalytics = (key, analytic) => Url.updateOne({ key, userId: { $exists: true }, status: 'active' }, { $push: { analytics: analytic } });
exports.getUrlsForUser = (userId, offset, limit) => Url.find({ userId }).skip(offset).limit(limit).lean();
exports.getUrlFromKey = (key) => Url.findOneAndUpdate({ key, status: 'active' }, { $inc: { 'clicks': 1 } }, { new: true }).lean();
exports.getUrlCount = async (filter = {}) => await Url.estimatedDocumentCount(filter).exec();