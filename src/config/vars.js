const path = require('path');

// import .env variables
require('dotenv-safe').config({
  path: path.join(__dirname, '../../.env'),
  example: path.join(__dirname, '../../.env.example'),
});

let defaultPagination = 50;
try {
	defaultPagination = parseInt(process.env.PAGINATION_PER_PAGE)
} catch (error) {
	
}
module.exports = {
	env: process.env.NODE_ENV,
	port: process.env.PORT,
	jwtSecret: process.env.JWT_SECRET,
	jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
	defaultPagination: defaultPagination,
	mongo: {
		uri: process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TESTS : process.env.MONGO_URI
	},
	logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
	emailConfig: {
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		username: process.env.EMAIL_USERNAME,
		password: process.env.EMAIL_PASSWORD
	},
	adminUser: {
		email: process.env.ADMIN_EMAIL,
		password: process.env.ADMIN_PASSWORD,
		username: process.env.ADMIN_USERNAME,
		firstname: 'Admin',
		lastname: 'Administrator'
	}
};
