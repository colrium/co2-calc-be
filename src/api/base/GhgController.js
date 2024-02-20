const mongoose = require('mongoose');
const { omitBy, isNil } = require('lodash');
const httpStatus = require('http-status');
const { omit } = require('lodash');

export class GhgController {
	constructor(config = {}) {
		Object.assign(this, config);
	}
    async loadLookups(req) {
        const lookups = {}
        return lookups;
    }
	async get(req, res) {
        const ContextModel = this.model;
		try {
			const id = req.params?.id;
            if (id && /^[a-fA-F0-9]{24}$/.test(id)) {                
                const doc = await ContextModel?.get(id);
				if (doc) {
					return res.status(httpStatus.OK).json(doc.transform());
				} else {
					return res.status(httpStatus.NOT_FOUND).json({ message: httpStatus['404_MESSAGE'] });
				}
			}
			else if (['new', '0', 0].includes(id)) {
                const response = {
                    data: new ContextModel({}).transform(),
                }
                if (Boolean(req.query.lookups)) {
                    response.lookups = await this.loadLookups(req)
                }
                return res.status(httpStatus.OK).json(response);
            }
            else{
                return res.status(httpStatus.BAD_REQUEST).json({ message: httpStatus['422_MESSAGE'] });
            }
		} catch (error) {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error);
		}
	}
    async create(req, res) {
        try {
			const doc = new Activity(req.body);
			const savedDoc = await doc.save();
			res.status(httpStatus.CREATED);
			res.json(savedDoc.transform());
		} catch (error) {
			next(error);
		}
    }

	list(req, res) {

    }
}