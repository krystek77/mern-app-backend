import express from 'express';
import {
  getSpareParts,
  getAllSpareParts,
  getSparePartDetails,
  createSparePart,
  createSpareParts,
  updateSparePart,
  updateSpareParts,
  deleteSparePart,
  deleteSpareParts,
  getSparePartsByCategoryId,
} from '../controllers/sparepart.js';
import { isAdmin } from '../middleware/auth/isAdmin.js';
const router = express.Router();
//http://localhost:4000/sparepart

router.get('/', getAllSpareParts);
router.get('/search', getSpareParts);
router.get('/details/:id', getSparePartDetails);
router.get('/categoryId/:categoryId/spareparts', getSparePartsByCategoryId);
router.post('/', isAdmin, createSparePart);
router.post('/creates/multi', createSpareParts);
router.patch('/:id',isAdmin, updateSparePart);
router.patch('/updates/multi', updateSpareParts);
router.delete('/:id', isAdmin, deleteSparePart);
router.delete('/deletes/multi', deleteSpareParts);

export default router;
