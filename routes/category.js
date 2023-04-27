import express from 'express';
import { isAdmin } from '../middleware/auth/isAdmin.js';

const router = express.Router();

import {
  createCategory,
  getCategories,
  getCategoryDetails,
  updateCategory,
  deleteCategory,
} from '../controllers/category.js';

router.get('/', getCategories);
router.get('/:id', getCategoryDetails);
router.post('/', isAdmin, createCategory);
router.patch('/:id', isAdmin, updateCategory);
router.delete('/:id', isAdmin, deleteCategory);

export default router;
