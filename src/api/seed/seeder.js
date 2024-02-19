/** @format */

const mongoose = require('../../config/mongoose');
const { seedActivities } = require('./activities');
const { seedActivityTypes } = require('./activity-types');
const {seedFactors} = require('./factors');
const { seedUsers } = require('./users');
// open mongoose connection
mongoose.connect();

seedActivityTypes();
seedFactors();
seedActivities();
seedUsers();