import express from 'express';
import { getEuroExchangeRate } from '../controllers/nbp.js';
const router = express.Router();

router.get('/', getEuroExchangeRate);

export default router;
