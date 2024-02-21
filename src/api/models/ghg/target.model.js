/** @format */

const mongoose = require('mongoose');
const GhgModel = require('../../base/GhgModel');

const Target = GhgModel.create(
	'Target',
	{
		totalEmission: {
			type: Number,
			required: true,
			default: 0
		},
		deadline: {
			type: Date,
			required: true
		},
		domainId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Domain',
			default: null
		}
	},
	{
		timestamps: true
	}
);
module.exports = Target;
