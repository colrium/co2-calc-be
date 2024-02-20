/** @format */

const httpStatus = require('http-status');
const { omit } = require('lodash');
const Result = require('../../models/ghg/result.model');
const Domain = require('../../models/ghg/domain.model');
const { loadLookups } = require('./utils');

const Context = Result;
/**
 * Get result
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
		const id = req.params?.id;
		const newResult = new Context(req.body);
		const ommitRole = user.role !== 'admin' ? 'role' : '';
		const newResultObject = omit(newResult.toObject(), '_id', ommitRole);
		await Context.findByIdAndUpdate(id, req.body);
		await Context.updateOne(newResultObject, { override: true, upsert: true });
		const savedResult = await Context.findById(id);

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
	
	const id = req.params.id;
	const result = Context.findById(id);
	Context.findByIdAndUpdate(id, req.body)
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
	if (user?.role === 'admin' && req.query?.domainId) {
		q = { ...req.query, domainId: { $in: [req.query?.domainId] } };
	} else if (user?.role !== 'admin') {		
		const userDomains = await Domain.list({userId: userId, ...(req.query?.domainId? {domainId: req.query?.domainId} : {})})
		const userDomainsIds = userDomains.map(({ _id }) => _id);
		q = { ...req.query, domainId: { $in: userDomainsIds } };
	}
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
 * Delete result
 * @public
 */
exports.remove = (req, res, next) => {
	const user = req.user;

	result
		.remove({ _id: req.params.id, ...(user?.role !== 'admin' ? { userId: user?._id } : {}) })
		.then(() => res.status(httpStatus.NO_CONTENT).end())
		.catch((e) => next(e));
};
