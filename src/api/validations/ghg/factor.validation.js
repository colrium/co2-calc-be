/** @format */

const Joi = require('joi');
const Factor = require('../../models/ghg/factor.model');

module.exports = {
	// GET /v1/factors
	listFactors: {
		query: {
			page: Joi.number().min(1),
			perPage: Joi.number().min(1).max(100),
			name: Joi.string(),
			emissionsType: Joi.string(),
			unit: Joi.any(),
			categoryName: Joi.string(),
			region: Joi.string(),
			yearFrom: Joi.number(),
			yearTo: Joi.number(),
			emmissionFactor: Joi.number(),
			sections: Joi.string(),
			userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/)
		}
	},

	// POST /v1/factors
	createFactor: {
		body: {
			name: Joi.string(),
			emissionsType: Joi.string(),
			unit: Joi.any(),
			categoryName: Joi.string(),
			region: Joi.string(),
			yearFrom: Joi.number(),
			yearTo: Joi.number(),
			emmissionFactor: Joi.number(),
			sections: Joi.array().items(Joi.number(), Joi.string()).default([]),
			userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/)
		}
	},

	// PUT /v1/factors/:factorId
	replaceFactor: {
		body: {
			name: Joi.string(),
			emissionsType: Joi.string(),
			unit: Joi.any(),
			categoryName: Joi.string(),
			region: Joi.string(),
			yearFrom: Joi.number(),
			yearTo: Joi.number(),
			emmissionFactor: Joi.number(),
			sections: Joi.array().items(Joi.number(), Joi.string()).default([]),
			userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/)
		},
		params: {
			factorId: Joi.string()
				.regex(/^[a-fA-F0-9]{24}$/)
				.required()
		}
	},

	// PATCH /v1/factors/:factorId
	updateFactor: {
		body: {
			name: Joi.string(),
			emissionsType: Joi.string(),
			unit: Joi.any(),
			categoryName: Joi.string(),
			region: Joi.string(),
			yearFrom: Joi.number(),
			yearTo: Joi.number(),
			emmissionFactor: Joi.number(),
			sections: Joi.array().items(Joi.number(), Joi.string()).default([]),
			userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/)
		},
		params: {
			factorId: Joi.string()
				.regex(/^[a-fA-F0-9]{24}$/)
				.required()
		}
	}
};
