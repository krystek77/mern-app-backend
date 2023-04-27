import mongoose from 'mongoose';
import Voltage from '../models/voltage.js';
import PriceList from '../models/priceList.js';

export const getVoltageById = async (req, res) => {
  console.log('GET VOLTAGE BY ID');
  const { voltageId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(voltageId)) {
      return res
        .status(409)
        .json({ message: `Podane _id: \/${voltageId}\/ jest nieprawidłowe` });
    }
    const voltage = await Voltage.findOne({ _id: voltageId }, '-__v');
    if (!voltage) {
      return res
        .status(404)
        .json({ message: `Zasilanie \/${voltageId}\/ nie istnieje` });
    }
    res.status(200).json(voltage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const getVoltagesByCategoryIds = async (req, res) => {
  const categoryIds = req.body;
  try {
    const voltages = await Voltage.find({ categoryId: { $in: categoryIds } });
    if (!voltages.length)
      return res
        .status(404)
        .json({ message: `Nie znaleziono żadnego zasilania` });
    res.status(200).json(voltages);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const getVoltagesByCategoryId = async (req, res) => {
  const { categoryId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        message: `Podane _id: \/${categoryId}\/ kategorii jest nieprawidłowe`,
      });
    }
    const voltages = await Voltage.find(
      { categoryId: categoryId },
      '-__v'
    ).sort({
      name: 1,
    });
    if (!voltages.length) {
      return res.status(404).json({
        message: `Brak zdefiniowanych zasilań dla kategorii o _id: /${categoryId}/`,
      });
    }
    res.status(200).json(voltages);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const createVoltage = async (req, res) => {
  const data = req.body;

  try {
    const existedVoltage = await Voltage.findOne({ name: data.name });
    if (existedVoltage) {
      const dataCategoryIds = data.categoryId.map((category) =>
        category._id.toString()
      );
      const existedVoltagesIds = existedVoltage.categoryId.map((id) =>
        id.toString()
      );
      const toInsert = Array.from(
        new Set([...dataCategoryIds, ...existedVoltagesIds])
      );

      await Voltage.updateOne(
        { _id: existedVoltage._id },
        { categoryId: toInsert }
      );

      const updatedPriceLists = await PriceList.updateMany(
        {
          category: { $in: toInsert },
          'voltages.slug': {
            $not: { $regex: existedVoltage.slug },
          },
        },
        {
          $addToSet: {
            voltages: {
              name: existedVoltage.name,
              price: '0',
              slug: existedVoltage.slug,
            },
          },
        }
      );
      res.status(400).json({
        message: `Opcja o nazwie: \/ ${existedVoltage.name} \/ istnieje. Znaleziono \/ ${updatedPriceLists.matchedCount} \/ cenników, w tym zmodyfikowano cenników: \/ ${updatedPriceLists.modifiedCount} \/`,
      });
    } else {
      const newVoltage = new Voltage(data);
      const addedVoltage = await newVoltage.save();
      if (!addedVoltage) {
        return res.status(400).json({
          message: `Nie udało sie dodać nowego zasilania o nazwie: \/${data.name}\/`,
        });
      }
      const voltage = {
        name: addedVoltage.name,
        price: '0',
        slug: addedVoltage.slug,
      };
      const updatedPriceLists = await PriceList.updateMany(
        {
          category: { $in: data.categoryId },
        },
        { $push: { voltages: voltage } },
        { multi: true }
      );
      res.status(201).json({
        message: `Pomyślnie dodano zasilanie o nazwie: \/ ${newVoltage.name} \/ oraz znaleziono \/ ${updatedPriceLists.matchedCount} \/ cenników, w tym zmodyfikowano cenników: \/ ${updatedPriceLists.modifiedCount} \/`,
      });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const updateVoltage = async (req, res) => {
  console.log('UPDATE VOLTAGE');
  const { slug } = req.params;
  const data = req.body;

  try {
    const existsVoltage = await Voltage.findOneAndUpdate({ slug: slug }, data, {
      new: false,
    });
    if (!existsVoltage) {
      return res
        .status(404)
        .json({ message: `Zasilanie o \/${slug}\/ nie istnieje` });
    }
    const updatedPriceLists = await PriceList.updateMany(
      {
        category: { $in: data.categoryId },
        'voltages.name': existsVoltage.name,
      },
      { $set: { 'voltages.$.name': data.name } },
      { multi: true }
    );
    res.status(200).json({
      message: `Uaktualniono zasilanie \/${slug}\/ oraz znaleziono \/${updatedPriceLists.matchedCount}\/ cenników, w tym zmodyfikowano \/${updatedPriceLists.modifiedCount}\/`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const deleteVoltage = async (req, res) => {
  console.log('DELETE VOLTAGE');
  const { slug } = req.params;

  try {
    const deletedVoltage = await Voltage.findOneAndDelete({ slug: slug });
    if (!deletedVoltage) {
      return res
        .status(404)
        .json({ message: `Zasilanie o _id: \/${slug}\/ nie istnieje` });
    }
    const updatedPriceLists = await PriceList.updateMany(
      {
        category: { $in: deletedVoltage.categoryId },
        'voltages.name': deletedVoltage.name,
      },
      { $pull: { voltages: { name: deletedVoltage.name } } },
      { multi: true }
    );
    res.status(200).json({
      message: `Skasowano zasilanie \/${slug}\/ oraz znaleziono \/${updatedPriceLists.matchedCount}\/ cenników, w tym zmodyfikowano \/${updatedPriceLists.modifiedCount}\/`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
