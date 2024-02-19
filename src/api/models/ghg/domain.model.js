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
		industry: {
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Industry'
		},
		email: {
			type: String,
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
const Domain = mongoose.model('Domain', schema);
module.exports = Domain;
