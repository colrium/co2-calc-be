/** @format */

const httpStatus = require('http-status');
const { omit } = require('lodash');
const Result = require('../../models/ghg/result.model');

const Context = Result;
/**
 * Get result
 * @public
 */
exports.get = async (req, res) => {
	try {
		const resultId = req.params?.resultId;
		const result = await Context.get(resultId);
		if (result) {
			return res.status(httpStatus.OK).json(result.transform());
		} else {
			return res.status(httpStatus.NOT_FOUND).json({ message: httpStatus['404_MESSAGE'] });
		}
	} catch (error) {
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error);
	}
};

/**
 * Create new result
 * @public
 */
exports.create = async (req, res, next) => {
	try {
		const result = new Context(req.body);
		const savedResult = await result.save();
		res.status(httpStatus.CREATED);
		res.json(savedResult.transform());
	} catch (error) {
		next(error);
	}
};

/**
 * Replace existing result
 * @public
 */
exports.replace = async (req, res, next) => {
	try {
		const user = req.user;
		const resultId = req.params?.resultId;
		const newResult = new Context(req.body);
		const ommitRole = user.role !== 'admin' ? 'role' : '';
		const newResultObject = omit(newResult.toObject(), '_id', ommitRole);
		await Context.findByIdAndUpdate(resultId, req.body);
		await Context.updateOne(newResultObject, { override: true, upsert: true });
		const savedResult = await Context.findById(resultId);

		res.json(savedResult.transform());
	} catch (error) {
		next(error);
	}
};

/**
 * Update existing result
 * @public
 */
exports.update = async (req, res, next) => {
	
	const resultId = req.params.resultId;
	const result = Context.findById(resultId);
	Context.findByIdAndUpdate(resultId, req.body)
		.then((savedResult) => res.json(savedResult.transform()))
		.catch((e) => next(e));
};

/**
 * Get result list
 * @public
 */
exports.list = async (req, res, next) => {
	const user = req.user;
	let userId = user?._id || user?.id;
	let q = { ...req.query };
	if (user?.role === 'admin' && req.query?.userId){
		q = { ...req.query, userId: { $in: [req.query?.userId] } };
	}
	else if (user?.role !== 'admin') {
		q = { ...req.query, userId: { $in: [userId] } };
	}
	try {
		console.log('req.query?.userId', req.query?.userId);
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
 * Delete result
 * @public
 */
exports.remove = (req, res, next) => {
	const user = req.user;

	result
		.remove({ _id: req.id, ...(user?.role !== 'admin' ? { userId: user?._id } : {}) })
		.then(() => res.status(httpStatus.NO_CONTENT).end())
		.catch((e) => next(e));
};
