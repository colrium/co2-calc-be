/** @format */

const httpStatus = require('http-status');
const { omit } = require('lodash');
const Domain = require('../../models/ghg/domain.model');
const mongoose = require('mongoose');
const { loadLookups } = require('./utils');

const Context = Domain;


/**
 * Get record
 * @public
 */
exports.get = async (req, res) => {
	

	try {
		const id = req.params?.id;
		if (id && /^[a-fA-F0-9]{24}$/.test(id)) {
			const doc = await Context?.get(id);
			
			if (doc) {
				const response = {
					data: doc.transform()
				};
				if (Boolean(req.query.lookups)) {
					response.lookups = await loadLookups(Context, req);
				}
				return res.status(httpStatus.OK).json(response);
			} else {
				return res.status(httpStatus.NOT_FOUND).json({ message: httpStatus['404_MESSAGE'] });
			}
		} else if (['new', '0', 0].includes(id)) {
			const response = {
				data: new Context({userId: req.user._id}).transform()
			};
			if (Boolean(req.query.lookups)) {
				response.lookups = await loadLookups(Context, req);
			}
			return res.status(httpStatus.OK).json(response);
		} else {
			return res.status(httpStatus.BAD_REQUEST).json({ message: httpStatus['422_MESSAGE'] });
		}
	} catch (error) {
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error);
	}
};

/**
 * Create new record
 * @public
 */
exports.create = async (req, res, next) => {
	try {
		const record = new Context(req.body);
		const savedDoc = await record.save();
		res.status(httpStatus.CREATED);
		res.json(savedDoc.transform());
	} catch (error) {
		next(error);
	}
};

/**
 * Replace existing record
 * @public
 */
exports.replace = async (req, res, next) => {
	try {
		const user = req.user;
		const newRecord = new Context(req.body);
		let userId = user?._id || user?.id;
		if (user?.role === 'admin' && req.query?.userId) {
			userId = req.query?.userId || userId;
		}
		const ommitUserId = user.role !== 'admin' ? 'userId' : '';
		const newRecordObject = omit(newRecord.toObject(), '_id', ommitUserId);

		await Context.updateOne(newRecordObject, { override: true, upsert: true });
		const savedDoc = await Context.findById(req.params.id);

		res.json(savedDoc.transform());
	} catch (error) {
		next(error);
	}
};

/**
 * Update existing record
 * @public
 */
exports.update = (req, res, next) => {
	const data = req.body;
	const id = req.params.id;
	Context.findByIdAndUpdate(id, data)
		.then((savedDoc) => res.json(savedDoc.transform()))
		.catch((e) => next(e));
};

/**
 * Get record list
 * @public
 */
exports.list = async (req, res, next) => {
	const user = req.user;
	let userId = user?._id || user?.id;
	if (user?.role === 'admin' && req.query?.userId) {
		userId = req.query?.userId || userId;
	}
	const q = { ...req.query, userId: { $in: [null, userId] } };
	try {
		const { page = 1, perPage = 30 } = req.query;
		const count = await Context.count(q);
		const docs = await Context.list(q);
		const data = docs.map((doc) => doc.transform());
		const pages = Math.ceil(count / perPage);
		res.json({ data: data, pages: pages, page, perPage, count });
	} catch (error) {
		next(error);
	}
};

/**
 * Delete record
 * @public
 */
exports.remove = (req, res, next) => {
	const user = req.user;

	record
		.remove({ _id: req.params.id, ...(user?.role !== 'admin' ? { userId: user?._id } : {}) })
		.then(() => res.status(httpStatus.NO_CONTENT).end())
		.catch((e) => next(e));
};
