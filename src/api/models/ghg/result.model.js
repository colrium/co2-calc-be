/** @format */

const mongoose = require('mongoose');
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
		estimate: {
			type: Number,
			default: 0.0
		},
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
const Result = mongoose.model('Result', schema);
module.exports = Result;
