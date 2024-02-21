/** @format */

const mongoose = require('mongoose');
const GhgModel = require('../../base/GhgModel');

const Material = GhgModel(
	'Material',
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
		},
		yearFrom: {
			type: Number,
			min: 2000,
			max: 2050,
			default: 2024
		},
		yearTo: {
			type: Number,
			min: 2000,
			max: 2050,
			default: 2024
		},
		emissionFactor: {
			type: Number,
			default: 0
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

// const Material = mongoose.model('Material', schema);

module.exports = Material;
