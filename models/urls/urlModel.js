const shortid = require('shortid');
const mongoose = require('../../db/connection');
const Schema = mongoose.Schema;

const UrlSchema = new Schema({
	url: {
		type: String,
		set: (val) => val.trim()
	},
	key: {
		type: String,
		default: shortid.generate()
	},
	clicks: {
		type: Number,
		default: 0
	},
	status: {
		type: String,
		enum: ['active', 'inactive', 'removed'],
		default: 'active',
	},
}, { timestamps: true });

const Url = mongoose.model('url', UrlSchema);

module.exports = Url;
