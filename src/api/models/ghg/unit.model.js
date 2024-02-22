/** @format */

import mongoose from "mongoose";
import GhgModel from "../../base/GhgModel.js";

const Unit = GhgModel.create(
	'Unit',
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
			default: null,
			displayValue: 'firstname lastname'
		}
	},
	{
		timestamps: true
	}
);
// const Unit = mongoose.model('Unit', schema);
export default Unit;
