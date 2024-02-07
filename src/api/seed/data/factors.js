const Factor = require('../../models/ghg/factor.model');
const seeds = require('./factors.json');

module.exports = async () => {
	const existing = await Factor.find({}).lean();
	const existingNames = Array.isArray(existing) ? existing.map(({ name }) => name) : [];
	const inserts = seeds.filter(({ name }) => !existingNames.includes(name)).map(({ id, ...factor }) => factor);
	if (inserts.length > 0) {
		return await Factor.insertMany(data);
	}
	return []
};