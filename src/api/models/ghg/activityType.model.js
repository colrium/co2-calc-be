import mongoose from "mongoose";
import GhgModel from "../../base/GhgModel.js";

const ActivityType = GhgModel.create(
	'ActivityType',
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
		scope: {
			type: String,
			enum: ['scope1', 'scope2', 'scope3us', 'scope3ds']
		},
		definition: {
			type: String
		},
		example: {
			type: String
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

// const ActivityType = mongoose.model('ActivityType', schema);

export default ActivityType;
