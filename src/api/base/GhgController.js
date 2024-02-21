/** @format */

const { defaultPagination } = require('../../config/vars');

const mongoose = require('mongoose');
const { omitBy, isNil } = require('lodash');
const httpStatus = require('http-status');
const { omit } = require('lodash');

class GhgController {
	constructor(config = {}) {
		Object.assign(this, config);
	}
	loadLookups = async (req) => {
		const lookups = {};
		return lookups;
	};
	get = async (req, res) => {
		const ContextModel = this.model;
		try {
			const id = req.params?.id;
			if (id && /^[a-fA-F0-9]{24}$/.test(id)) {
				const doc = await ContextModel?.get(id);
				if (doc) {
					return res.status(httpStatus.OK).json(doc.transform());
				} else {
					return res.status(httpStatus.NOT_FOUND).json({ message: httpStatus['404_MESSAGE'] });
				}
			} else if (['new', '0', 0].includes(id)) {
				const response = {
					data: new ContextModel({}).transform()
				};
				if (Boolean(req.query.lookups)) {
					response.lookups = await this.loadLookups(req);
				}
				return res.status(httpStatus.OK).json(response);
			} else {
				return res.status(httpStatus.BAD_REQUEST).json({ message: httpStatus['422_MESSAGE'] });
			}
		} catch (error) {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error);
		}
	};
	create = async (req, res) => {
		let data = {...req.body}
		if (this.subjective) {
			const subject = this.subject || 'userId';
			const user = req.user;
			let userId = user?._id || user?.id;
			const subjectdata =typeof this.subject === 'function'? this.subject(req) :  {
				[subject]: user?.role === 'admin' && subject in req.body ? req.query[subject] : userId
			};
			data = { ...data, ...subjectdata };
		}
		try {
			const doc = new Activity(data);
			const savedDoc = await doc.save();
			res.status(httpStatus.CREATED);
			res.json(savedDoc.transform());
		} catch (error) {
			next(error);
		}
	};

	list = async (req, res) => {
		const ContextModel = this.model;
		let query = { ...req.query };
		if (this.subjective) {
			const subject = this.subject || 'userId';
			const user = req.user;
			let userId = user?._id || user?.id;
			const subjectQuery = {
				[subject]: user?.role === 'admin' && subject in req.query ? req.query[subject] : { $in: [null, userId] }
			};
			query = { ...req.query, ...subjectQuery };
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

			await Activity.updateOne(newRecordObject, { override: true, upsert: true });
			const savedDoc = await Activity.findById(req.params.id);

			res.json(savedDoc.transform());
		} catch (error) {
			next(error);
		}
	};

	/**
	 * Update existing activity
	 * @public
	 */
	update(req, res, next) {
		const data = req.body;
		const id = req.params.id;
		this.model
			.findByIdAndUpdate(id, data)
			.then((savedDoc) => res.json(savedDoc.transform()))
			.catch((e) => next(e));
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

module.exports = GhgController;
