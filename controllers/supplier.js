import mongoose from 'mongoose';
import Supplier from '../models/supplier.js';
import SparePart from '../models/sparePart.js';

export const getSuppliers = async (req, res) => {
  const query = req.query;
  console.log('SUPPLIERS - getSuppliers');
  res.status(200).json({ message: 'SUPPLIERS - query' });
};
/**
 * Get all suppliers
 * @param {Object} req
 * @param {Object} res
 * @returns array || {message:""}
 */
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({}, '-__v').sort({ createdAt: -1 });
    if (!suppliers.length) {
      return res.status(404).json({ message: 'Brak dostawców' });
    }
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
/**
 * Get supplier details
 * @param {Object} req
 * @param {Object} res
 * @returns Object || {message:""}
 */
export const getSupplierDetails = async (req, res) => {
  const { supplierId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(supplierId)) {
      return res
        .status(400)
        .json({ message: `_id: \/ ${supplierId} \/ jest nieprawidłowe` });
    }
    const supplier = await Supplier.findById({ _id: supplierId }, '-__v');
    if (!supplier) {
      return res
        .status(404)
        .json({ message: `Dostawca o _id: \/ ${supplierId} \/ nie istnieje` });
    }
    res.status(200).json(supplier);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
/**
 * Create supplier
 * @param {Object} req
 * @param {Object} res
 * @returns  {message:""}
 */
export const createSupplier = async (req, res) => {
  const data = req.body;
  try {
    const newSupplier = new Supplier(data);
    const addedSupplier = await newSupplier.save();
    if (!addedSupplier) {
      return res.status(400).json({
        message: `Nie udało się zapisać dostawcy \/${data.companyName}\/`,
      });
    }
    res.status(200).json({
      message: `Nowy dostawca \/${addedSupplier.companyName}\/ dodany`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const createSuppliers = async (req, res) => {
  const data = req.body;
  res.status(200).json({ message: 'CREATE SUPPLIERS' });
};
/**
 * Update supplier
 * @param {Object} req
 * @param {Object} res
 * @returns {message:""}
 */
export const updateSupplier = async (req, res) => {
  const { supplierId } = req.params;
  const data = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(supplierId)) {
      return res
        .status(400)
        .json({ message: `Nieporawne _id: \/ ${supplierId} \/ dostacy` });
    }
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      { _id: supplierId },
      data,
      { new: true }
    );
    if (!updatedSupplier._id) {
      return res.status(400).json({
        message: `Nie udało się ukatualnić danych dostawcy \/${data.companyName}\/`,
      });
    }
    res.status(200).json({
      message: `Dostawca \/${data.companyName}\/ został uaktualniony`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateSuppliers = async (req, res) => {
  const data = req.body;
  console.log('SUPPLIERS - updateSuppliers');
  res.status(200).json({ message: 'SUPPLIERS UPDATE' });
};
/**
 * Delete supplier
 * @param {Object} req
 * @param {Object} res
 * @returns  {message:""}
 */
export const deleteSupplier = async (req, res) => {
  const { supplierId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(supplierId)) {
      return res.status(400).json({
        message: `_id dostawcy: \/ ${supplierId} \/ jest nieprawidłowe`,
      });
    }
    const sparePart = await SparePart.findOne({
      supplier: supplierId,
    }).populate('supplier');
    if (sparePart) {
      return res.status(409).json({
        message: `Nie można skasować dostawcy \/${sparePart.supplier.companyName}\/ ponieważ istnieje co najmniej jedna część zamienna od tego dostawcy np.: \/${sparePart.name}\/. Musisz najpierw skasowac wszystkie części zamienne tego dostawcy`,
      });
    }
    const deletedSupplier = await Supplier.findByIdAndDelete({
      _id: supplierId,
    });
    if (!deletedSupplier) {
      return res.status(400).json({
        message: `Nie udało sie skasować dostawcy o _id: \/ ${supplierId} \/`,
      });
    }
    res.status(200).json({
      message: `Dostawca : \/${deletedSupplier.companyName}\/ skasowany`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deleteSuppliers = async (req, res) => {
  const data = req.body;
  console.log('SUPPLIERS - deleteSuppliers');
  res.status(200).json({ message: 'SUPPLIERS DELETE' });
};
