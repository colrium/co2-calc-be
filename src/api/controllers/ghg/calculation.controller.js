/** @format */

import GhgController from '../../base/GhgController.js';
import Calculation from '../../models/ghg/calculation.model.js';
import Domain from '../../models/ghg/domain.model.js';

class CalculationController extends GhgController {
	constructor() {
		super({ model: Calculation });
	}
	static subjectFilter = async (req) => {
		const subject = 'domainId';
		const user = req.user;
		let userId = user?._id || user?.id;
		const domains = await Domain.find({
			userId: user?.role === 'admin' && 'userId' in req.query ? req.query[subject] : { $in: [null, userId] }
		})
			.lean()
			.exec();
		const subjectQuery = {
			domainId: user?.role === 'admin' && 'domainId' in req.query ? req.query[subject] : { $in: domains.map(({ _id }) => _id) }
		};
		return subjectQuery;
	};

	subjectData = async (req) => {
		const subject = this.subject || 'userId';
		const user = req.user;
		let userId = user?._id || user?.id;
		const subjectdata = {
			[subject]: user?.role === 'admin' && subject in req.body ? req.query[subject] : userId
		};
		return subjectdata;
	};

	list = async (req, res, next) => {
		const ContextModel = this.model;
		const loadSubjectQuery = CalculationController.subjectFilter;
		let query = { ...req.query };
		const listQuery = await loadSubjectQuery(req);
		query = { ...req.query, ...listQuery };
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
	totals = async (req, res, next) => {
		const user = req.user;
		let userId = user?._id || user?.id;
		if (user?.role === 'admin' && req.query?.userId) {
			userId = req.query?.userId || userId;
		}
		const subjectQuery = await CalculationController.subjectFilter(req);
		const q = { ...req.query, ...subjectQuery };
		try {
			const findQ = Calculation.parseQuery({...q})
			const docs = await findQ.lean().exec();
			const data = docs.reduce(
				(acc, curr) => {
					const {
						byScope: { scope1 = 0, scope2 = 0, scope3us = 0, scope3ds = 0 },
						byemissionType: { biogenic = 0, fossil = 0 }
					} = {
						byScope: {
							scope1: 0,
							scope2: 0,
							scope3us: 0,
							scope3ds: 0
						},
						byemissionType: {
							biogenic: 0,
							fossil: 0
						},
						...curr.results
					};
					const resTotal = scope1 + scope2 + scope3us + scope3ds;
					if (typeof acc.yearly[curr.year] !== 'number' || isNaN(acc.yearly[curr.year])) {
						acc.yearly[curr.year] = 0;
					}
					acc.scope.scope1 += scope1;
					acc.scope.scope2 += scope2;
					acc.scope.scope3us += scope3us;
					acc.scope.scope3ds += scope3ds;
					acc.emissionType.biogenic += biogenic;
					acc.emissionType.fossil += fossil;
					acc.yearly[curr.year] += resTotal;
					acc.total += resTotal;
					return acc;
				},
				{
					yearly: {},
					scope: { scope1: 0, scope2: 0, scope3us: 0, scope3ds: 0 },
					emissionType: { biogenic: 0, fossil: 0 },
					total: 0
				}
			);
			res.json(data);
		} catch (error) {
			next(error);
		}
	};
}

export default new CalculationController();
