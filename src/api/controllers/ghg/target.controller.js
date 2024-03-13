/** @format */

import GhgController from '../../base/GhgController.js';
import Domain from '../../models/ghg/domain.model.js';
import Target from '../../models/ghg/target.model.js';

const Context = Target;


class TargetController extends GhgController {
	constructor() {
		super({ model: Context, subjectFilter: TargetController.subjectFilter  });
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

}

export default new TargetController();

