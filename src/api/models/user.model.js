/** @format */

import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import jwt from "jwt-simple";
import moment from "moment-timezone";
import mongoose from 'mongoose';
import uuidv4 from "uuid/v4.js";
import { env, jwtExpirationInterval, jwtSecret } from "../../config/vars.js";
import { GhgSchema } from "../base/GhgModel.js";
import APIError from "../errors/api-error.js";

/**
 * User Roles
 */
const roles = ['user', 'admin'];

/**
 * User Schema
 * @private
 */
const schema = new GhgSchema(
	{
		email: {
			type: String,
			match: /^\S+@\S+\.\S+$/,
			required: true,
			unique: true,
			trim: true,
			lowercase: true
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
			internal: true,
			private: true
		},
		firstname: {
			type: String,
			maxlength: 128,
			index: true,
			trim: true
		},
		lastname: {
			type: String,
			maxlength: 128,
			index: true,
			trim: true
		},
		services: {
			facebook: String,
			google: String
		},
		role: {
			type: String,
			enum: roles,
			default: 'user'
		},
		picture: {
			type: String,
			trim: true
		}
	},
	{
		timestamps: true
	}
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
//  */

schema.roles = roles;
/**
 * Methods
 */
schema.addMethods({
	sanitize: function () {
		if (this.isModified('firstname')) {
			this.firstname = `${this.firstname?.trim()?.charAt(0)?.toUpperCase()}${this.firstname?.slice(1)?.toLowerCase()}`;
		}
		if (this.isModified('lastname')) {
			this.lastname = `${this.lastname?.trim()?.charAt(0)?.toUpperCase()}${this.lastname?.slice(1)?.toLowerCase()}`;
		}
		if (this.isModified('password')) {
			const rounds = env === 'test' ? 1 : 10;

			const hash = bcrypt.hashSync(this.password, rounds);
			this.password = hash;
		}
	},
	token() {
		const payload = {
			exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
			iat: moment().unix(),
			sub: this._id
		};
		return jwt.encode(payload, jwtSecret);
	},

	async passwordMatches(password) {
		return bcrypt.compare(password, this.password);
	}
});

/**
 * Statics
 */
schema.addStatics({
	roles,

	/**
	 * Find user by email and tries to generate a JWT token
	 *
	 * @param {ObjectId} id - The objectId of user.
	 * @returns {Promise<User, APIError>}
	 */
	async findAndGenerateToken(options) {
		const { email, password, refreshObject } = options;
		if (!email) throw new APIError({ message: 'An email is required to generate a token' });

		const user = await this.findOne({ email }).exec();
		const err = {
			status: httpStatus.UNAUTHORIZED,
			isPublic: true
		};
		if (password) {
			if (user && (await user.passwordMatches(password))) {
				return { user, accessToken: user.token() };
			}
			err.message = 'Incorrect email or password';
		} else if (refreshObject && refreshObject.userEmail === email) {
			if (moment(refreshObject.expires).isBefore()) {
				err.message = 'Invalid refresh token.';
			} else {
				return { user, accessToken: user.token() };
			}
		} else {
			err.message = 'Incorrect email or refreshToken';
		}
		throw new APIError(err);
	},

	/**
	 * Return new validation error
	 * if error is a mongoose duplicate key error
	 *
	 * @param {Error} error
	 * @returns {Error|APIError}
	 */
	checkDuplicateEmail(error) {
		if (error.name === 'MongoError' && error.code === 11000) {
			return new APIError({
				message: 'Validation Error',
				errors: [
					{
						field: 'email',
						location: 'body',
						messages: ['"email" already exists']
					}
				],
				status: httpStatus.CONFLICT,
				isPublic: true,
				stack: error.stack
			});
		}
		return error;
	},

	async oAuthLogin({ service, id, email, name, picture }) {
		const user = await this.findOne({ $or: [{ [`services.${service}`]: id }, { email }] });
		if (user) {
			user.services[service] = id;
			if (!user.name) user.name = name;
			if (!user.picture) user.picture = picture;
			return user.save();
		}
		const password = uuidv4();
		return this.create({
			services: { [service]: id },
			email,
			password,
			name,
			picture
		});
	},
	sanitize: function (doc) {
		const isNew = this.model?.isNew || this.isNew;
		const update = this.getUpdate?.();
		const updateSet = this.getUpdate?.();
		const modifiedPaths = this.modifiedPaths?.();
		const modifiedFields = Object.keys(this.getUpdate?.()?.$set || this.getUpdate?.() || this.modifiedPaths?.() || {});
		if (modifiedFields.includes('firstname')) {
			this.firstname = `${this.firstname?.trim()?.charAt(0)?.toUpperCase()}${this.firstname?.slice(1)?.toLowerCase()}`;
		}
		if (modifiedFields.includes('lastname')) {
			this.lastname = `${this.lastname?.trim()?.charAt(0)?.toUpperCase()}${this.lastname?.slice(1)?.toLowerCase()}`;
		}
		if (modifiedFields.includes('password')) {
			const rounds = env === 'test' ? 1 : 10;
			const hash = bcrypt.hashSync(this.password, rounds);
			this.password = hash;
		}
	},
	token() {
		const payload = {
			exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
			iat: moment().unix(),
			sub: this._id
		};
		return jwt.encode(payload, jwtSecret);
	},

	async passwordMatches(password) {
		return bcrypt.compare(password, this.password);
	}
});

schema.pre(/^(findOneAndUpdate|findOneAndReplace|updateOne|replaceOne|update)$/, async function(...args) {
	const [next] = args;
	try {
		const doc = this;
		const modifiedFields = this.getUpdate();
		this.model.sanitize.apply(this);
		// return next();
	} catch (error) {
		return next(error);
	}
});

schema.pre(/^(save)$/, async function save(next) {
	try {
		const doc = this;
		const modifiedPaths = this.modifiedPaths();
		this.sanitize();
		return next();
	} catch (error) {
		return next(error);
	}
});

const User = mongoose.model('User', schema);



schema.virtual('name').get(function () {
	return `${this.firstname || ''}${this.firstname ? ' ' : ''}${this.lastname || ''}`;
});
export default User;
