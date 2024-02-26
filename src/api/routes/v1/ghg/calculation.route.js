/** @format */

import express from "express";
import validate from "express-validation";
import controller from "../../../controllers/ghg/calculation.controller.js";
import { LOGGED_USER, authorize } from "../../../middlewares/auth.js";
import validitions from "../../../validations/ghg/calculation.validation.js";
const { createCalculation, listCalculations, replaceCalculation, updateCalculation } = validitions;
const router = express.Router();

router
	.route('/')
	/**
	 * @api {get} v1/calculations List Calculations
	 * @apiDescription Get a list of calculations
	 * @apiVersion 1.0.0
	 * @apiName ListCalculations
	 * @apiGroup Calculation
	 * @apiPermission user
	 *
	 * @apiHeader {String} Authorization   Calculation's access token
	 *
	 * @apiParam  {Number{1-}}         [page=1]     List page
	 * @apiParam  {Number{1-100}}      [perPage=1]  records per page
	 *
	 * @apiSuccess {Object[]} calculations List of calculations.
	 *
	 * @apiError (Unauthorized 401)  Unauthorized  Only authenticated calculations can access the data
	 * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
	 */
	.get(authorize(LOGGED_USER), validate(listCalculations), controller.list)
	/**
	 * @api {post} v1/calculations Create Calculation
	 * @apiDescription Create a new calculation
	 * @apiVersion 1.0.0
	 * @apiName CreateCalculation
	 * @apiGroup Calculation
	 * @apiPermission admin
	 *
	 * @apiHeader {String} Authorization   Calculation's access token
	 *
	 * @apiParam  {String}             email     Calculation's email
	 * @apiParam  {String{6..128}}     password  Calculation's password
	 * @apiParam  {String{..128}}      [name]    Calculation's name
	 * @apiParam  {String=calculation,admin}  [role]    Calculation's role
	 *
	 * @apiSuccess (Created 201) {String}  id         Calculation's id
	 * @apiSuccess (Created 201) {String}  name       Calculation's name
	 * @apiSuccess (Created 201) {String}  email      Calculation's email
	 * @apiSuccess (Created 201) {String}  role       Calculation's role
	 * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
	 *
	 * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
	 * @apiError (Unauthorized 401)  Unauthorized     Only authenticated calculations can create the data
	 * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
	 */
	.post(authorize(LOGGED_USER), validate(createCalculation), controller.create);

router
	.route('/:id')
	/**
	 * @api {get} v1/calculations/:id Get Calculation
	 * @apiDescription Get calculation information
	 * @apiVersion 1.0.0
	 * @apiName GetCalculation
	 * @apiGroup Calculation
	 * @apiPermission calculation
	 *
	 * @apiHeader {String} Authorization   Calculation's access token
	 *
	 * @apiSuccess {String}  id         Calculation's id
	 * @apiSuccess {String}  name       Calculation's name
	 * @apiSuccess {String}  email      Calculation's email
	 * @apiSuccess {String}  role       Calculation's role
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated calculations can access the data
	 * @apiError (Forbidden 403)    Forbidden    Only calculation with same id or admins can access the data
	 * @apiError (Not Found 404)    NotFound     Calculation does not exist
	 */
	.get(authorize(LOGGED_USER), controller.get)
	/**
	 * @api {put} v1/calculations/:id Replace Calculation
	 * @apiDescription Replace the whole calculation document with a new one
	 * @apiVersion 1.0.0
	 * @apiName ReplaceCalculation
	 * @apiGroup Calculation
	 * @apiPermission calculation
	 *
	 * @apiHeader {String} Authorization   Calculation's access token
	 *
	 * @apiParam  {String}             email     Calculation's email
	 * @apiParam  {String{6..128}}     password  Calculation's password
	 * @apiParam  {String{..128}}      [name]    Calculation's name
	 * @apiParam  {String=calculation,admin}  [role]    Calculation's role
	 * (You must be an admin to change the calculation's role)
	 *
	 * @apiSuccess {String}  id         Calculation's id
	 * @apiSuccess {String}  name       Calculation's name
	 * @apiSuccess {String}  email      Calculation's email
	 * @apiSuccess {String}  role       Calculation's role
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated calculations can modify the data
	 * @apiError (Forbidden 403)    Forbidden    Only calculation with same id or admins can modify the data
	 * @apiError (Not Found 404)    NotFound     Calculation does not exist
	 */
	.put(authorize(LOGGED_USER), validate(replaceCalculation), controller.replace)
	/**
	 * @api {patch} v1/calculations/:id Update Calculation
	 * @apiDescription Update some fields of a calculation document
	 * @apiVersion 1.0.0
	 * @apiName UpdateCalculation
	 * @apiGroup Calculation
	 * @apiPermission calculation
	 *
	 * @apiHeader {String} Authorization   Calculation's access token
	 *
	 * @apiParam  {String}             email     Calculation's email
	 * @apiParam  {String{6..128}}     password  Calculation's password
	 * @apiParam  {String{..128}}      [name]    Calculation's name
	 * @apiParam  {String=calculation,admin}  [role]    Calculation's role
	 * (You must be an admin to change the calculation's role)
	 *
	 * @apiSuccess {String}  id         Calculation's id
	 * @apiSuccess {String}  name       Calculation's name
	 * @apiSuccess {String}  email      Calculation's email
	 * @apiSuccess {String}  role       Calculation's role
	 * @apiSuccess {Date}    createdAt  Timestamp
	 *
	 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
	 * @apiError (Unauthorized 401) Unauthorized Only authenticated calculations can modify the data
	 * @apiError (Forbidden 403)    Forbidden    Only calculation with same id or admins can modify the data
	 * @apiError (Not Found 404)    NotFound     Calculation does not exist
	 */
	.patch(authorize(LOGGED_USER), validate(updateCalculation), controller.update)
	/**
	 * @api {patch} v1/calculations/:id Delete Calculation
	 * @apiDescription Delete a calculation
	 * @apiVersion 1.0.0
	 * @apiName DeleteCalculation
	 * @apiGroup Calculation
	 * @apiPermission calculation
	 *
	 * @apiHeader {String} Authorization   Calculation's access token
	 *
	 * @apiSuccess (No Content 204)  Successfully deleted
	 *
	 * @apiError (Unauthorized 401) Unauthorized  Only authenticated calculations can delete the data
	 * @apiError (Forbidden 403)    Forbidden     Only calculation with same id or admins can delete the data
	 * @apiError (Not Found 404)    NotFound      Calculation does not exist
	 */
	.delete(authorize(LOGGED_USER), controller.remove);

export default router;
