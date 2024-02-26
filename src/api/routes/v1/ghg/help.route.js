/** @format */

import express from "express";
import validate from "express-validation";
import controller from "../../../controllers/ghg/activityType.controller.js";
import validitions from "../../../validations/ghg/activityType.validation.js";
const { listHelpRecords } = validitions;
const router = express.Router();

router
	.route('/')
	/**
	 * @api {get} v1/activityTypes List HelpRecords
	 * @apiDescription Get a list of activityTypes
	 * @apiVersion 1.0.0
	 * @apiName ListHelpRecords
	 * @apiGroup HelpRecord
	 * @apiPermission any
	 *
	 * @apiHeader {String} Authorization   user's access token
	 *
	 * @apiParam  {Number{1-}}         [page=1]     List page
	 * @apiParam  {Number{1-100}}      [perPage=1]  HelpRecords per page
	 * @apiParam  {String}             [name]       HelpRecord's name
	 * @apiParam  {String}             [label]      HelpRecord's label
	 * @apiParam  {String=activityType,admin}  [role]       HelpRecord's role
	 *
	 * @apiSuccess {Object[]} activityTypes List of activityTypes.
	 */
	.get(validate(listHelpRecords), controller.help);


    export default router;