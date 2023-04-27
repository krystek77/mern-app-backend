import express from 'express';
import {
  getHeatingsByCategoryId,
  createHeating,
  updateHeating,
  deleteHeating,
  getHeatingById,
  getHeatingsByCategoryIds,
} from '../controllers/heating.js';
import { isAdmin } from '../middleware/auth/isAdmin.js';
const router = express.Router();

router.get('/category/:categoryId', isAdmin, getHeatingsByCategoryId);
router.get('/:heatingId', isAdmin, getHeatingById);
router.post('/', isAdmin, createHeating);
router.post('/categories', isAdmin, getHeatingsByCategoryIds);
router.patch('/:heatingId', isAdmin, updateHeating);
router.delete('/:heatingId', isAdmin, deleteHeating);

export default router;
