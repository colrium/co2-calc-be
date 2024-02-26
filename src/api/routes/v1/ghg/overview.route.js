/** @format */

import express from "express";
import validate from "express-validation";
import Controller from '../../../controllers/ghg/calculation.controller.js';
import { LOGGED_USER, authorize } from "../../../middlewares/auth.js";
import validitions from "../../../validations/ghg/result.validation.js";
const { listResults } = validitions;
const router = express.Router();

router
	.route('/')
	/**
	 * @api {get} v1/overview Get Overview
	 * @apiDescription Get a overview summary
	 * @apiVersion 1.0.0
	 * @apiName GetOverview
	 * @apiGroup Overview
	 * @apiPermission user
	 *
	 * @apiHeader {String} Authorization  access token
	 *
	 * @apiSuccess {Object} overviews.
	 */
	.get(authorize(LOGGED_USER), validate(listResults), Controller.overview);

export default router;
