/** @format */

const mongoose = require('mongoose');
const GhgModel = require('../../base/GhgModel');

const schema = new GhgModel(
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
const Unit = mongoose.model('Unit', schema);
module.exports = Unit;
