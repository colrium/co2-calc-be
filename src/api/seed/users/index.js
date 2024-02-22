/** @format */

import { adminUser } from "../../../config/vars.js";
import User from "../../models/user.model.js";
import otherSeeds from "./seeds.json";

const Context = User;
const uniqueField = 'email';
export const seedUsers = async () => {
	const seeds = [...otherSeeds, {...adminUser, role: 'admin'}];
	const uniqueFieldValues = seeds.map((seed) => seed[uniqueField]);
	const existing = await Context.find({ [uniqueField]: { $in: uniqueFieldValues } }).lean();
	const existingValues = Array.isArray(existing) ? existing.map((doc) => doc[uniqueField]) : [];
	const inserts = seeds.filter((seed) => !existingValues.includes(seed[uniqueField])).map(({ id, ...seed }) => {
		const doc = new Context(seed);
		doc.sanitize();
		return doc;
	});
	if (inserts.length > 0) {
		return await Context.insertMany(inserts);
	}
	return [];
};