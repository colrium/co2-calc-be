/** @format */

import GhgController from '../../base/GhgController.js';
import Result from "../../models/ghg/result.model.js";

class ResultController extends GhgController {
	constructor() {
		super({ model: Result, subjective: true });
	}
}

export default new ResultController();
