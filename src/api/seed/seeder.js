/** @format */

import * as mongoose from '../../config/mongoose.js';
import { seedActivities } from './activities/index.js';
import { seedActivityTypes } from './activity-types/index.js';
import { seedFactors } from './factors/index.js';
import { seedUsers } from './users/index.js';

 // so the program will not close instantly

function exitHandler(options, exitCode) {
	// if (options.cleanup) console.log('clean');
	// if (exitCode || exitCode === 0) console.log(exitCode);
	if (options.exit) process.exit();
}

// do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: false }));
// open mongoose connection
await mongoose.connect();

await seedActivityTypes();
await seedFactors();
await seedActivities();
await seedUsers();
console.log('\n\n\nSeeding complete\n\n')
process.exit();