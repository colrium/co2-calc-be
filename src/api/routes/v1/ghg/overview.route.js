/** @format */

const express = require('express');
const validate = require('express-validation');
const controller = require('../../../controllers/ghg/overview.controller');
const { listResults } = require('../../../validations/ghg/result.validation');
const { authorize, ADMIN, LOGGED_USER } = require('../../../middlewares/auth');
const router = express.Router();

router
	.route('/')
	/**
	 * @api {get} v1/overview List Overviews
	 * @apiDescription Get a list of overviews
	 * @apiVersion 1.0.0
	 * @apiName ListOverviews
	 * @apiGroup Overview
	 * @apiPermission admin
	 *
	 * @apiHeader {String} Authorization  access token
	 *
	 * @apiSuccess {Object{}} overviews.
	 */
	.get(authorize(LOGGED_USER), validate(listResults), controller.totals);

module.exports = router;
