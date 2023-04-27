import express from 'express';
import {
  getVoltagesByCategoryId,
  createVoltage,
  updateVoltage,
  deleteVoltage,
  getVoltageById,
  getVoltagesByCategoryIds,
} from '../controllers/voltage.js';
import { isAdmin } from '../middleware/auth/isAdmin.js';
const router = express.Router();

router.get('/category/:categoryId', isAdmin, getVoltagesByCategoryId);
router.get('/:voltageId', isAdmin, getVoltageById);
router.post('/', isAdmin, createVoltage);
router.post('/categories', isAdmin, getVoltagesByCategoryIds);
router.patch('/:voltageId', isAdmin, updateVoltage);
router.delete('/:voltageId', isAdmin, deleteVoltage);
export default router;
