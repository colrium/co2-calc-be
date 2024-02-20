/** @format */

const Joi = require('joi');
const Model = require('../../models/ghg/result.model');

const validatorFns = {
	String: Joi.string(),
	ObjectId: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
    Number: Joi.number()
};
const getValidations = (list=false) =>{
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
}
    


module.exports = {
	// GET /v1/results
	listResults: {
		query: {
			page: Joi.number().min(1),
			perPage: Joi.number().min(1).max(1000),
			...getValidations(true)
		}
	},

	// POST /v1/results
	createResult: {
		body: {
			...getValidations()
		}
	},

	// PUT /v1/results/:id
	replaceResult: {
		body: {
			...getValidations()
		},
		params: {
			id: Joi.string()
				.regex(/^[a-fA-F0-9]{24}$/)
				.required()
		}
	},

	// PATCH /v1/results/:id
	updateResult: {
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
