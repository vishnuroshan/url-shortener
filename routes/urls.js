const router = require('express').Router();
const urlController = require('../controllers/urls');
const { celebrate, errors, Joi } = require('celebrate');
const { BASE_URL } = require('../config/app-config');
const rateLimit = require('express-rate-limit');
const validUrl = require('valid-url');

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
			console.log('message after redirect', request.ipInfo);
			if (!request.ipInfo.error) {
				urlController.addAnalytics(request.params.id, { ipInfo: request.ipInfo }).then((res) => {
					console.log(res);
					console.log('\n\n\n ip info added to ', request.params.id);
				});
			}

		}
		else response.status(404).sendFile(path.join(path.parse(__dirname).dir + '/public/templates/index.html'));
	}, err => {
		response.status(err.status).json(err);
	});
});

router.post('/shorten', limiter, celebrate({
	body: Joi.object().keys({
		url: Joi.custom((url, helpers) => {
			return validUrl.isUri(url) ? url : helpers.error('any.invalid');
		}, 'check if url is valid or not!!')
	})
}), errors(), (request, response) => {
	urlController.createUrl(request.body).then(urlObj => {
		let shortUrl = `${BASE_URL}/${urlObj.key}`;
		if (!shortUrl.startsWith('http://', 0)) shortUrl = `http://${shortUrl}`;
		response.status(200).json({ urlObj, shortUrl, ipInfo: request.ipInfo });

	}, err => {
		console.log(err);
		response.status(err.status).json(err);
	});
});




module.exports = router;