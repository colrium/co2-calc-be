import dotenv from "dotenv-safe";
import path from "path";
// import .env variables
dotenv.config({
	path: path.join(process.cwd(), './.env'),
	example: path.join(process.cwd(), './.env.example')
});

let pagination = 50;
try {
	pagination = parseInt(process.env.PAGINATION_PER_PAGE)
} catch (error) {
	
}


	export const env =  process.env.NODE_ENV;
	export const port =  process.env.PORT;
	export const jwtSecret =  process.env.JWT_SECRET;
	export const jwtExpirationInterval =  process.env.JWT_EXPIRATION_MINUTES;
	export const defaultPagination =  pagination
	export const mongo =  {
		uri:  process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TESTS  :  process.env.MONGO_URI
	};
	export const logs =  process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
	export const emailConfig =  {
		host: process.env.EMAIL_HOST,
		port:  process.env.EMAIL_PORT,
		username:  process.env.EMAIL_USERNAME,
		password:  process.env.EMAIL_PASSWORD
	};
	export const adminUser =  {
		email:  process.env.ADMIN_EMAIL,
		password:  process.env.ADMIN_PASSWORD,
		username:  process.env.ADMIN_USERNAME,
		firstname:  'Admin',
		lastname:  'Administrator'
	};
