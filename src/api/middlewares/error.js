/** @format */

import { ValidationError } from 'express-validation';
import APIError from 'ghg-be/api/errors/api-error.js';
import { env } from 'ghg-be/config/vars.js';
import httpStatus from 'http-status';
/**
 * Error handler. Send stacktrace only during development
 * @public
 */
export const handler = (err, req, res, next) => {
	const response = {
		code: err.status,
		message: err.message || httpStatus[err.status],
		errors: err.errors,
		stack: err.stack
	};

	if (env !== 'development') {
		delete response.stack;
	}

	res.status(err.status);
	res.json(response);
};

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
export const converter = (err, req, res, next) => {
	let convertedError = err;

	if (err instanceof ValidationError) {
		convertedError = new APIError({
			message: 'Validation Error',
			errors: err.errors,
			status: err.status,
			stack: err.stack
		});
	} else if (!(err instanceof APIError)) {
		convertedError = new APIError({
			message: err.message,
			status: err.status,
			stack: err.stack
		});
	}

	return handler(convertedError, req, res);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
export const notFound = (req, res, next) => {
	const err = new APIError({
		message: 'Not found',
		status: httpStatus.NOT_FOUND
	});
	return handler(err, req, res);
};
