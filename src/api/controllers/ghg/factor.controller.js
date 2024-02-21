/** @format */

const httpStatus = require('http-status');
const { omit } = require('lodash');
const Factor = require('../../models/ghg/factor.model');
const { defaultPagination } = require('../../../config/vars');

const Context = Factor;
/**
 * Get factor
 * @public
 */
exports.get = async (req, res) => {
	try {
		
		const factor = await Context.get(req.params.id);
		if (factor) {
			return res.status(httpStatus.FOUND).json(factor.transform());
		} else {
			return res.status(httpStatus.NOT_FOUND).json({ message: httpStatus['404_MESSAGE'] });
		}
	} catch (error) {
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error);
	}
};

/**
 * Create new factor
 * @public
 */
exports.create = async (req, res, next) => {
	try {
		const factor = new Context(req.body);
		const savedDoc = await factor.save();
		res.status(httpStatus.CREATED);
		res.json(savedDoc.transform());
	} catch (error) {
		next(error);
	}
};

/**
 * Replace existing factor
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
		const savedFactor = await Context.findById(req.params.id);

		res.json(savedFactor.transform());
	} catch (error) {
		next(error);
	}
};

/**
 * Update existing factor
 * @public
 */
exports.update = (req, res, next) => {
	const data = req.body;
	const id = req.params.id;
	Context.findByIdAndUpdate(id, data)
		.then((savedFactor) => res.json(savedFactor.transform()))
		.catch((e) => next(e));
};

/**
 * Get factor list
 * @public
 */
exports.list = async (req, res, next) => {
	const user = req.user;
	let userId = user?._id || user?.id;
	if (user?.role === 'admin' && req.query?.userId) {
		userId = req.query?.userId || userId;
	}
	const q = { ...req.query, userId: { $in: [null, userId] }}
	try {
		const { page = 1, perPage = defaultPagination } = req.query;
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
 * Delete factor
 * @public
 */
exports.remove = (req, res, next) => {
	const user = req.user;

	factor
		.remove({ _id: req.params.id, ...(user?.role !== 'admin' ? { userId: user?._id } : {}) })
		.then(() => res.status(httpStatus.NO_CONTENT).end())
		.catch((e) => next(e));
};
