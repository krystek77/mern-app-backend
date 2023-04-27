import express from 'express';
import {
  getPriceListsByCategoryId,
  getPriceList,
  createPriceList,
  updatePriceHeating,
  updatePriceControl,
  updatePriceVoltage,
  updatePriceOption,
} from '../controllers/priceList.js';
const router = express.Router();
router.get('/:categoryId', getPriceListsByCategoryId);
router.get('/product/:productId', getPriceList);
router.post('/', createPriceList);
router.patch('/product/:priceListId/heating', updatePriceHeating);
router.patch('/product/:priceListId/control', updatePriceControl);
router.patch('/product/:priceListId/voltage', updatePriceVoltage);
router.patch('/product/:priceListId/option', updatePriceOption);

export default router;
