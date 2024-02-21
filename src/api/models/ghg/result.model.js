/** @format */

const mongoose = require('mongoose');
const GhgModel = require('../../base/GhgModel');

const Result = GhgModel.create(
	'Result',
	{
		name: {
			type: String,
			required: true,
			// unique: true,
			trim: true
			// lowercase: true
		},
		description: {
			type: String
		},
		year: {
			type: Number,
			min: 2000,
			max: 2050,
			default: new Date().getFullYear()
		},
		type: {
			type: String,
			default: 'company',
			enum: ['company', 'product']
		},
		activities: {
			type: Object,
			required: true,
			default: {}
		},
		total: {
			type: Number,
			default: 0.0
		},
		domainId: {
			type: String,
			// ref: 'Domain',
			default: null,
			displayValue: 'name'
		}
	},
	{
		timestamps: true
	}
);
// const Result = mongoose.model('Result', schema);
module.exports = Result;
