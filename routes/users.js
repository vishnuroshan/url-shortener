const router = require('express').Router();
const { celebrate, errors, Joi } = require('celebrate');
const urlController = require('../controllers/urls');

router.get('/listUrls', celebrate({
	query: Joi.object().keys({
		filters: Joi.object().keys({}).optional(),
		offset: Joi.number().optional().default(0),
		limit: Joi.number().optional().default(30)
	})
}), errors(), (request, response) => {
	console.log('user data;>', request.user);
	urlController.getUrlsForUser({ userId: request.user._id }, request.query.offset, request.query.limit).then((result) => {
		response.status(200).json({ ...result, status: 200 });
	}, err => {
		console.log(err);
		response.status(500).json(err);
	});
});

module.exports = router;