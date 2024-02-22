/** @format */

import GhgController from '../../base/GhgController.js';
import Industry from "../../models/ghg/industry.model.js";

class IndustryController extends GhgController {
	constructor() {
		super({ model: Industry });
	}
}

export default new IndustryController();