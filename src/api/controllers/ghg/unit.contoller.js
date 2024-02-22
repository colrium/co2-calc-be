/** @format */

import Unit from '@/api/models/ghg/unit.model.js';
import GhgController from '../../base/GhgController.js';

class UnitController extends GhgController {
	constructor() {
		super({ model: Unit, subjective: true });
	}
}

export default new UnitController();
