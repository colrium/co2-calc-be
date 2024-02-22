/** @format */

import express from "express";
import validate from "express-validation";
import controller from "../../../controllers/ghg/factor.controller.js";
import { LOGGED_USER, authorize } from "../../../middlewares/auth.js";
import validitions from "../../../validations/ghg/factor.validation.js";
const { createFactor, listFactors, replaceFactor, updateFactor } = validitions;
const router = express.Router();


router
	.route('/')
	/**
	 * @api {get} v1/factors List Factors
	 * @apiDescription Get a list of factors
	 * @apiVersion 1.0.0
	 * @apiName ListFactors
	 * @apiGroup Factor
	 * @apiPermission admin
	 *
	 * @apiHeader {String} Authorization   Factor's access token
	 *
	 * @apiParam  {Number{1-}}         [page=1]     List page
	 * @apiParam  {Number{1-100}}      [perPage=1]  Factors per page
	 * @apiParam  {String}             [name]       Factor's name
	 * @apiParam  {String}             [email]      Factor's email
	 * @apiParam  {String=factor,admin}  [role]       Factor's role
	 *
	 * @apiSuccess {Object[]} factors List of factors.
	 *
	 * @apiError (Unauthorized 401)  Unauthorized  Only authenticated factors can access the data
	 * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
	 */
	.get(authorize(LOGGED_USER), validate(listFactors), controller.list)
	/**
	 * @api {post} v1/factors Create Factor
	 * @apiDescription Create a new factor
	 * @apiVersion 1.0.0
	 * @apiName CreateFactor
	 * @apiGroup Factor
	 * @apiPermission admin
	 *
	 * @apiHeader {String} Authorization   Factor's access token
	 *
	 * @apiParam  {String}             email     Factor's email
	 * @apiParam  {String{6..128}}     password  Factor's password
	 * @apiParam  {String{..128}}      [name]    Factor's name
	 * @apiParam  {String=factor,admin}  [role]    Factor's role
	 *
	 * @apiSuccess (Created 201) {String}  id         Factor's id
	 * @apiSuccess (Created 201) {String}  name       Factor's name
	 * @apiSuccess (Created 201) {String}  email      Factor's email
	 * @apiSuccess (Created 201) {String}  role       Factor's role
	 * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
	 *
	 * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
	 * @apiError (Unauthorized 401)  Unauthorized     Only authenticated factors can create the data
	 * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
	 */
	.post(authorize(LOGGED_USER), validate(createFactor), controller.create);


router
	.route('/:id')
	/**
	 * @api {get} v1/factors/:id Get Factor
	 * @apiDescription Get factor information
	 * @apiVersion 1.0.0
	 * @apiName GetFactor
	 * @apiGroup Factor
	 * @apiPermission factor
	 *
	 * @apiHeader {String} Authorization   Factor's access token
	 *
	 * @apiSuccess {String}  id         Factor's id
	 * @apiSuccess {String}  name       Factor's name
	 * @apiSuccess {String}  email      Factor's email
	 * @apiSuccess {String}  role       Factor's role
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated factors can access the data
	 * @apiError (Forbidden 403)    Forbidden    Only factor with same id or admins can access the data
	 * @apiError (Not Found 404)    NotFound     Factor does not exist
	 */
	.get(authorize(LOGGED_USER), controller.get)
	/**
	 * @api {put} v1/factors/:id Replace Factor
	 * @apiDescription Replace the whole factor document with a new one
	 * @apiVersion 1.0.0
	 * @apiName ReplaceFactor
	 * @apiGroup Factor
	 * @apiPermission factor
	 *
	 * @apiHeader {String} Authorization   Factor's access token
	 *
	 * @apiParam  {String}             email     Factor's email
	 * @apiParam  {String{6..128}}     password  Factor's password
	 * @apiParam  {String{..128}}      [name]    Factor's name
	 * @apiParam  {String=factor,admin}  [role]    Factor's role
	 * (You must be an admin to change the factor's role)
	 *
	 * @apiSuccess {String}  id         Factor's id
	 * @apiSuccess {String}  name       Factor's name
	 * @apiSuccess {String}  email      Factor's email
	 * @apiSuccess {String}  role       Factor's role
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated factors can modify the data
	 * @apiError (Forbidden 403)    Forbidden    Only factor with same id or admins can modify the data
	 * @apiError (Not Found 404)    NotFound     Factor does not exist
	 */
	.put(authorize(LOGGED_USER), validate(replaceFactor), controller.replace)
	/**
	 * @api {patch} v1/factors/:id Update Factor
	 * @apiDescription Update some fields of a factor document
	 * @apiVersion 1.0.0
	 * @apiName UpdateFactor
	 * @apiGroup Factor
	 * @apiPermission factor
	 *
	 * @apiHeader {String} Authorization   Factor's access token
	 *
	 * @apiParam  {String}             email     Factor's email
	 * @apiParam  {String{6..128}}     password  Factor's password
	 * @apiParam  {String{..128}}      [name]    Factor's name
	 * @apiParam  {String=factor,admin}  [role]    Factor's role
	 * (You must be an admin to change the factor's role)
	 *
	 * @apiSuccess {String}  id         Factor's id
	 * @apiSuccess {String}  name       Factor's name
	 * @apiSuccess {String}  email      Factor's email
	 * @apiSuccess {String}  role       Factor's role
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated factors can modify the data
	 * @apiError (Forbidden 403)    Forbidden    Only factor with same id or admins can modify the data
	 * @apiError (Not Found 404)    NotFound     Factor does not exist
	 */
	.patch(authorize(LOGGED_USER), validate(updateFactor), controller.update)
	/**
	 * @api {patch} v1/factors/:id Delete Factor
	 * @apiDescription Delete a factor
	 * @apiVersion 1.0.0
	 * @apiName DeleteFactor
	 * @apiGroup Factor
	 * @apiPermission factor
	 *
	 * @apiHeader {String} Authorization   Factor's access token
	 *
	 * @apiSuccess (No Content 204)  Successfully deleted
	 *
	 * @apiError (Unauthorized 401) Unauthorized  Only authenticated factors can delete the data
	 * @apiError (Forbidden 403)    Forbidden     Only factor with same id or admins can delete the data
	 * @apiError (Not Found 404)    NotFound      Factor does not exist
	 */
	.delete(authorize(LOGGED_USER), controller.remove);

export default router;
