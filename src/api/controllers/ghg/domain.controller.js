import GhgController from "../../base/GhgController.js";
import Model from "../../models/ghg/domain.model.js";


class DomainController extends GhgController {
	constructor() {
		super({ model: Model, subjective: true });
	}
}

export default new DomainController();