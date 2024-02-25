/** @format */

import ActivityType from "../../models/ghg/activityType.model.js";
import seeds from "./seeds.json" with { type: "json" };
/** @format */


const Context = ActivityType;
const uniqueField = 'name';
export const seedActivityTypes = async () => {
	const uniqueFieldValues = seeds.map((seed) => seed[uniqueField]);
	const existing = await Context.find({ [uniqueField]: { $in: uniqueFieldValues } }).lean();
	const existingValues = Array.isArray(existing) ? existing.map((doc) => doc[uniqueField]) : [];
	const inserts = seeds.filter((seed) => !existingValues.includes(seed[uniqueField])).map(({ id, ...seed }) => new Context(seed));
	if (inserts.length > 0) {
		return await Context.insertMany(inserts);
	}
	return [];
};