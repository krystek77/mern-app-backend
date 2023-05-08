import express from "express";
const router = express.Router();
import {getMost,increase} from '../controllers/mostPopular.js'

router.get("/",getMost);
router.post("/",increase);

export default router;