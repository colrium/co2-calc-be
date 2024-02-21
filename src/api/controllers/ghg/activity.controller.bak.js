/** @format */

const httpStatus = require('http-status');
const { omit } = require('lodash');
const Activity = require('../../models/ghg/activity.model');
const { loadLookups } = require('./utils');

const Context = Activity;
/**
 * Get activity
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
				data: new Context({ userId: req.user._id }).transform()
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
 * Create new activity
 * @public
 */
exports.create = async (req, res, next) => {
	try {
		const doc = new Activity(req.body);
		const savedDoc = await doc.save();
		res.status(httpStatus.CREATED);
		res.json(savedDoc.transform());
	} catch (error) {
		next(error);
	}
};

/**
 * Replace existing activity
 * @public
 */
exports.replace = async (req, res, next) => {
	try {
		const user = req.user;
		const newRecord = new Activity(req.body);
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
exports.update = (req, res, next) => {
	const data = req.body;
	const id = req.params.id;
	Activity.findByIdAndUpdate(id, data)
		.then((savedDoc) => res.json(savedDoc.transform()))
		.catch((e) => next(e));
};

/**
 * Get activity list
 * @public
 */
exports.list = async (req, res, next) => {
	const user = req.user;
	let userId = user?._id || user?.id;
	if (user?.role === 'admin' && req.query?.userId) {
		userId = req.query?.userId || userId;
	}
	const q = { ...req.query, ...(user?.role !== 'admin' ? { userId: { $in: [null, userId] } } : {}) };
	try {
		const { page = 1, perPage = 10 } = req.query;
		const count = await Activity.count(q);
		const docs = await Activity.list(q);
		const data = docs.map((doc) => doc.transform());
		const pages = Math.ceil(count / perPage);
		res.json({ data: data, pages: pages, page, perPage, count });
	} catch (error) {
		next(error);
	}
};

/**
 * Delete activity
 * @public
 */
exports.remove = (req, res, next) => {
	const user = req.user;

	Activity.remove({ _id: req.params.id, ...(user?.role !== 'admin' ? { userId: user?._id } : {}) })
		.then(() => res.status(httpStatus.NO_CONTENT).end())
		.catch((e) => next(e));
};
