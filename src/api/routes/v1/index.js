import express from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
//
import activityRoutes from "./ghg/activity.route.js";
import activityTypeRoutes from "./ghg/activityType.route.js";
import domainRoutes from "./ghg/domain.route.js";
import factorRoutes from "./ghg/factor.route.js";
import helpRoutes from "./ghg/help.route.js";
import industryRoutes from "./ghg/industry.route.js";
import overViewRoutes from "./ghg/overview.route.js";
import resultRoutes from "./ghg/result.route.js";
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
router.use('/activities', activityRoutes);
router.use('/industries', industryRoutes);
router.use('/domains', domainRoutes);
router.use('/help', helpRoutes);


router.use('/users', userRoutes);
router.use('/auth', authRoutes);

export default router;
