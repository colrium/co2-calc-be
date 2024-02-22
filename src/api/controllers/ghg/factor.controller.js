/** @format */

import GhgController from '../../base/GhgController.js';
import Factor from "../../models/ghg/factor.model.js";

class FactorController extends GhgController {
	constructor() {
		super({ model: Factor, subjective: true });
	}
}

export default new FactorController();