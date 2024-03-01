/** @format */

import express from "express";
import validate from "express-validation";
import controller from "../../../controllers/ghg/activityType.controller.js";
import { LOGGED_USER, authorize } from "../../../middlewares/auth.js";
import validations from "../../../validations/ghg/activityType.validation.js";
const { create, list, replace, update } = validations;
const router = express.Router();

router
	.route('/')
	/**
	 * @api {get} v1/activity-types List ActivityTypes
	 * @apiDescription Get a list of activityTypes
	 * @apiVersion 1.0.0
	 * @apiName ListActivityTypes
	 * @apiGroup ActivityType
	 * @apiPermission admin
	 *
	 * @apiHeader {String} Authorization  access token
	 *
	 * @apiParam  {Number{1-}}         [page=1]     List page
	 * @apiParam  {Number{1-100}}      [perPage=1]  ActivityTypes per page
	 * @apiParam  {String}             [name]       ActivityType's name
	 * @apiParam  {String}             [email]      ActivityType's email
	 * @apiParam  {String=activityType,admin}  [role]       ActivityType's role
	 *
	 * @apiSuccess {Object[]} activityTypes List of activityTypes.
	 *
	 * @apiError (Unauthorized 401)  Unauthorized  Only authenticated activityTypes can access the data
	 * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
	 */
	.get(authorize(LOGGED_USER), validate(list), controller.list)
	/**
	 * @api {post} v1/activity-types Create ActivityType
	 * @apiDescription Create a new activityType
	 * @apiVersion 1.0.0
	 * @apiName CreateActivityType
	 * @apiGroup ActivityType
	 * @apiPermission admin
	 *
	 * @apiHeader {String} Authorization   ActivityType's access token
	 *
	 * @apiParam  {String}             email     ActivityType's email
	 * @apiParam  {String{6..128}}     password  ActivityType's password
	 * @apiParam  {String{..128}}      [name]    ActivityType's name
	 * @apiParam  {String=activityType,admin}  [role]    ActivityType's role
	 *
	 * @apiSuccess (Created 201) {String}  id         ActivityType's id
	 * @apiSuccess (Created 201) {String}  name       ActivityType's name
	 * @apiSuccess (Created 201) {String}  email      ActivityType's email
	 * @apiSuccess (Created 201) {String}  role       ActivityType's role
	 * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
	 *
	 * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
	 * @apiError (Unauthorized 401)  Unauthorized     Only authenticated activityTypes can create the data
	 * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
	 */
	.post(authorize(LOGGED_USER), validate(create), controller.create);

router
	.route('/:id')
	/**
	 * @api {get} v1/activity-types/:id Get ActivityType
	 * @apiDescription Get activityType information
	 * @apiVersion 1.0.0
	 * @apiName GetActivityType
	 * @apiGroup ActivityType
	 * @apiPermission activityType
	 *
	 * @apiHeader {String} Authorization   ActivityType's access token
	 *
	 * @apiSuccess {String}  id         ActivityType's id
	 * @apiSuccess {String}  name       ActivityType's name
	 * @apiSuccess {String}  email      ActivityType's email
	 * @apiSuccess {String}  role       ActivityType's role
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated activityTypes can access the data
	 * @apiError (Forbidden 403)    Forbidden    Only activityType with same id or admins can access the data
	 * @apiError (Not Found 404)    NotFound     ActivityType does not exist
	 */
	.get(authorize(LOGGED_USER), controller.get)
	/**
	 * @api {put} v1/activity-types/:id Replace ActivityType
	 * @apiDescription Replace the whole activityType document with a new one
	 * @apiVersion 1.0.0
	 * @apiName ReplaceActivityType
	 * @apiGroup ActivityType
	 * @apiPermission activityType
	 *
	 * @apiHeader {String} Authorization   ActivityType's access token
	 *
	 * @apiParam  {String}             email     ActivityType's email
	 * @apiParam  {String{..128}}      [name]    ActivityType's name
	 * @apiParam  {String=activityType,admin}  [role]    ActivityType's role
	 * (You must be an admin to change the activityType's role)
	 *
	 * @apiSuccess {String}  id         ActivityType's id
	 * @apiSuccess {String}  name       ActivityType's name
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated activityTypes can modify the data
	 * @apiError (Forbidden 403)    Forbidden    Only activityType with same id or admins can modify the data
	 * @apiError (Not Found 404)    NotFound     ActivityType does not exist
	 */
	.put(authorize(LOGGED_USER), validate(replace), controller.replace)
	/**
	 * @api {patch} v1/activity-types/:id Update ActivityType
	 * @apiDescription Update some fields of a activityType document
	 * @apiVersion 1.0.0
	 * @apiName UpdateActivityType
	 * @apiGroup ActivityType
	 * @apiPermission activityType
	 *
	 * @apiHeader {String} Authorization   ActivityType's access token
	 *
	 * @apiParam  {String}             email     ActivityType's email
	 * @apiParam  {String{6..128}}     password  ActivityType's password
	 * @apiParam  {String{..128}}      [name]    ActivityType's name
	 * @apiParam  {String=activityType,admin}  [role]    ActivityType's role
	 * (You must be an admin to change the activityType's role)
	 *
	 * @apiSuccess {String}  id         ActivityType's id
	 * @apiSuccess {String}  name       ActivityType's name
	 * @apiSuccess {String}  email      ActivityType's email
	 * @apiSuccess {String}  role       ActivityType's role
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated activityTypes can modify the data
	 * @apiError (Forbidden 403)    Forbidden    Only activityType with same id or admins can modify the data
	 * @apiError (Not Found 404)    NotFound     ActivityType does not exist
	 */
	.patch(authorize(LOGGED_USER), validate(update), controller.update)
	/**
	 * @api {patch} v1/activity-types/:id Delete ActivityType
	 * @apiDescription Delete a activityType
	 * @apiVersion 1.0.0
	 * @apiName DeleteActivityType
	 * @apiGroup ActivityType
	 * @apiPermission activityType
	 *
	 * @apiHeader {String} Authorization   ActivityType's access token
	 *
	 * @apiSuccess (No Content 204)  Successfully deleted
	 *
	 * @apiError (Unauthorized 401) Unauthorized  Only authenticated activityTypes can delete the data
	 * @apiError (Forbidden 403)    Forbidden     Only activityType with same id or admins can delete the data
	 * @apiError (Not Found 404)    NotFound      ActivityType does not exist
	 */
	.delete(authorize(LOGGED_USER), controller.remove);

export default router;
