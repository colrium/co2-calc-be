/** @format */

import express from "express";
import validate from "express-validation";
import controller from "../../../controllers/ghg/industry.controller.js";
import { LOGGED_USER, authorize } from "../../../middlewares/auth.js";
import validitions from "../../../validations/ghg/industry.validation.js";
const { create, list, replace, update } = validitions;
const router = express.Router();

router
	.route('/')
	/**
	 * @api {get} v1/industries List Industries
	 * @apiDescription Get a list of Industries
	 * @apiVersion 1.0.0
	 * @apiName list
	 * @apiGroup Result
	 * @apiPermission admin
	 *
	 * @apiHeader {String} Authorization   Result's access token
	 *
	 * @apiParam  {Number{1-}}         [page=1]     List page
	 * @apiParam  {Number{1-100}}      [perPage=1]  Industries per page
	 * @apiParam  {String}             [name]       Result's name
	 *
	 * @apiSuccess {Object[]} Industries List of Industries.
	 *
	 * @apiError (Unauthorized 401)  Unauthorized  Only authenticated Industries can access the data
	 * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
	 */
	.get(authorize(LOGGED_USER), validate(list), controller.list)
	/**
	 * @api {post} v1/industries Create Result
	 * @apiDescription Create a new Industry
	 * @apiVersion 1.0.0
	 * @apiName create
	 * @apiGroup Result
	 * @apiPermission admin
	 *
	 * @apiHeader {String} Authorization   Result's access token
	 *
	 * @apiParam  {String}             email     Result's email
	 * @apiParam  {String{6..128}}     password  Result's password
	 * @apiParam  {String{..128}}      [name]    Result's name
	 * @apiParam  {String=Industry,admin}  [role]    Result's role
	 *
	 * @apiSuccess (Created 201) {String}  id         Result's id
	 * @apiSuccess (Created 201) {String}  name       Result's name
	 * @apiSuccess (Created 201) {String}  email      Result's email
	 * @apiSuccess (Created 201) {String}  role       Result's role
	 * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
	 *
	 * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
	 * @apiError (Unauthorized 401)  Unauthorized     Only authenticated Industries can create the data
	 * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
	 */
	.post(authorize(LOGGED_USER), validate(create), controller.create);

router
	.route('/:id')
	/**
	 * @api {get} v1/industries/:id Get Result
	 * @apiDescription Get Industry information
	 * @apiVersion 1.0.0
	 * @apiName GetResult
	 * @apiGroup Result
	 * @apiPermission Industry
	 *
	 * @apiHeader {String} Authorization   Result's access token
	 *
	 * @apiSuccess {String}  id         Result's id
	 * @apiSuccess {String}  name       Result's name
	 * @apiSuccess {String}  email      Result's email
	 * @apiSuccess {String}  role       Result's role
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated Industries can access the data
	 * @apiError (Forbidden 403)    Forbidden    Only Industry with same id or admins can access the data
	 * @apiError (Not Found 404)    NotFound     Result does not exist
	 */
	.get(authorize(LOGGED_USER), controller.get)
	/**
	 * @api {put} v1/industries/:id Replace Result
	 * @apiDescription Replace the whole Industry document with a new one
	 * @apiVersion 1.0.0
	 * @apiName replace
	 * @apiGroup Result
	 * @apiPermission Industry
	 *
	 * @apiHeader {String} Authorization   Result's access token
	 *
	 * @apiParam  {String}             email     Result's email
	 * @apiParam  {String{6..128}}     password  Result's password
	 * @apiParam  {String{..128}}      [name]    Result's name
	 * @apiParam  {String=Industry,admin}  [role]    Result's role
	 * (You must be an admin to change the Industry's role)
	 *
	 * @apiSuccess {String}  id         Result's id
	 * @apiSuccess {String}  name       Result's name
	 * @apiSuccess {String}  email      Result's email
	 * @apiSuccess {String}  role       Result's role
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated Industries can modify the data
	 * @apiError (Forbidden 403)    Forbidden    Only Industry with same id or admins can modify the data
	 * @apiError (Not Found 404)    NotFound     Result does not exist
	 */
	.put(authorize(LOGGED_USER), validate(replace), controller.replace)
	/**
	 * @api {patch} v1/industries/:id Update Result
	 * @apiDescription Update some fields of a Industry document
	 * @apiVersion 1.0.0
	 * @apiName update
	 * @apiGroup Result
	 * @apiPermission Industry
	 *
	 * @apiHeader {String} Authorization   Result's access token
	 *
	 * @apiParam  {String}             email     Result's email
	 * @apiParam  {String{6..128}}     password  Result's password
	 * @apiParam  {String{..128}}      [name]    Result's name
	 * @apiParam  {String=Industry,admin}  [role]    Result's role
	 * (You must be an admin to change the Industry's role)
	 *
	 * @apiSuccess {String}  id         Result's id
	 * @apiSuccess {String}  name       Result's name
	 * @apiSuccess {String}  email      Result's email
	 * @apiSuccess {String}  role       Result's role
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated Industries can modify the data
	 * @apiError (Forbidden 403)    Forbidden    Only Industry with same id or admins can modify the data
	 * @apiError (Not Found 404)    NotFound     Result does not exist
	 */
	.patch(authorize(LOGGED_USER), validate(update), controller.update)
	/**
	 * @api {patch} v1/industries/:id Delete Result
	 * @apiDescription Delete a Industry
	 * @apiVersion 1.0.0
	 * @apiName DeleteResult
	 * @apiGroup Result
	 * @apiPermission Industry
	 *
	 * @apiHeader {String} Authorization   Result's access token
	 *
	 * @apiSuccess (No Content 204)  Successfully deleted
	 *
	 * @apiError (Unauthorized 401) Unauthorized  Only authenticated Industries can delete the data
	 * @apiError (Forbidden 403)    Forbidden     Only Industry with same id or admins can delete the data
	 * @apiError (Not Found 404)    NotFound      Result does not exist
	 */
	.delete(authorize(LOGGED_USER), controller.remove);

export default router;
