/** @format */

import mongoose from "mongoose";
import GhgModel from "../../base/GhgModel.js";

const Calculation = GhgModel.create(
	'Calculation',
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
		results: {
			type: Object,
			required: true,
			default: {}
		},
		total: {
			type: Number,
			default: 0.0
		},
		domainId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Domain',
			default: null,
			displayValue: 'name'
		}
	},
	{
		timestamps: true
	}
);
export default Calculation;
