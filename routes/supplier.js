import express from 'express';
const router = express.Router();
import {
  getSuppliers,
  getAllSuppliers,
  getSupplierDetails,
  createSupplier,
  createSuppliers,
  updateSupplier,
  updateSuppliers,
  deleteSupplier,
  deleteSuppliers,
} from '../controllers/supplier.js';
import isAdmin from '../middleware/auth/isAdmin.js';


router.get('/', isAdmin, getAllSuppliers);
router.get('/search', getSuppliers);
router.get('/details/:supplierId', isAdmin, getSupplierDetails);
router.post('/', isAdmin, createSupplier);
router.post('/creates/multi', createSuppliers);
router.patch('/:supplierId', isAdmin, updateSupplier);
router.patch('/updates/multi', updateSuppliers);
router.delete('/:supplierId', isAdmin, deleteSupplier);
router.delete('/deletes/multi', deleteSuppliers);

export default router;
