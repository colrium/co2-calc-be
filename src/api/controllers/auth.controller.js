/** @format */

import httpStatus from 'http-status';
import lodash from 'lodash';
import moment from 'moment-timezone';
import { jwtExpirationInterval } from '../../config/vars.js';
import APIError from '../errors/api-error.js';
import PasswordResetToken from '../models/passwordResetToken.model.js';
import RefreshToken from '../models/refreshToken.model.js';
import User from '../models/user.model.js';
import { sendPasswordChangeEmail, sendPasswordReset as sendPasswordResetEmail } from '../services/emails/emailProvider.js';
const { omit } = lodash;
/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, accessToken) {
	const tokenType = 'Bearer';
	const refreshToken = RefreshToken.generate(user).token;
	const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
	return {
		tokenType,
		accessToken,
		refreshToken,
		expiresIn
	};
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
export const register = async (req, res, next) => {
	try {
		const userData = omit(req.body, 'role');
		const user = await new User(userData).save();
		const userTransformed = user.transform();
		const token = generateTokenResponse(user, user.token());
		res.status(httpStatus.CREATED);
		return res.json({ token, user: userTransformed });
	} catch (error) {
		console.log('register errror', error);
		return next(User.checkDuplicateEmail(error));
	}
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
export const login = async (req, res, next) => {
	try {
		const { user, accessToken } = await User.findAndGenerateToken(req.body);
		const token = generateTokenResponse(user, accessToken);
		const userTransformed = user.transform();
		const maxAge = 1000 * 60 * 60 * 24 * 365; // would expire after 1 year
		const options = {
			maxAge,
			httpOnly: false, // The cookie only accessible by the web server
			signed: false // Indicates if the cookie should be signed
		};
		res.cookie('accessToken', token.accessToken, options);
		res.append('Set-Cookie', 'tokenType=' + token.tokenType + ';');
		res.append('Set-Cookie', 'refreshToken=' + token.refreshToken + ';');
		// res.cookie('tokenType', token.tokenType, options);
		// res.cookie('refreshToken', token.refreshToken, options);
		// res.cookie('accessToken', token.accessToken, options);
		return res.json({ token, user: userTransformed });
	} catch (error) {
		return next(error);
	}
};

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
export const oAuth = async (req, res, next) => {
	try {
		const { user } = req;
		const accessToken = user.token();
		const token = generateTokenResponse(user, accessToken);
		const userTransformed = user.transform();
		return res.json({ token, user: userTransformed });
	} catch (error) {
		return next(error);
	}
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
export const refresh = async (req, res, next) => {
	try {
		const { email, refreshToken } = req.body;
		const refreshObject = await RefreshToken.findOneAndRemove({
			userEmail: email,
			token: refreshToken
		});
		const { user, accessToken } = await User.findAndGenerateToken({ email, refreshObject });
		const response = generateTokenResponse(user, accessToken);
		return res.json(response);
	} catch (error) {
		return next(error);
	}
};

export const sendPasswordReset = async (req, res, next) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email }).exec();

		if (user) {
			const passwordResetObj = await PasswordResetToken.generate(user);
			sendPasswordResetEmail(passwordResetObj);
			res.status(httpStatus.OK);
			return res.json('success');
		}
		throw new APIError({
			status: httpStatus.UNAUTHORIZED,
			message: 'No account found with that email'
		});
	} catch (error) {
		return next(error);
	}
};

export const resetPassword = async (req, res, next) => {
	try {
		const { email, password, resetToken } = req.body;
		const resetTokenObject = await PasswordResetToken.findOneAndRemove({
			userEmail: email,
			resetToken
		});

		const err = {
			status: httpStatus.UNAUTHORIZED,
			isPublic: true
		};
		if (!resetTokenObject) {
			err.message = 'Cannot find matching reset token';
			throw new APIError(err);
		}
		if (moment().isAfter(resetTokenObject.expires)) {
			err.message = 'Reset token is expired';
			throw new APIError(err);
		}

		const user = await User.findOne({ email: resetTokenObject.userEmail }).exec();
		user.password = password;
		await user.save();
		sendPasswordChangeEmail(user);

		res.status(httpStatus.OK);
		return res.json('Password Updated');
	} catch (error) {
		return next(error);
	}
};
