/** @format */

const ActivityType = require('../../models/ghg/activityType.model');
const seeds = require('./seeds.json');
/** @format */


const Context = ActivityType;
const uniqueField = 'name';
exports.seedActivityTypes = async () => {
	const uniqueFieldValues = seeds.map((seed) => seed[uniqueField]);
	const existing = await Context.find({ [uniqueField]: { $in: uniqueFieldValues } }).lean();
	const existingValues = Array.isArray(existing) ? existing.map((doc) => doc[uniqueField]) : [];
	const inserts = seeds.filter((seed) => !existingValues.includes(seed[uniqueField])).map(({ id, ...seed }) => new Context(seed));
	if (inserts.length > 0) {
		return await Context.insertMany(inserts);
	}
	return [];
};