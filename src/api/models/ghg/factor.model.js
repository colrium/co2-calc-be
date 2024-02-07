/** @format */

const mongoose = require('mongoose');
const { omitBy, isNil } = require('lodash');
const GhgModel = require('../../base/GhgModel');

const schema = new GhgModel(
	{
		name: {
			type: String,
			required: true,
			// unique: true,
			trim: true,
			// lowercase: true
		},
		emissionsType: {
			type: String,
			required: true
		},
		unit: {
			type: String,
			// required: true
		},
		categoryName: {
			type: String
		},
		region: {
			type: String,
		},
		yearFrom: {
			type: Number,
			min: 2000,
			max: 2050
		},
		yearTo: {
			type: Number,
			min: 2000,
			max: 2050
		},
		emmissionFactor: {
			type: Number,
			default: 0
		},
		sections: [
			{
				type: String
			}
		],
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			default: null
		}
	},
	{
		timestamps: true
	}
);


/**
 * Statics
 */
schema.addStatics({
	

	/**
	 * Return new validation error
	 * if error is a mongoose duplicate key error
	 *
	 * @param {Error} error
	 * @returns {Error|APIError}
	 */
	checkDuplicateName(error) {
		if (error.name === 'MongoError' && error.code === 11000) {
			return new APIError({
				message: 'Validation Error',
				errors: [
					{
						field: 'name',
						location: 'body',
						messages: ['"name" already exists']
					}
				],
				status: httpStatus.CONFLICT,
				isPublic: true,
				stack: error.stack
			});
		}
		return error;
	}
});

const Factor = mongoose.model('Factor', schema);
module.exports = Factor;
