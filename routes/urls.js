const router = require('express').Router();
const urlController = require('../controllers/urls');
const { celebrate, errors, Joi } = require('celebrate');
const { BASE_URL } = require('../config/app-config');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	max: 100 // limit each IP to 50 requests per windowMs
});
const path = require('path');

// redirect
router.get('/:id', (request, response) => {
	urlController.getUrlFromKey(request.params.id).then((urlObject) => {
		if (urlObject && urlObject.url)
			response.status(301).redirect(urlObject.url);
		else response.status(404).sendFile(path.join(path.parse(__dirname).dir + '/public/templates/index.html'));
	}, err => {
		response.status(err.status).json(err);
	});
});

router.post('/shorten', limiter, celebrate({
	body: Joi.object().keys({
		url: Joi.string().required()
	})
}), errors(), (request, response) => {
	urlController.createUrl(request.body).then(urlObj => {
		response.status(200).json({ urlObj, url: `https://${BASE_URL}/${urlObj.key}` });
	}, err => {
		console.log(err);
		response.status(err.status).json(err);
	});
});




module.exports = router;