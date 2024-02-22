/** @format */

import { defaultPagination } from '../../../config/vars.js';
import GhgController from '../../base/GhgController.js';
import ActivityType from '../../models/ghg/activityType.model.js';


class ActivityTypeController extends GhgController {
	constructor() {
		super({ model: ActivityType, subjective: true });
	}
	help = async (req, res, next) => {
		try {
			const q = { ...req.query, userId: { $in: [null] } };
			const { page = 1, perPage = defaultPagination } = req.query;
			const count = await ActivityType.count(q);
			const docs = await ActivityType.list(q);
			const data = docs.map((doc) => doc.transform());
			const pages = Math.ceil(count / perPage);
			res.json({ data: data, pages: pages, page, perPage, count });
		} catch (error) {
			next(error);
		}
	};
}

export default new ActivityTypeController();