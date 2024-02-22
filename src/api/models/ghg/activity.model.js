/** @format */

import mongoose from "mongoose";
import GhgModel from "../../base/GhgModel.js";

const Activity = GhgModel.create(
	'Activity',
	{
		name: {
			type: String,
			required: true,
			// unique: true,
			trim: true
			// lowercase: true
		},
		emissionType: {
			type: String,
			enum: ['fossil', 'biogenic']
		},
		unit: {
			type: String
			// required: true
		},
		categoryName: {
			type: String
		},
		region: {
			type: String
		},
		yearFrom: {
			type: Number,
			min: 2000,
			max: 2050
		},
		yearTo: {
			type: Number,
			min: 2000,
			max: 2050
		},
		emissionFactor: {
			type: Number,
			default: 0
		},
		sections: [
			{
				type: String
			}
		],
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			displayValue: 'firstname lastname',
			default: null
		}
	},
	{
		timestamps: true
	}
);



// const Activity = mongoose.model('Activity', schema);
export default Activity;
