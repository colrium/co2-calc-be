/** @format */

const mongoose = require('mongoose');
const GhgModel = require('../../base/GhgModel');

const Domain = GhgModel.create(
	'Domain',
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		description: {
			type: String
		},
		industryId: {
			type: mongoose.Schema.Types.ObjectId,			
			ref: 'Industry',
			default: null
		},
		email: {
			type: String
		},
		active: {
			type: Boolean,
			default: true
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
module.exports = Domain;
