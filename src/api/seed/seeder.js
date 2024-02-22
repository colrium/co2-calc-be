/** @format */

import mongoose from "../../config/mongoose";
import { seedActivities } from "./activities";
import { seedActivityTypes } from "./activity-types";
import { seedFactors } from "./factors";
import { seedUsers } from "./users";
// open mongoose connection
mongoose.connect();

seedActivityTypes();
seedFactors();
seedActivities();
seedUsers();