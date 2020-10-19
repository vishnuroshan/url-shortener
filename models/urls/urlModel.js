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
	analtyics: [],
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	status: {
		type: String,
		enum: ['active', 'inactive', 'removed'],
		default: 'active'
	},
	expiresIn: {
		default: 0,
		type: Number
	}
}, { timestamps: true });

const Url = mongoose.model('url', UrlSchema);

module.exports = Url;
