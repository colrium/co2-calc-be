/** @format */


import GhgController from '../base/GhgController.js';
import User from '../models/user.model.js';

class UserController extends GhgController {
	constructor() {
		super({ model: User });
	}
	loggedIn = (req, res, next) => res.json(req.user.transform());
}

export default new UserController();
