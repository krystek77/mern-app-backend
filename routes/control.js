import express from 'express';
import {
  getControls,
  createControl,
  getControlByName,
  updateControl,
  getControlsByCategoryId,
  deleteControl,
} from '../controllers/control.js';
import { isAdmin } from '../middleware/auth/isAdmin.js';
const router = express.Router();

router.get('/', getControls);
router.post('/', isAdmin, createControl);
router.delete('/:controlName', isAdmin, deleteControl);
router.get('/:controlName', getControlByName);
router.get('/controls/:categoryId', getControlsByCategoryId);
router.patch('/:controlName', isAdmin, updateControl);

export default router;
