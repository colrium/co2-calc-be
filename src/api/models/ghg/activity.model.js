/** @format */

const mongoose = require('mongoose');
const { omitBy, isNil } = require('lodash');
const GhgModel = require('../../base/GhgModel');

const Activity = GhgModel.create(
	'Activity',
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
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			displayValue: 'firstName',
			default: null
		}
	},
	{
		timestamps: true
	}
);



// const Activity = mongoose.model('Activity', schema);
module.exports = Activity;
