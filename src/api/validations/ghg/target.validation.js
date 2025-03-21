/** @format */

import Joi from 'joi';
import Model from '../../models/ghg/target.model.js';

const validatorFns = {
	String: Joi.string(),
	ObjectId: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
	Number: Joi.number()
};
const getValidations = (list = false) => {
	const validations = {};
	const skipPaths = ['_id', '__v', 'updatedAt', 'createdAt'];

	for (const [name, path] of Object.entries(Model.schema.paths)) {
		const { instance, min, max, required } = path;
		if (instance in validatorFns && !skipPaths.includes(name)) {
			let pathValidation = validatorFns[instance];
			if (required && !list) {
				pathValidation = pathValidation.required();
			}
			validations[name] = pathValidation;
		}
	}
};

export default {
	// GET /v1/activities
	list: {
		query: {
			page: Joi.number().min(1),
			perPage: Joi.number().min(1).max(1000),
			...getValidations(true)
		}
	},
	// GET /v1/activities/:id
	get: {
		params: {
			id: Joi.alternatives()
				.try(Joi.string(), Joi.string().regex(/^[a-fA-F0-9]{24}$/))
				.required()
		}
	},
	// POST /v1/activities
	create: {
		body: {
			...getValidations()
		}
	},

	// PUT /v1/activities/:id
	replace: {
		body: {
			...getValidations()
		},
		params: {
			id: Joi.string()
				.regex(/^[a-fA-F0-9]{24}$/)
				.required()
		}
	},

	// PATCH /v1/activities/:id
	update: {
		body: {
			...getValidations()
		},
		params: {
			id: Joi.string()
				.regex(/^[a-fA-F0-9]{24}$/)
				.required()
		}
	}
};
