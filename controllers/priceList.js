import PriceList from '../models/priceList.js';
import mongoose from 'mongoose';

export const getPriceListsByCategoryId = async (req, res) => {
  const { categoryId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(404)
        .json({ message: `Błędne _id: ${categoryId} dla kategorii` });
    }
    const priceLists = await PriceList.find({ category: categoryId }).populate([
      { path: 'product', select: 'model' },
    ]);
    res.status(200).json(priceLists);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getPriceList = async (req, res) => {
  const { productId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(404)
        .json({ message: `Błędne _id: ${productId} dla produktu` });
    }

    const priceList = await PriceList.findOne({
      product: productId,
    }).populate([{ path: 'product', select: 'model' }]);
    if (!priceList) {
      return res.status(404).json({
        message: `Brak cennika dla produktu o _id: \/ ${productId} \/`,
      });
    }
    res.status(200).json(priceList);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const createPriceList = async (req, res) => {
  const data = req.body;
  const priceList = new PriceList(data);

  try {
    const productPriceList = await PriceList.findOne({
      product: data.product._id,
    });
    if (productPriceList) {
      return res.status(200).json({
        message: `Cennik dla modelu \/ ${data.product.model} \/ już istnieje`,
      });
    }
    await priceList.save();
    res.status(201).json({
      message: `Pomyślnie utworzono cennik, dla modelu \/ ${data.product.model} \/`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePriceHeating = async (req, res) => {
  const { priceListId } = req.params;
  const data = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(priceListId)) {
      return res
        .status(400)
        .json({ message: `Nie poprawne _id cennika: \/${priceListId}\/` });
    }
    const result = await PriceList.updateOne(
      { $and: [{ _id: priceListId }, { 'heatings._id': data.heating._id }] },
      { $set: { 'heatings.$.price': data.heating.price } },
      {
        new: true,
      }
    );
    if (result.modifiedCount && result.matchedCount) {
      return res
        .status(200)
        .json({ message: `Cena podgrzewu została uaktualniona` });
    }
    if (result.matchedCount && result.modifiedCount === 0) {
      return res.status(200).json({ message: `Podano tą samą cenę podgrzewu` });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePriceControl = async (req, res) => {
  const { priceListId } = req.params;
  const data = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(priceListId)) {
      return res
        .status(400)
        .json({ message: `Nie poprawne _id cennika: \/${priceListId}\/` });
    }
    const result = await PriceList.updateOne(
      { $and: [{ _id: priceListId }, { 'controls._id': data.control._id }] },
      { $set: { 'controls.$.price': data.control.price } },
      {
        new: true,
      }
    );
    if (result.modifiedCount && result.matchedCount) {
      return res
        .status(200)
        .json({ message: `Cena sterownika została uaktualniona` });
    }
    if (result.matchedCount && result.modifiedCount === 0) {
      return res
        .status(200)
        .json({ message: `Podano tą samą cenę sterownika` });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePriceVoltage = async (req, res) => {
  const { priceListId } = req.params;
  const data = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(priceListId)) {
      return res
        .status(400)
        .json({ message: `Nie poprawne _id cennika: \/${priceListId}\/` });
    }
    const result = await PriceList.updateOne(
      { $and: [{ _id: priceListId }, { 'voltages._id': data.voltage._id }] },
      { $set: { 'voltages.$.price': data.voltage.price } },
      {
        new: true,
      }
    );
    if (result.modifiedCount && result.matchedCount) {
      return res
        .status(200)
        .json({ message: `Cena zasilania została uaktualniona` });
    }
    if (result.matchedCount && result.modifiedCount === 0) {
      return res.status(200).json({ message: `Podano tą samą cenę zasilania` });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePriceOption = async (req, res) => {
  const { priceListId } = req.params;
  const data = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(priceListId)) {
      return res
        .status(400)
        .json({ message: `Nie poprawne _id cennika: \/${priceListId}\/` });
    }
    const result = await PriceList.updateOne(
      { $and: [{ _id: priceListId }, { 'options._id': data.option._id }] },
      { $set: { 'options.$.price': data.option.price } },
      {
        new: true,
      }
    );
    if (result.modifiedCount && result.matchedCount) {
      return res
        .status(200)
        .json({ message: `Cena opcji została uaktualniona` });
    }
    if (result.matchedCount && result.modifiedCount === 0) {
      return res.status(200).json({ message: `Podano tą samą cenę opcji` });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
