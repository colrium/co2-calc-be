/** @format */

import express from "express";
import validate from "express-validation";
import controller from "../../../controllers/ghg/activityType.controller.js";
import validitions from "../../../validations/ghg/activityType.validation.js";
const { listActivityTypes } = validitions;
const router = express.Router();

router
	.route('/')
	/**
	 * @api {get} v1/activityTypes List ActivityTypes
	 * @apiDescription Get a list of activityTypes
	 * @apiVersion 1.0.0
	 * @apiName ListActivityTypes
	 * @apiGroup ActivityType
	 * @apiPermission admin
	 *
	 * @apiHeader {String} Authorization   ActivityType's access token
	 *
	 * @apiParam  {Number{1-}}         [page=1]     List page
	 * @apiParam  {Number{1-100}}      [perPage=1]  ActivityTypes per page
	 * @apiParam  {String}             [name]       ActivityType's name
	 * @apiParam  {String}             [label]      ActivityType's label
	 * @apiParam  {String=activityType,admin}  [role]       ActivityType's role
	 *
	 * @apiSuccess {Object[]} activityTypes List of activityTypes.
	 */
	.get(validate(listActivityTypes), controller.help);


    export default router;