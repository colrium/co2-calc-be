import Bluebird from "bluebird";
import app from "./config/express.js";
import logger from "./config/logger.js";
import * as mongoose from "./config/mongoose.js";
import { env, port } from "./config/vars.js";
Promise = Bluebird; // make bluebird default Promise
// open mongoose connection
mongoose.connect();

// listen to requests
app.listen(port, () => logger.info(`server started on port ${port} (${env})`));

/**
* export const express
* @public
*/
export default app;
