/** @format */

const httpStatus = require('http-status');
const { omit } = require('lodash');
const ActivityType = require('../../models/ghg/activityType.model');

const Context = ActivityType;
/**
 * Get activityType
 * @public
 */
exports.get = async (req, res) => {
	try {
		const activityType = await Context.get(req.id);
		if (activityType) {
			return res.status(httpStatus.FOUND).json(activityType.transform());
		} else {
			return res.status(httpStatus.NOT_FOUND).json({ message: httpStatus['404_MESSAGE'] });
		}
	} catch (error) {
		return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error);
	}
};

/**
 * Create new activityType
 * @public
 */
exports.create = async (req, res, next) => {
	try {
		const activityType = new Context(req.body);
		const savedActivityType = await activityType.save();
		res.status(httpStatus.CREATED);
		res.json(savedActivityType.transform());
	} catch (error) {
		next(error);
	}
};

/**
 * Replace existing activityType
 * @public
 */
exports.replace = async (req, res, next) => {
	try {
		const user = req.user;
		const newActivityType = new Context(req.body);
		const ommitRole = user.role !== 'admin' ? 'role' : '';
		const newActivityTypeObject = omit(newActivityType.toObject(), '_id', ommitRole);

		await activityType.updateOne(newActivityTypeObject, { override: true, upsert: true });
		const savedActivityType = await Context.findById(req.id);

		res.json(savedActivityType.transform());
	} catch (error) {
		next(error);
	}
};

/**
 * Update existing activityType
 * @public
 */
exports.update = (req, res, next) => {
	const activityType = req.body;

	Context.create()
		.then((savedActivityType) => res.json(savedActivityType.transform()))
		.catch((e) => next(e));
};

/**
 * Get activityType list
 * @public
 */
exports.list = async (req, res, next) => {
	const user = req.user;
	try {
		const { page = 1, perPage = 1000 } = req.query;
		const count = await Context.count({ ...req.query, ...(user?.role !== 'admin' ? { userId: { $in: [null, user?._id] } } : {}) });
		const docs = await Context.list({ ...req.query, ...(user?.role !== 'admin' ? { userId: { $in: [null, user?._id] } } : {}) });
		const data = docs.map((doc) => doc.transform());
		const pages = Math.ceil(count / perPage);
		res.json({ data: data, pages: pages, page, perPage, count });
	} catch (error) {
		next(error);
	}
};

exports.help = async (req, res, next) => {
	try {
		const q = { ...req.query, userId: { $in: [null] } };
		const { page = 1, perPage = 1000 } = req.query;
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
 * Delete activityType
 * @public
 */
exports.remove = (req, res, next) => {
	const user = req.user;

	activityType
		.remove({ _id: req.id, ...(user?.role !== 'admin' ? { userId: user?._id } : {}) })
		.then(() => res.status(httpStatus.NO_CONTENT).end())
		.catch((e) => next(e));
};
