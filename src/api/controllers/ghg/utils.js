/** @format */

const mongoose = require('mongoose');

exports.loadLookups = async (model) => {
	const paths = model.schema.paths;
	const lookups = {};
	for (const [name, path] of Object.entries(paths)) {
		if (path instanceof mongoose.Schema.Types.ObjectId && name !== '_id') {
			const modelName = path.options.ref;
			const displayValue = path.options.displayValue || 'name';
			const Model = mongoose.model(modelName);
			if (Model) {
				lookups[modelName] = await Model.find({}).then((docs) =>
					docs.map((doc) => ({ value: doc._id, label: doc[displayValue] }))
				);
			}
			const pathModel = console.log('path', Model);
		}
	}
	return lookups;
};
