const GhgController = require('../../base/GhgController');
const Model = require('../../models/ghg/domain.model');


class DomainController extends GhgController {
	constructor() {
		super({ model: Model, subjective: true });
	}
}

module.exports = new DomainController();