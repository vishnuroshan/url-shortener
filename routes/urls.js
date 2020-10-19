const router = require('express').Router();
const urlController = require('../controllers/urls');
const { celebrate, errors, Joi } = require('celebrate');
const { BASE_URL } = require('../config/app-config');
const rateLimit = require('express-rate-limit');
const validUrl = require('valid-url');
const checkToken = require('../utils/middlewares').checkToken;
const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	max: 100 // limit each IP to 50 requests per windowMs
});
const path = require('path');

// redirect
router.get('/:id', (request, response) => {
	urlController.getUrlFromKey(request.params.id).then((urlObject) => {
		if (urlObject && urlObject.url) {
			response.status(301).redirect(urlObject.url);
			// only add analytics when urlObject has user
			if (urlObject.userId) {
				urlController.addAnalytics(request.params.id, { ipInfo: request.ipInfo, when: new Date().toISOString() }).then((res) => {
					console.log('update? ', res.nModified);
				});
			}
		}
		else response.status(404).sendFile(path.join(path.parse(__dirname).dir + '/public/templates/index.html'));
	}, err => {
		response.status(err.status).json(err);
	});
});

router.post('/shorten', limiter, checkToken, celebrate({
	body: Joi.object().keys({
		url: Joi.custom((url, helpers) => {
			return validUrl.isUri(url) ? url : helpers.error('any.invalid');
		}, 'check if url is valid or not!!')
	})
}), errors(), (request, response) => {
	if (request.user && request.user._id) {
		request.body.userId = request.user._id;
	}
	urlController.createUrl(request.body).then(urlObj => {
		let shortUrl = `${BASE_URL}/${urlObj.key}`;
		if (!shortUrl.startsWith('http://', 0)) shortUrl = `http://${shortUrl}`;
		response.status(200).json({ shortUrl, isAuth: request.user ? true : false });
	}, err => {
		console.log(err);
		response.status(err.status).json(err);
	});
});




module.exports = router;