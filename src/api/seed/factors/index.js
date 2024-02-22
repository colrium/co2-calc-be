/** @format */

import Factor from "../../models/ghg/factor.model.js";
import seeds from "./seeds.json";
/** @format */


const Context = Factor;
const uniqueField = 'name';
export const seedFactors = async () => {
	const uniqueFieldValues = seeds.map((seed) => seed[uniqueField]);
	const existing = await Context.find({}).lean();
	const existingValues = Array.isArray(existing) ? existing.map((doc) => doc[uniqueField]) : [];
	const inserts = seeds.filter((seed) => !existingValues.includes(seed[uniqueField])).map(async ({ id, ...seed }) => {
		const doc = new Context(seed);
		try {
			await doc.save();
		} catch (error) {
			
		}
		return doc;
	});
	if (inserts.length > 0) {
		// return await Context.insertMany(inserts, {
		// 	'ordered': false, silent: true
		// });
	}
	return [];
};
