import express from 'express';
import {
  getOptionsByCategoryId,
  createOption,
  updateOption,
  deleteOption,
  getOptionById,
  getOptionsByCategoryIds,
} from '../controllers/option.js';
import { isAdmin } from '../middleware/auth/isAdmin.js';
const router = express.Router();

router.get('/category/:categoryId', isAdmin, getOptionsByCategoryId);
router.get('/:optionId', isAdmin, getOptionById);
router.post('/', isAdmin, createOption);
router.post('/categories', isAdmin, getOptionsByCategoryIds);
router.patch('/:optionId', isAdmin, updateOption);
router.delete('/:optionId', isAdmin, deleteOption);
export default router;
