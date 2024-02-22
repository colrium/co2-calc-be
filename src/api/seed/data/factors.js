import Factor from "../../models/ghg/factor.model.js";
import seeds from "./factors.json";

export default async () => {
	const existing = await Factor.find({}).lean();
	const existingNames = Array.isArray(existing) ? existing.map(({ name }) => name) : [];
	const inserts = seeds.filter(({ name }) => !existingNames.includes(name)).map(({ id, ...factor }) => factor);
	if (inserts.length > 0) {
		return await Factor.insertMany(data);
	}
	return []
};