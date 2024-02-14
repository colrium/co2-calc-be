const JwtStrategy = require('passport-jwt').Strategy;
const BearerStrategy = require('passport-http-bearer');
const { ExtractJwt } = require('passport-jwt');
const { jwtSecret } = require('./vars');
const authProviders = require('../api/services/authProviders');
const User = require('../api/models/user.model');


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

const jwt = async (payload, done) => {
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

exports.jwt = new JwtStrategy(jwtOptions, jwt);
exports.facebook = new BearerStrategy(oAuth('facebook'));
exports.google = new BearerStrategy(oAuth('google'));
