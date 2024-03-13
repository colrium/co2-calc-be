/** @format */

import dayjs from "dayjs";
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
		year: {
			type: Number,			
			default: dayjs().year()
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
