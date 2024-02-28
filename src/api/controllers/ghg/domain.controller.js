import GhgController from "../../base/GhgController.js";
import Model from "../../models/ghg/domain.model.js";


class DomainController extends GhgController {
	constructor() {
		super({ model: Model, subjective: true });
	}
	subjectData = async (req) => {
		const subject = this.subject || 'userId';
		const user = req.user;
		let userId = user?._id || user?.id;
		const subjectdata = {
			[subject]: user?.role === 'admin' && subject in req.body ? req.body[subject] : userId
		};
		return subjectdata;
	};
}

export default new DomainController();