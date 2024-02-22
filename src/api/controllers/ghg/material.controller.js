/** @format */

import Material from '@/api/models/ghg/material.model.js';
import GhgController from '../../base/GhgController.js';

class MaterialController extends GhgController {
	constructor() {
		super({ model: Material });
	}
}

export default new MaterialController();
