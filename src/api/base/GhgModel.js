/** @format */

const mongoose = require('mongoose');
const { omitBy, isNil } = require('lodash');

class GhgModel extends mongoose.Schema {
	constructor(...args) {
		super(...args);
		this.initGhgMethods();
		this.initGhgStatics();
	}

	initGhgMethods() {
		const pathnames = Object.keys(this.paths);
		const paths = Object.values(this.paths);
		const excludedPathnames = paths.reduce((acc, curr, index) => {
			if (curr.internal) {
				acc.push(pathnames[index]);
			}
			return acc;
		}, ['_id', '_v']);
		this.pathnames = pathnames;
		this.method({
			transform() {
				const transformed = {};
				const fields = ['id', ...pathnames.filter((pathname) => !excludedPathnames.includes(pathname))];

				fields.forEach((field) => {
					transformed[field] = this[field];
				});

				return transformed;
			}
		});
	}

	initGhgStatics() {
		const currentStatics = this.statics;
		this.statics = {
			/**
			 * Get factor
			 *
			 * @param {ObjectId} id - The objectId of factor.
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
			/**
			 * List factors in descending order of 'createdAt' timestamp.
			 *
			 * @param {number} skip - Number of factors to be skipped.
			 * @param {number} limit - Limit number of factors to be returned.
			 * @returns {Promise<Factor[]>}
			 */
			list({ page = 1, perPage = 30, sort = 'createdAt', sortDir=-1, select, ...query }) {
				const findQuery = omitBy({ ...query }, isNil);
				const options = Object.entries(findQuery).reduce((acc, [key, value]) => {
					try {
						acc[key] = JSON.parse(value.replaceAll(`'`, '"'));
					} catch (error) {
						acc[key] = value;
					}
					return acc;
				}, {});

				return this.find(options)
					.sort({ [sort]: parseInt(sortDir) })
					.skip(perPage * (page - 1))
					.limit(perPage)
					.exec();
			},
			count({ page = 1, perPage = 30, sort, ...query }) {
				// const options = omitBy({ ...query }, isNil);
				const options = Object.entries(omitBy({ ...query }, isNil)).reduce((acc, [key, value]) => {
					try {
						acc[key] = JSON.parse(value.replaceAll(`'`, '"'));
					} catch (error) {}
					return acc;
				}, {});

				return this.countDocuments(options).exec();
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

module.exports = GhgModel;
