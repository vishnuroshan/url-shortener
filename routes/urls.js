const router = require('express').Router();
const urlController = require('../controllers/urls');
const { celebrate, errors, Joi } = require('celebrate');
const { BASE_URL } = require('../config/app-config');
const validUrl = require('valid-url');
const checkToken = require('../utils/middlewares').checkToken;
router.get('/', (request, response) => {
	response.status(200).send('hi welcome to linkBro. A simple url shortener service');
});

// redirect
router.get('/:id', (request, response) => {
	urlController.getUrlFromKey(request.params.id).then((urlObject) => {
		console.log(request.params.id, urlObject);
		if (urlObject && urlObject.url) {
			response.status(301).redirect(urlObject.url);
			// only add analytics when urlObject has user
			if (urlObject.userId) {
				urlController.addAnalytics(request.params.id, { ipInfo: request.ipInfo, when: new Date().toISOString() }).then((res) => {
					console.log('update? ', res.nModified);
				});
			}
		}
		else {
			response.status(404).send('404 not found');
		}
	}, err => {
		response.status(err.status).json(err);
	});
});

router.post('/shorten', checkToken, celebrate({
	body: Joi.object().keys({
		url: Joi.custom((url, helpers) => {
			return validUrl.isUri(url) ? url : helpers.error('any.invalid');
		}, 'check if url is valid or not!!')
	})
}), errors(), (request, response) => {
	console.log(request.user);
	if (request.user && request.user._id) {
		request.body.userId = request.user._id;
	}
	urlController.createUrl(request.body).then(urlObj => {
		let shortUrl = `${BASE_URL}/${urlObj.uniqueKey}`;
		if (!shortUrl.startsWith('http://', 0)) shortUrl = `http://${shortUrl}`;
		response.status(200).json({ shortUrl, isAuth: request.user ? true : false });
	}, err => {
		console.log(err);
		response.status(err.status).json(err);
	});
});




module.exports = router;