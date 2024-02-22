import BearerStrategy from "passport-http-bearer";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import User from "../api/models/user.model.js";
import * as authProviders from "../api/services/authProviders.js";
import { jwtSecret } from "./vars.js";


const headerOrCookieExtractor = function (req) {
	let token = null;
	if (req && req.signedCookies && req.signedCookies.accessToken) {
		token = req.signedCookies['accessToken'];
	}
	if (!token && req && req.cookies && req.cookies.accessToken) {
		token = req.cookies['accessToken'];
	}
	if (!token) {
		token = ExtractJwt.fromAuthHeaderWithScheme('Bearer')(req);
	}
	return token;
};

const jwtOptions = {
	secretOrKey: jwtSecret,
	jwtFromRequest: headerOrCookieExtractor
};

const jwtStrategy = async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};



const oAuth = (service) => async (token, done) => {
  try {
    const userData = await authProviders[service](token);
    const user = await User.oAuthLogin(userData);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

export const jwt = new JwtStrategy(jwtOptions, jwtStrategy);
export const facebook = new BearerStrategy(oAuth('facebook'));
export const google = new BearerStrategy(oAuth('google'));
