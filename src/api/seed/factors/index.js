/** @format */

const Factor = require('../../models/ghg/factor.model');
const seeds = require('./seeds.json');
/** @format */


const Context = Factor;
const uniqueField = 'name';
exports.seedFactors = async () => {
	const uniqueFieldValues = seeds.map((seed) => seed[uniqueField]);
	const existing = await Context.find({ [uniqueField]: { $in: uniqueFieldValues } }).lean();
	const existingValues = Array.isArray(existing) ? existing.map((doc) => doc[uniqueField]) : [];
	const inserts = seeds.filter((seed) => !existingValues.includes(seed[uniqueField])).map(({ id, ...seed }) => {
		const doc = new Context(seed);
		return doc;
	});
	if (inserts.length > 0) {
		return await Context.insertMany(inserts);
	}
	return [];
};
