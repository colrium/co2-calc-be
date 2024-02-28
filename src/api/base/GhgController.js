/** @format */

import httpStatus from "http-status";
import lodash from "lodash";
import mongoose from 'mongoose';
import pluralize from "pluralize";
import { defaultPagination } from "../../config/vars.js";
const { omit } = lodash;

export default class GhgController {
	constructor(config = {}) {
		const { model, subjectFilter, subjective } = config;
		this.model = model;
		this.subjectFilter = subjectFilter;
		this.subjective = subjective;
		this.loadLookups = this.loadLookups.bind(this);
		this.get = this.get.bind(this);
		this.create = this.create.bind(this);
		this.list = this.list.bind(this);
		this.replace = this.replace.bind(this);
		this.update = this.update.bind(this);
		this.remove = this.remove.bind(this);
		Object.assign(this, config);
	}
	loadLookups = async (req) => {
		const paths = this.model.schema.paths;
		const user = req.user;
		let userId = user?._id || user?.id;
		const lookupQueries = {
			...(typeof this.getLookupQueries === 'function' ? await this.getLookupQueries(req) : { ...this.lookupQueries })
		};
		const lookups = {};
		for (const [name, path] of Object.entries(paths)) {
			if (path instanceof mongoose.Schema.Types.ObjectId && name !== '_id') {
				const modelName = path.options.ref;
				const displayValue = path.options.displayValue || 'name';
				const foreignKey = path.options.foreignKey || '_id';
				const Model = mongoose.model(modelName);

				if (Model) {
					const lookupName = pluralize(modelName);
					const lookupQuery = name in lookupQueries ? { [foreignKey]: lookupQueries[name] } : {};
					lookups[lookupName] = await Model.find(lookupQuery).then((docs) =>
						docs.map((doc) => {
							let labelParts = displayValue.split(' ');
							let label = '';
							for (const labelPart of labelParts) {
								label += ` ${doc[labelPart]}`;
							}
							label = label.trim();
							return { value: doc[foreignKey], label: label };
						})
					);
				}
				
			}
		}
		return lookups;
	};
	get = async (req, res) => {
		const ContextModel = this.model;
		try {
			const id = req.params?.id;
			const response = {
				data: null,
				lookups: {}
			};
			if (Boolean(req.query.lookups)) {
				response.lookups = await this.loadLookups(req);
			}
			if (id && /^[a-fA-F0-9]{24}$/.test(id)) {
				const doc = await ContextModel?.get(id);
				if (doc) {
					response.data = doc.transform();
					return res.status(httpStatus.OK).json(response);
				} else {
					return res.status(httpStatus.NOT_FOUND).json({ message: httpStatus['404_MESSAGE'] });
				}
			} else if (['new', '0', 0].includes(id)) {
				response.data = new ContextModel({}).transform();				
				return res.status(httpStatus.OK).json(response);
			} else {
				return res.status(httpStatus.BAD_REQUEST).json({ message: httpStatus['422_MESSAGE'] });
			}
		} catch (error) {
			return res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).json(error);
		}
	};
	create = async (req, res, next) => {
		let data = { ...req.body };
		if (this.subjective) {
			const subject = this.subject || 'userId';
			const user = req.user;
			let userId = user?._id || user?.id;
			const subjectdata =
				typeof this.subjectData === 'function'
					? await this.subjectData(req)
					: {
							[subject]: user?.role === 'admin' && subject in req.body ? req.body[subject] : userId
					  };
			data = { ...data, ...subjectdata };
		}
		try {
			const doc = new this.model(data);
			const savedDoc = await doc.save();
			res.status(httpStatus.CREATED);
			res.json(savedDoc.transform());
		} catch (error) {
			next(error);
		}
	};


	list = async (req, res, next) => {
		const ContextModel = this.model;
		const subjectFilter = this.subjectFilter;
		let query = { ...req.query };
		if (this.subjective) {
			const subject = this.subject || 'userId';
			const user = req.user;
			let userId = user?._id || user?.id;
			const subjectQuery = {
				[subject]: user?.role === 'admin' && subject in req.query ? req.query[subject] : { $in: [userId, null] }
			};
			query = { ...req.query, ...subjectQuery };
		} else if (typeof subjectFilter === 'function') {
			const listQuery = await subjectFilter(req);
			query = { ...req.query, ...listQuery };
		}
		try {
			const { page = 1, perPage = defaultPagination } = query;
			const count = await ContextModel.count(query);
			const docs = await ContextModel.list(query);
			const data = docs.map((doc) => doc.transform());
			const pages = Math.ceil(count / perPage);
			res.json({ data: data, pages: pages, page, perPage, count });
		} catch (error) {
			next(error);
		}
	};
	replace = async (req, res, next) => {
		try {
			const ContextModel = this.model;
			const user = req.user;
			const newRecord = new ContextModel(req.body);
			let userId = user?._id || user?.id;
			if (user?.role === 'admin' && req.query?.userId) {
				userId = req.query?.userId || userId;
			}
			const ommitUserId = user.role !== 'admin' ? 'userId' : '';
			const newRecordObject = omit(newRecord.toObject(), '_id', ommitUserId);

			await ContextModel.updateOne(newRecordObject, { override: true, upsert: true });
			const savedDoc = await ContextModel.findById(req.params.id);

			res.json(savedDoc.transform());
		} catch (error) {
			next(error);
		}
	};

	/**
	 * Update existing activity
	 * @public
	 */
	update = async (req, res, next) => {
		const data = req.body;
		const id = req.params.id;
		try {
			const doc = await this.model.findByIdAndUpdate(id, omit(data, 'id'));
			if (doc) {
				const updatedDoc = await this.model.findById(id);
				res.json(updatedDoc.transform());
			} else {
				return res.status(httpStatus.NOT_FOUND).json({ message: httpStatus['404_MESSAGE'] });
			}
		} catch (error) {
			next(error)
		}
	}

	/**
	 * Delete activity
	 * @public
	 */
	remove = (req, res, next) => {
		const user = req.user;

		this.model
			.remove({ _id: req.params.id, ...(user?.role !== 'admin' ? { userId: user?._id } : {}) })
			.then(() => res.status(httpStatus.NO_CONTENT).end())
			.catch((e) => next(e));
	};
}
