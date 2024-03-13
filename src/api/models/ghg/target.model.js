/** @format */

import mongoose from "mongoose";
import GhgModel from "../../base/GhgModel.js";

const Target = GhgModel.create(
	'Target',
	{
		totalEmission: {
			type: Number,
			required: true,
			default: 0
		},
		targetDate: {
			type: Date,
			
			default: Date.now
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
export default Target;
