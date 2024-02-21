/** @format */

const mongoose = require('mongoose');
const GhgModel = require('../../base/GhgModel');

const Industry = GhgModel.create(
	'Industry',
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		description: {
			type: String
		},
		annualAvgEmission: {
			type: Number,
			default: 0
		}
	},
	{
		timestamps: true
	}
);
// const Industry = mongoose.model('Industry', schema);
module.exports = Industry;
