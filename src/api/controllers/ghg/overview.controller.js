/** @format */

import { defaultPagination } from "../../../config/vars.js";
import Result from "../../models/ghg/result.model.js";

const Context = Result;

/**
 * Get result list
 * @public
 */
export const list = async (req, res, next) => {
	const user = req.user;
	let userId = user?._id || user?.id;
	if (user?.role === 'admin' && req.query?.userId) {
		userId = req.query?.userId || userId;
	}
	const q = { ...req.query, userId: { $in: [null, userId] } };
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
 * Get result list
 * @public
 */
export const totals = async (req, res, next) => {
	const user = req.user;
	let userId = user?._id || user?.id;
	if (user?.role === 'admin' && req.query?.userId) {
		userId = req.query?.userId || userId;
	}
	const q = { ...req.query, userId: { $in: [null, userId] } };
	try {
		const docs = await Context.list(q);
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
			{ yearly: {}, scope: { scope1: 0, scope2: 0, scope3us: 0, scope3ds: 0 }, emissionType: { biogenic: 0, fossil: 0 }, total: 0 }
		);
        
		
		res.json(data);
	} catch (error) {
		next(error);
	}
};
