/** @format */

const mongoose = require('mongoose');
const GhgModel = require('../../base/GhgModel');

const Gas = GhgModel.create(
	'Gas',
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true
		},
		label: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
);
// const Gas = mongoose.model('Gas', schema);
module.exports = Gas;
