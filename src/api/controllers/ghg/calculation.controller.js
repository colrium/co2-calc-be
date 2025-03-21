/** @format */

import GhgController from '../../base/GhgController.js';
import Activity from '../../models/ghg/activity.model.js';
import ActivityType from '../../models/ghg/activityType.model.js';
import Calculation from '../../models/ghg/calculation.model.js';
import Domain from '../../models/ghg/domain.model.js';

class CalculationController extends GhgController {
	constructor() {
		super({ model: Calculation, subjectFilter: CalculationController.subjectFilter });
	}
	static subjectFilter = async (req) => {
		const subject = 'domainId';
		const user = req.user;
		let userId = user?._id || user?.id;
		const domainsQuery = { userId: user?.role === 'admin' && 'userId' in req.query ? req.query[subject] : { $in: [userId] } };
		const domains = await Domain.find(domainsQuery).lean().exec();
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

	getLookupQueries = async (req) => {
		const user = req.user;
		let userId = user?._id || user?.id;
		const domains = await Domain.find({
			userId: user?.role === 'admin' && 'userId' in req.query ? req.query[subject] : { $in: [userId] }
		});
		return {
			domainId: {$in: domains.map(({_id}) => _id)}
		}
	};
	overview = async (req, res, next) => {
		const user = req.user;
		let userId = user?._id || user?.id;
		if (user?.role === 'admin' && req.query?.userId) {
			userId = req.query?.userId || userId;
		}
		const subjectQuery = await CalculationController.subjectFilter(req);
		const q = { ...req.query, ...subjectQuery };
		try {
			const subject = 'domainId';
			const user = req.user;
			let userId = user?._id || user?.id;
			const domains = await Domain.find({
				userId: user?.role === 'admin' && 'userId' in req.query ? req.query[subject] : { $in: [null, userId] }
			});
			const activities = await Activity.find({
				userId: user?.role === 'admin' && 'userId' in req.query ? req.query[subject] : { $in: [null, userId] }
			});
			const domainCount = await Domain.countDocuments({
				userId: user?.role === 'admin' && 'userId' in req.query ? req.query[subject] : { $in: [null, userId] }
			})
			const findQ = Calculation.parseQuery({...q});

			const activityTypeDocs = await ActivityType.find({}).lean();
			const activityTypeLabels = activityTypeDocs.reduce((acc, curr) => {
				acc[curr.name] = curr.label;
				return acc
			}, {});
			const domainLabels = domains.reduce((acc, curr) => {
				acc[curr._id.toString()] = curr.name;
				return acc;
			}, {});
			const activityCount = await Activity.countDocuments({
				userId: user?.role === 'admin' && 'userId' in req.query ? req.query[subject] : { $in: [null, userId] }
			});
			const activitiesLabels = activities.reduce((acc, curr) => {
				acc[curr.name] = curr.name;
				return acc;
			}, {});
			const docs = await findQ.lean().exec();
			const data = docs.reduce(
				(acc, curr) => {
					const {
						byScope: { scope1 = 0, scope2 = 0, scope3us = 0, scope3ds = 0 },
						byemissionType: { biogenic = 0, fossil = 0 },
						activities = {},
						activityTypes = {}
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
					if (curr.domainId) {
						const domainName = domainLabels[curr.domainId.toString()]
						const currDomainTotal = acc.domains[domainName] || 0
						acc.domains[domainName] = currDomainTotal + resTotal;
					}
					

					if (curr.activities) {
						for (const [scope, entries] of Object.entries(curr.activities)) {
							for (const [name, scopeEntries] of Object.entries(entries)) {
								for (const scopeEntry of scopeEntries) {
									if (scopeEntry.emissionType) {
										const emissionTypeTotal = acc.emissionType[scopeEntry.emissionType] || 0;
										acc.emissionType[scopeEntry.emissionType] = emissionTypeTotal + scopeEntry.emission;
									}
									if (scopeEntry.activityType) {
										const activityTypeLabel = activityTypeLabels[scopeEntry.activityType] || scopeEntry.activityType;
										const activityTypeTotal = acc.activityTypes[activityTypeLabel] || 0;
										acc.activityTypes[activityTypeLabel] = activityTypeTotal + scopeEntry.emission;
									}
									
									const activityLabel = activitiesLabels[scopeEntry.name] || scopeEntry.name;
									const currActivityTotal = activities[activityLabel] || 0;
									const activityEmission = scopeEntry.emission || 0;
									activities[activityLabel] = currActivityTotal + activityEmission;
								}
							}
						}
						acc.activities = activities;
						// acc.activityTypes = activityTypes;
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
					domains: {},
					activities: {},
					activityTypes: {},
					yearly: {},
					scope: { scope1: 0, scope2: 0, scope3us: 0, scope3ds: 0 },
					emissionType: { biogenic: 0, fossil: 0 },
					total: 0,
					domainCount: domainCount,
					calculationCount: docs.length,
					activityCount: activityCount
				}
			);
			res.json({...data, total: parseFloat(data.total.toFixed(3))});
		} catch (error) {
			next(error);
		}
	};
}

export default new CalculationController();
