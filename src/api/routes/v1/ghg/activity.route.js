/** @format */

import express from "express";
import validate from "express-validation";
import controller from "../../../controllers/ghg/activity.controller.js";
import { LOGGED_USER, authorize } from "../../../middlewares/auth.js";
import validitions from "../../../validations/ghg/activity.validation.js";
const { create, list, replace, update } = validitions;
const router = express.Router();

router
	.route('/')
	/**
	 * @api {get} v1/activities List Results
	 * @apiDescription Get a list of activitys
	 * @apiVersion 1.0.0
	 * @apiName list
	 * @apiGroup Activity
	 * @apiPermission admin
	 *
	 * @apiHeader {String} Authorization   Activity's access token
	 *
	 * @apiParam  {Number{1-}}         [page=1]     List page
	 * @apiParam  {Number{1-100}}      [perPage=1]  Results per page
	 * @apiParam  {String}             [name]       Activity's name
	 * @apiParam  {String}             [email]      Activity's email
	 * @apiParam  {String=activity,admin}  [role]       Activity's role
	 *
	 * @apiSuccess {Object[]} activitys List of activitys.
	 *
	 * @apiError (Unauthorized 401)  Unauthorized  Only authenticated activitys can access the data
	 * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
	 */
	.get(authorize(LOGGED_USER), validate(list), controller.list)
	/**
	 * @api {post} v1/activities Create Activity
	 * @apiDescription Create a new activity
	 * @apiVersion 1.0.0
	 * @apiName create
	 * @apiGroup Activity
	 * @apiPermission admin
	 *
	 * @apiHeader {String} Authorization   Activity's access token
	 *
	 * @apiParam  {String}             email     Activity's email
	 * @apiParam  {String{6..128}}     password  Activity's password
	 * @apiParam  {String{..128}}      [name]    Activity's name
	 * @apiParam  {String=activity,admin}  [role]    Activity's role
	 *
	 * @apiSuccess (Created 201) {String}  id         Activity's id
	 * @apiSuccess (Created 201) {String}  name       Activity's name
	 * @apiSuccess (Created 201) {String}  email      Activity's email
	 * @apiSuccess (Created 201) {String}  role       Activity's role
	 * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
	 *
	 * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
	 * @apiError (Unauthorized 401)  Unauthorized     Only authenticated activitys can create the data
	 * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
	 */
	.post(authorize(LOGGED_USER), validate(create), controller.create);

router
	.route('/:id')
	/**
	 * @api {get} v1/activities/:id Get Activity
	 * @apiDescription Get activity information
	 * @apiVersion 1.0.0
	 * @apiName GetResult
	 * @apiGroup Activity
	 * @apiPermission activity
	 *
	 * @apiHeader {String} Authorization   Activity's access token
	 *
	 * @apiSuccess {String}  id         Activity's id
	 * @apiSuccess {String}  name       Activity's name
	 * @apiSuccess {String}  email      Activity's email
	 * @apiSuccess {String}  role       Activity's role
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated activitys can access the data
	 * @apiError (Forbidden 403)    Forbidden    Only activity with same id or admins can access the data
	 * @apiError (Not Found 404)    NotFound     Activity does not exist
	 */
	.get(authorize(LOGGED_USER), controller.get)
	/**
	 * @api {put} v1/activities/:id Replace Activity
	 * @apiDescription Replace the whole activity document with a new one
	 * @apiVersion 1.0.0
	 * @apiName replace
	 * @apiGroup Activity
	 * @apiPermission activity
	 *
	 * @apiHeader {String} Authorization   Activity's access token
	 *
	 * @apiParam  {String}             email     Activity's email
	 * @apiParam  {String{6..128}}     password  Activity's password
	 * @apiParam  {String{..128}}      [name]    Activity's name
	 * @apiParam  {String=activity,admin}  [role]    Activity's role
	 * (You must be an admin to change the activity's role)
	 *
	 * @apiSuccess {String}  id         Activity's id
	 * @apiSuccess {String}  name       Activity's name
	 * @apiSuccess {String}  email      Activity's email
	 * @apiSuccess {String}  role       Activity's role
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated activitys can modify the data
	 * @apiError (Forbidden 403)    Forbidden    Only activity with same id or admins can modify the data
	 * @apiError (Not Found 404)    NotFound     Activity does not exist
	 */
	.put(authorize(LOGGED_USER), validate(replace), controller.replace)
	/**
	 * @api {patch} v1/activities/:id Update Activity
	 * @apiDescription Update some fields of a activity document
	 * @apiVersion 1.0.0
	 * @apiName update
	 * @apiGroup Activity
	 * @apiPermission activity
	 *
	 * @apiHeader {String} Authorization   Activity's access token
	 *
	 * @apiParam  {String}             email     Activity's email
	 * @apiParam  {String{6..128}}     password  Activity's password
	 * @apiParam  {String{..128}}      [name]    Activity's name
	 * @apiParam  {String=activity,admin}  [role]    Activity's role
	 * (You must be an admin to change the activity's role)
	 *
	 * @apiSuccess {String}  id         Activity's id
	 * @apiSuccess {String}  name       Activity's name
	 * @apiSuccess {String}  email      Activity's email
	 * @apiSuccess {String}  role       Activity's role
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated activitys can modify the data
	 * @apiError (Forbidden 403)    Forbidden    Only activity with same id or admins can modify the data
	 * @apiError (Not Found 404)    NotFound     Activity does not exist
	 */
	.patch(authorize(LOGGED_USER), validate(update), controller.update)
	/**
	 * @api {patch} v1/activities/:id Delete Activity
	 * @apiDescription Delete a activity
	 * @apiVersion 1.0.0
	 * @apiName DeleteResult
	 * @apiGroup Activity
	 * @apiPermission activity
	 *
	 * @apiHeader {String} Authorization   Activity's access token
	 *
	 * @apiSuccess (No Content 204)  Successfully deleted
	 *
	 * @apiError (Unauthorized 401) Unauthorized  Only authenticated activitys can delete the data
	 * @apiError (Forbidden 403)    Forbidden     Only activity with same id or admins can delete the data
	 * @apiError (Not Found 404)    NotFound      Activity does not exist
	 */
	.delete(authorize(LOGGED_USER), controller.remove);

export default router;
