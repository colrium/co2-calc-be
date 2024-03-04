/**
 * eslint-disable no-param-reassign
 *
 * @format
 */

/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */

const deleteAtPath = (obj, path, index) => {
	if (index === path.length - 1) {
		delete obj[path[index]];
		return;
	}
	deleteAtPath(obj[path[index]], path, index + 1);
};

// const transform = (doc, ret, options) => {}

export const toJSON = (schema) => {
	let transformer = schema.options.toJSON?.transform;
	schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
		transform(doc, ret, options) {
			ret.id = ret._id.toString();
			Object.keys(schema.virtuals)
				.filter((vPath) => /^[A-Z]/.test(vPath))
				.forEach((vPathToDelete) => delete ret[vPathToDelete]);
			Object.entries(schema.paths)
				.filter(([, pProps]) => pProps?.options?.private)
				.forEach(([pName]) => deleteAtPath(ret, pName.split('.'), 0));

			delete ret._id;
			delete ret.__v;
			if (transform) {
				return transformer(doc, ret, options);
			}
		}
	});
};

export default toJSON;
