/** @format */

import GhgModel from "../../base/GhgModel.js";

const Gas = GhgModel.create(
	'Gas',
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
		}
	},
	{
		timestamps: true
	}
);
// const Gas = mongoose.model('Gas', schema);
export default Gas;
