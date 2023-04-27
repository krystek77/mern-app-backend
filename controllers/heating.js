import mongoose from 'mongoose';
import Heating from '../models/heating.js';
import PriceList from '../models/priceList.js';

export const getHeatingById = async (req, res) => {
  console.log('GET HEATING BY ID');
  const { heatingId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(heatingId)) {
      return res.status(409).json({
        message: `Podane _id: \/${heatingId}\/ jest nieprawidłowe`,
      });
    }
    const heating = await Heating.findOne({ _id: heatingId }, '-__v');
    if (!heating) {
      return res
        .status(404)
        .json({ message: `Podgrzew o _id: \/ ${heatingId} \/ nie istnieje` });
    }
    res.status(200).json(heating);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getHeatingsByCategoryIds = async (req, res) => {
  const categoryIds = req.body;
  try {
    const heatings = await Heating.find({ categoryId: { $in: categoryIds } });
    if (!heatings.length)
      return res
        .status(404)
        .json({ message: `Nie znaleziono żadnego podgrzewu` });
    res.status(200).json(heatings);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getHeatingsByCategoryId = async (req, res) => {
  const { categoryId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        message: `Podane _id: \/${categoryId}\/ kategorii jest nieprawidłowe`,
      });
    }
    const heatings = await Heating.find(
      { categoryId: categoryId },
      '-__v'
    ).sort({
      name: 1,
    });
    if (!heatings.length) {
      return res.status(404).json({
        message: `Brak zdefiniowanych podgrzewów dla kategorii o _id: /${categoryId}/`,
      });
    }
    res.status(200).json(heatings);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const createHeating = async (req, res) => {
  const data = req.body;

  try {
    const existedHeating = await Heating.findOne({ name: data.name });
    if (existedHeating) {
      const dataCategoryIds = data.categoryId.map((category) =>
        category._id.toString()
      );
      const existedHeatingIds = existedHeating.categoryId.map((id) =>
        id.toString()
      );
      const toInsert = Array.from(
        new Set([...dataCategoryIds, ...existedHeatingIds])
      );

      await Heating.updateOne(
        { _id: existedHeating._id },
        { categoryId: toInsert }
      );

      const updatedPriceLists = await PriceList.updateMany(
        {
          category: { $in: toInsert },
          'heatings.slug': { $not: { $regex: existedHeating.slug } },
        },
        {
          $addToSet: {
            heatings: {
              name: existedHeating.name,
              price: '0',
              slug: existedHeating.slug,
            },
          },
        }
      );
      res.status(400).json({
        message: `Podgrzew o nazwie: \/ ${existedHeating.name} \/ istnieje. Znaleziono \/ ${updatedPriceLists.matchedCount} \/ cenników, w tym zmodyfikowano cenników: \/ ${updatedPriceLists.modifiedCount} \/`,
      });
    } else {
      const newHeating = new Heating(data);
      const addedHeating = await newHeating.save();
      if (!addedHeating) {
        return res.status(400).json({
          message: `Nie udało sie dodać nowego podgrzewu o nazwie: \/${data.name}\/`,
        });
      }
      const heating = {
        name: addedHeating.name,
        price: '0',
        slug: addedHeating.slug,
      };
      const updatedPriceLists = await PriceList.updateMany(
        {
          category: { $in: data.categoryId },
        },
        { $push: { heatings: heating } },
        { multi: true }
      );
      res.status(201).json({
        message: `Pomyślnie dodano podgrzew o nazwie: \/ ${newHeating.name} \/ oraz znaleziono \/ ${updatedPriceLists.matchedCount} \/ cenników, w tym zmodyfikowano cenników: \/ ${updatedPriceLists.modifiedCount} \/`,
      });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const updateHeating = async (req, res) => {
  console.log('UPDATE HEATING');
  const { slug } = req.params;
  const data = req.body;

  try {
    const existsHeating = await Heating.findOneAndUpdate({ slug: slug }, data, {
      new: false,
    });
    if (!existsHeating) {
      return res
        .status(404)
        .json({ message: `Podgrzew \/${slug}\/ nie istnieje` });
    }
    const updatedPriceLists = await PriceList.updateMany(
      {
        category: { $in: data.categoryId },
        'heatings.name': existsHeating.name,
      },
      { $set: { 'heatings.$.name': data.name } },
      { multi: true }
    );
    res.status(200).json({
      message: `Uaktualniono podgrzew \/${slug}\/ oraz znaleziono \/${updatedPriceLists.matchedCount}\/ cenników, w tym zmodyfikowano \/${updatedPriceLists.modifiedCount}\/`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const deleteHeating = async (req, res) => {
  console.log('DELETE HEATING');
  const { slug } = req.params;

  try {
    const deletedHeating = await Heating.findOneAndDelete({ slug: slug });
    if (!deletedHeating) {
      return res
        .status(404)
        .json({ message: `Opcja: \/${slug}\/ nie istnieje` });
    }
    const updatedPriceLists = await PriceList.updateMany(
      {
        category: { $in: deletedHeating.categoryId },
        'heatings.name': deletedHeating.name,
      },
      { $pull: { heatings: { name: deletedHeating.name } } },
      { multi: true }
    );
    res.status(200).json({
      message: `Skasowano podgrzew \/${slug}\/ oraz znaleziono \/${updatedPriceLists.matchedCount}\/ cenników, w tym zmodyfikowano \/${updatedPriceLists.modifiedCount}\/`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
