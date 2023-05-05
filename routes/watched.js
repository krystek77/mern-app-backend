import express from 'express';
import {getLastWatched,addLastWatched} from '../controllers/watched.js'
const router = express.Router();
router.get("/",getLastWatched);
router.post("/",addLastWatched);
export default router;