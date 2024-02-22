/** @format */

import GhgController from '../../base/GhgController.js';
import Activity from '../../models/ghg/activity.model.js';

const Context = Activity;


class ActivityController extends GhgController {
	constructor() {
		super({ model: Context, subjective: true });
	}
}

export default new ActivityController();

