/** @format */

const mongoose = require('mongoose');
const GhgModel = require('../../base/GhgModel');

const schema = new GhgModel(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		description: {
			type: String
		},
		averageEstimates: {
			type: Number,
			default: 0
		}
	},
	{
		timestamps: true
	}
);
const Industry = mongoose.model('Industry', schema);
module.exports = Industry;
