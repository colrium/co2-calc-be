/** @format */

import GhgModel from "../../base/GhgModel.js";

const Factor = GhgModel.create(
	'Factor',
	{
		name: {
			type: String,
			required: true,
			// unique: true,
			trim: true
			// lowercase: true
		},
		emissionType: {
			type: String,
			enum: ['fossil', 'biogenic']
		},
		unit: {
			type: String
			// required: true
		},
		categoryName: {
			type: String
		},
		region: {
			type: String
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
		emissionFactor: {
			type: Number,
			default: 0
		},
		sections: [
			{
				type: String
			}
		],
		userId: {
			type: String,
			ref: 'User',
			default: null,
			displayValue: 'firstname lastname'
		}
	},
	{
		timestamps: true
	}
);


/**
 * Statics
 */
Factor.schema.addStatics({
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

// const Factor = mongoose.model('Factor', schema);
export default Factor;
