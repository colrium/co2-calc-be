/** @format */

const httpStatus = require('http-status');
const { omit } = require('lodash');
const Activity = require('../../models/ghg/activity.model');
const GhgController = require('../../base/GhgController');

const Context = Activity;


class ActivityController extends GhgController {
	constructor() {
		super({ model: Activity, subjective: true });
	}
}

module.exports = new ActivityController();