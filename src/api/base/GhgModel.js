/** @format */

import httpStatus from 'http-status';
import lodash from 'lodash';
import mongoose from "mongoose";
import { defaultPagination } from '../../config/vars.js';
import APIError from '../errors/api-error.js';
const { omit } = lodash;
export const reservedWords = ['perPage', 'page', 'sort', 'sortDir', 'select', 'populate', 'lookup', 'lean'];
export const omitReservedKeys = (q) => {
	return omit({ ...q }, reservedWords);
};
export const deleteAtPath = (obj, path, index) => {
	if (index === path.length - 1) {
		delete obj[path[index]];
		return;
	}
	deleteAtPath(obj[path[index]], path, index + 1);
};
export const evalSoftLookups = async (model) => {
	const paths = model.schema.paths;
	const lookups = {};
	for (const [name, path] of Object.entries(paths)) {
		if (path instanceof mongoose.Schema.Types.ObjectId && name !== '_id') {
			const modelName = path.options.ref;
			const displayValue = path.options.displayValue || 'name';
			const Model = mongoose.model(modelName);
			if (Model) {
				lookups[name] = { [displayValue]: 1 };
			}
		}
	}
	return lookups;
};
export class GhgSchema extends mongoose.Schema {
	constructor(...args) {
		super(...args);
		this.initGhgMethods = this.initGhgMethods.bind(this);
		this.initGhgStatics = this.initGhgStatics.bind(this);
		this.initVirtuals = this.initVirtuals.bind(this);
		this.initGhgMethods();
		this.initGhgStatics();
		this.initVirtuals();
	}

	initVirtuals(){
		const { transform: jsonTransformer, ...toJSON } = { ...this.options.toJSON };
		this.set('toJSON', {
			virtuals: true,
			getters: true,
			...toJSON,
			transform: function (model, ret, options) {
				ret.id = ret._id.toString();
				const virtualPaths = model.schema.virtuals;
				const vPaths = Object.entries(virtualPaths)
					.filter(([vPathName, vPath]) => !(vPath.private || vPath.internal))
					.map(([vPathName]) => vPathName);
				const privatePathnames = Object.entries(model.schema.paths)
					.filter(([, pProps]) => pProps?.options?.private || pProps?.options?.internal)
					.map(([pName]) => pName);

				// vPaths.forEach((pName) => deleteAtPath(ret, pName.split('.'), 0));
				vPaths.forEach((vPathName) => {
					ret[vPathName] = ret[vPathName];
				});
				privatePathnames.forEach((pName) => deleteAtPath(ret, pName.split('.'), 0));

				delete ret._id;
				delete ret.__v;
				if (jsonTransformer) {
					return jsonTransformer(model, ret, options);
				}
				return ret;
			}
		});
	}

	initGhgMethods() {
		const pathnames = Object.keys(this.paths);
		const paths = Object.values(this.paths);
		const virtuals = Object.values(this.virtuals);
		const excludedPathnames = paths.reduce(
			(acc, curr, index) => {
				if (curr.options.internal || curr.options.private) {
					acc.push(pathnames[index]);
				}
				return acc;
			},
			['_id', '_v']
		);
		this.pathnames = pathnames;
		
		this.method({
			transform() {
				const json = this.toJSON();
				
				const transformed = { id: json._id || json.id, ...json };
				const fields = [...pathnames.filter((pathname) => !excludedPathnames.includes(pathname))];
				
				fields.forEach((field) => {
					transformed[field] = json[field];
				});
				const data = transformed;
				delete data.__v;
				delete data._id;
				return data;
			}
		});
	}

