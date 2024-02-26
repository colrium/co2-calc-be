/** @format */

import express from "express";
import validate from "express-validation";
import controller from "../../../controllers/ghg/domain.controller.js";
import { LOGGED_USER, authorize } from "../../../middlewares/auth.js";
import validitions from "../../../validations/ghg/domain.validation.js";
const { create, list, replace, update } = validitions;
const router = express.Router();

router
	.route('/')
	/**
	 * @api {get} v1/domains List Domains
	 * @apiDescription Get a list of domain
	 * @apiVersion 1.0.0
	 * @apiName list
	 * @apiGroup Domain
	 * @apiPermission admin
	 *
	 * @apiHeader {String} Authorization   Domain's access token
	 *
	 * @apiParam  {Number{1-}}         [page=1]     List page
	 * @apiParam  {Number{1-100}}      [perPage=1]  Domains per page
	 * @apiParam  {String}             [name]       Domain's name
	 *
	 * @apiSuccess {Object[]} domain List of domain.
	 *
	 * @apiError (Unauthorized 401)  Unauthorized  Only authenticated domain can access the data
	 * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
	 */
	.get(authorize(LOGGED_USER), validate(list), controller.list)
	/**
	 * @api {post} v1/domains Create Domain
	 * @apiDescription Create a new result
	 * @apiVersion 1.0.0
	 * @apiName create
	 * @apiGroup Domain
	 * @apiPermission admin
	 *
	 * @apiHeader {String} Authorization   Domain's access token
	 *
	 * @apiParam  {String}             email     Domain's email
	 * @apiParam  {String{6..128}}     password  Domain's password
	 * @apiParam  {String{..128}}      [name]    Domain's name
	 * @apiParam  {String=result,admin}  [role]    Domain's role
	 *
	 * @apiSuccess (Created 201) {String}  id         Domain's id
	 * @apiSuccess (Created 201) {String}  name       Domain's name
	 * @apiSuccess (Created 201) {String}  email      Domain's email
	 * @apiSuccess (Created 201) {String}  role       Domain's role
	 * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
	 *
	 * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
	 * @apiError (Unauthorized 401)  Unauthorized     Only authenticated domain can create the data
	 * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
	 */
	.post(authorize(LOGGED_USER), validate(create), controller.create);

router
	.route('/:id')
	/**
	 * @api {get} v1/domains/:id Get Domain
	 * @apiDescription Get result information
	 * @apiVersion 1.0.0
	 * @apiName GetDomain
	 * @apiGroup Domain
	 * @apiPermission result
	 *
	 * @apiHeader {String} Authorization   Domain's access token
	 *
	 * @apiSuccess {String}  id         Domain's id
	 * @apiSuccess {String}  name       Domain's name
	 * @apiSuccess {String}  email      Domain's email
	 * @apiSuccess {String}  role       Domain's role
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated domain can access the data
	 * @apiError (Forbidden 403)    Forbidden    Only result with same id or admins can access the data
	 * @apiError (Not Found 404)    NotFound     Domain does not exist
	 */
	.get(authorize(LOGGED_USER), controller.get)
	/**
	 * @api {put} v1/domains/:id Replace Domain
	 * @apiDescription Replace the whole result document with a new one
	 * @apiVersion 1.0.0
	 * @apiName replace
	 * @apiGroup Domain
	 * @apiPermission result
	 *
	 * @apiHeader {String} Authorization   Domain's access token
	 *
	 * @apiParam  {String}             email     Domain's email
	 * @apiParam  {String{6..128}}     password  Domain's password
	 * @apiParam  {String{..128}}      [name]    Domain's name
	 * @apiParam  {String=result,admin}  [role]    Domain's role
	 * (You must be an admin to change the result's role)
	 *
	 * @apiSuccess {String}  id         Domain's id
	 * @apiSuccess {String}  name       Domain's name
	 * @apiSuccess {String}  email      Domain's email
	 * @apiSuccess {String}  role       Domain's role
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated domain can modify the data
	 * @apiError (Forbidden 403)    Forbidden    Only result with same id or admins can modify the data
	 * @apiError (Not Found 404)    NotFound     Domain does not exist
	 */
	.put(authorize(LOGGED_USER), validate(replace), controller.replace)
	/**
	 * @api {patch} v1/domains/:id Update Domain
	 * @apiDescription Update some fields of a result document
	 * @apiVersion 1.0.0
	 * @apiName update
	 * @apiGroup Domain
	 * @apiPermission result
	 *
	 * @apiHeader {String} Authorization   Domain's access token
	 *
	 * @apiParam  {String}             email     Domain's email
	 * @apiParam  {String{6..128}}     password  Domain's password
	 * @apiParam  {String{..128}}      [name]    Domain's name
	 * @apiParam  {String=result,admin}  [role]    Domain's role
	 * (You must be an admin to change the result's role)
	 *
	 * @apiSuccess {String}  id         Domain's id
	 * @apiSuccess {String}  name       Domain's name
	 * @apiSuccess {String}  email      Domain's email
	 * @apiSuccess {String}  role       Domain's role
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated domain can modify the data
	 * @apiError (Forbidden 403)    Forbidden    Only result with same id or admins can modify the data
	 * @apiError (Not Found 404)    NotFound     Domain does not exist
	 */
	.patch(authorize(LOGGED_USER), validate(update), controller.update)
	/**
	 * @api {patch} v1/domains/:id Delete Domain
	 * @apiDescription Delete a result
	 * @apiVersion 1.0.0
	 * @apiName DeleteDomain
	 * @apiGroup Domain
	 * @apiPermission result
	 *
	 * @apiHeader {String} Authorization   Domain's access token
	 *
	 * @apiSuccess (No Content 204)  Successfully deleted
	 *
	 * @apiError (Unauthorized 401) Unauthorized  Only authenticated domain can delete the data
	 * @apiError (Forbidden 403)    Forbidden     Only result with same id or admins can delete the data
	 * @apiError (Not Found 404)    NotFound      Domain does not exist
	 */
	.delete(authorize(LOGGED_USER), controller.remove);

export default router;
