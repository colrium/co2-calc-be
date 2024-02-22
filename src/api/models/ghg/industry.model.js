/** @format */

import GhgModel from "../../base/GhgModel.js";

const Industry = GhgModel.create(
	'Industry',
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		description: {
			type: String
		},
		annualAvgEmission: {
			type: Number,
			default: 0
		}
	},
	{
		timestamps: true
	}
);
// const Industry = mongoose.model('Industry', schema);
export default Industry;
