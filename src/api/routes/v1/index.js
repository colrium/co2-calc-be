const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
//
const factorRoutes = require('./ghg/factor.route');
const resultRoutes = require('./ghg/result.route');
const helpRoutes = require('./ghg/help.route');
const activityTypeRoutes = require('./ghg/activityType.route');
const overViewRoutes = require('./ghg/overview.route');
//
const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));
//
router.use('/overview', overViewRoutes);
router.use('/factors', factorRoutes);
router.use('/results', resultRoutes);
router.use('/activity-types', activityTypeRoutes);
router.use('/help', helpRoutes);


router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