	initGhgStatics() {
		const currentStatics = this.statics;
		this.statics = {
			/**
			 * Get record
			 *
			 * @param {ObjectId} id - The objectId of record.
			 * @returns {Promise<Factor, APIError>}
			 */
			async get(id) {
				let doc;

				if (mongoose.Types.ObjectId.isValid(id)) {
					doc = await this.findById(id).exec();
				}
				if (doc) {
					return doc;
				}

				throw new APIError({
					message: `Record with id ${id} does not exist`,
					status: httpStatus.NOT_FOUND
				});
			},
			
			parseQuery({
				page = 1,
				perPage = defaultPagination,
				sort = 'createdAt',
				sortDir = -1,
				select,
				populate = null,
				lookup = false,
				lookups,
				...query
			}) {
				const findQuery = omitReservedKeys(query);
				const options = Object.entries(findQuery).reduce((acc, [key, value]) => {
					try {
						acc[key] = JSON.parse(value.replaceAll(`'`, '"'));
					} catch (error) {
						acc[key] = value;
					}
					return acc;
				}, {});
				let findQ = this.find(options);
				if (sort) {
					findQ = findQ.sort({ [sort]: parseInt(sortDir) });
				}
				if (lookup) {
					const lookups = this.schema.lookups;
					if (Array.isArray(lookups)) {
						for (const { foreignField, localField, ref, virtualField, displayField } of lookups) {
							findQ = findQ.populate({
								path: virtualField,
								select: `${displayField}`,
								transform: (doc, id) => {
									if (!doc) {
										return id;
									}
									return displayField
										.split(' ')
										.reduce((acc, key) => {
											acc += doc[key] ? ' ' + doc[key] : '';
											return acc;
										}, '')
										.trim();
								}
							});
						}
					}
					
				}
				if (typeof select === 'string') {
					findQ = findQ.select(select.replaceAll(',', ' '));
				}
				if (populate) {
					findQ = findQ.populate(populate);
				}
				if (perPage >= 1 && page >= 1) {
					findQ = findQ.skip(perPage * (page - 1)).limit(perPage);
				}
				
				return findQ;
			},
			async list(query) {
				const findQuery = this.parseQuery(query);
				
				const results = await findQuery.exec();
				return await results;
			},
			count({ page = 1, perPage = defaultPagination, sort, sortDir, select, populate, shallowPopulate, lean, lookups, lookup, ...query }) {
				const findQuery = omitReservedKeys(query);
				const options = Object.entries(findQuery).reduce((acc, [key, value]) => {
					try {
						acc[key] = value;
					} catch (error) {}
					return acc;
				}, {});
				return this.countDocuments(options).exec();
			},
			async evalSoftLookups() {
				const virtuals = this.virtuals || this.schema.virtuals;
				const paths = this.paths || this.schema.paths;
				const fields = { ...paths, ...virtuals };
				const lookups = {};
				for (const [name, path] of Object.entries(fields)) {
					if (path.options.lookup && name !== '_id') {
						const modelName = path.options.lookup;
						const displayValue = path.options.displayValue || 'name';
						const Model = mongoose.model(modelName);
						if (Model) {
							// lookups[name] = { [displayValue]: 1 };
							lookups[name.replace('Id', '')] = displayValue;
						}
					}
				}
				return lookups;
			},
			...currentStatics
		};
	}
	addStatics(statics = {}) {
		const currentStatics = this.statics;
		this.statics = {
			...currentStatics,
			...statics
		};
	}
	addMethods(methods = {}) {
		const currentMethods = this.methods;
		this.methods = {
			...currentMethods,
			...methods
		};
	}
}
class GhgModel {
	static create(name, ...args) {
		const [paths, options = {}, ...rest] = args;
		const schema = new GhgSchema(...args);
		
		const lookups = [];
		const lookupFields = [];
		for (const [name, path] of Object.entries(schema.paths)) {
			if ((path.options.lookup || path.options.ref) && name !== '_id') {
				const modelName = path.options.lookup || path.options.ref;
				const displayValue = path.options.displayValue || 'name';
				// const Model = mongoose.model(modelName);
				if (modelName && name.endsWith('Id')) {
					// lookups[name] = { [displayValue]: 1 };
					lookupFields.push(name);
					lookups.push({
						virtualField: name.replaceAll('Id', ''),
						localField: name,
						ref: modelName,
						foreignField: '_id',
						displayField: displayValue,
						justOne: true
					});
				}
			}
		}
		schema.set('toObject', { virtuals: true });
		for (const { virtualField, ...lookup } of lookups) {
			schema.virtual(virtualField, lookup);
		}
		
		schema.lookups = lookups;
		schema.lookupFields = lookupFields;
		
		const model = mongoose.model(name, schema);
		/* const { transform: jsonTransformer, ...toJSON } = {...schema.options.toJSON};
		schema.set('toJSON', {
			virtuals: true,
			getters: true,
			...toJSON,
			transform: function (model, ret, options) {
				ret.id = ret._id.toString();
				const virtualPaths = model.schema.virtuals;
				const vPaths = Object.entries(virtualPaths)
					.filter(([vPathName, vPath]) => !(vPath.private || vPath.internal))
					.map(([vPathName]) => vPathName);
				const privatePathnames = Object.entries(model.schema.paths)
					.filter(([, pProps]) => pProps?.options?.private || pProps?.options?.internal)
					.map(([pName]) => pName);

				// vPaths.forEach((pName) => deleteAtPath(ret, pName.split('.'), 0));
				vPaths.forEach((vPathName) => {
					ret[vPathName] = ret[vPathName];
				});
				privatePathnames.forEach((pName) => deleteAtPath(ret, pName.split('.'), 0));

				delete ret._id;
				delete ret.__v;
				if (jsonTransformer) {
					return jsonTransformer(model, ret, options);
				}
				return ret
			}
		}); */
		
		
		
		return model;
	}
}
export default GhgModel;
