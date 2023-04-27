import mongoose from 'mongoose';
import Option from '../models/option.js';
import PriceList from '../models/priceList.js';

export const getOptionById = async (req, res) => {
  const { optionId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(optionId)) {
      return res
        .status(409)
        .json({ message: `Podane _id: \/${optionId}\/ jest nieprawidłowe` });
    }
    const option = await Option.findById({ _id: optionId }, '-__v');
    if (!option) {
      return res
        .status(404)
        .json({ message: `Opcja o _id \/${optionId}\/ nie istnieje` });
    }
    res.status(200).json(option);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const getOptionsByCategoryIds = async (req, res) => {
  const categoryIds = req.body;
  try {
    const options = await Option.find({ categoryId: { $in: categoryIds } });
    if (!options.length)
      return res.status(404).json({ message: `Nie znaleziono żadnych opcji` });
    res.status(200).json(options);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const getOptionsByCategoryId = async (req, res) => {
  const { categoryId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        message: `Podane _id: \/${categoryId}\/ kategorii jest nieprawidłowe`,
      });
    }
    const options = await Option.find({ categoryId: categoryId }, '-__v').sort({
      name: 1,
    });
    if (!options.length) {
      return res.status(404).json({
        message: `Brak zdefiniowanych opcji dla kategorii o _id: /${categoryId}/`,
      });
    }
    res.status(200).json(options);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const createOption = async (req, res) => {
  const data = req.body;

  try {
    const existedOption = await Option.findOne({ name: data.name });
    if (existedOption) {
      const dataCategoryIds = data.categoryId.map((category) =>
        category._id.toString()
      );
      const existedOptionIds = existedOption.categoryId.map((id) =>
        id.toString()
      );
      const toInsert = Array.from(
        new Set([...dataCategoryIds, ...existedOptionIds])
      );

      await Option.updateOne(
        { _id: existedOption._id },
        { categoryId: toInsert }
      );

      const updatedPriceLists = await PriceList.updateMany(
        {
          category: { $in: toInsert },
          'options.slug': { $not: { $regex: existedOption.slug } },
        },
        {
          $addToSet: {
            options: {
              name: existedOption.name,
              price: '0',
              slug: existedOption.slug,
            },
          },
        }
      );
      res.status(400).json({
        message: `Opcja o nazwie: \/ ${existedOption.name} \/ istnieje. Znaleziono \/ ${updatedPriceLists.matchedCount} \/ cenników, w tym zmodyfikowano cenników: \/ ${updatedPriceLists.modifiedCount} \/`,
      });
    } else {
      const newOption = new Option(data);
      const addedOption = await newOption.save();
      if (!addedOption) {
        return res.status(400).json({
          message: `Nie udało sie dodać nowej opcji o nazwie: \/${data.name}\/`,
        });
      }
      const option = {
        name: addedOption.name,
        price: '0',
        slug: addedOption.slug,
      };
      const updatedPriceLists = await PriceList.updateMany(
        {
          category: { $in: data.categoryId },
        },
        { $push: { options: option } },
        { multi: true }
      );
      res.status(201).json({
        message: `Pomyślnie dodano opcję o nazwie: \/ ${newOption.name} \/ oraz znaleziono \/ ${updatedPriceLists.matchedCount} \/ cenników, w tym zmodyfikowano cenników: \/ ${updatedPriceLists.modifiedCount} \/`,
      });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateOption = async (req, res) => {
  const { optionId } = req.params;
  const data = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(optionId)) {
      return res.status(409).json({
        message: `Podane _id: \/${optionId}\/ jest nieprawidłowe`,
      });
    }
    const existsOption = await Option.findByIdAndUpdate(
      { _id: optionId },
      { ...data, slug: data.name.split(' ').join('-').toLowerCase() },
      {
        new: false,
      }
    );
    if (!existsOption) {
      return res
        .status(404)
        .json({ message: `Opcja o _id: \/${optionId}\/ nie istnieje` });
    }
    const updatedPriceLists = await PriceList.updateMany(
      { category: { $in: data.categoryId }, 'options.name': existsOption.name },
      {
        $set: {
          'options.$.name': data.name,
          'options.$.slug': data.name.split(' ').join('-').toLowerCase(),
        },
      },
      { multi: true }
    );
    res.status(200).json({
      message: `Uaktualniono opcję o _id: \/${optionId}\/ oraz znaleziono \/${updatedPriceLists.matchedCount}\/ cenników, w tym zmodyfikowano \/${updatedPriceLists.modifiedCount}\/`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const deleteOption = async (req, res) => {
  const { optionId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(optionId)) {
      return res.status(409).json({
        message: `Podane _id: \/${optionId}\/ jest nieprawidlowe`,
      });
    }
    const deletedOption = await Option.findByIdAndDelete({ _id: optionId });
    if (!deletedOption) {
      return res
        .status(404)
        .json({ message: `Opcja o _id: \/${optionId}\/ nie istnieje` });
    }
    const updatedPriceLists = await PriceList.updateMany(
      {
        category: { $in: deletedOption.categoryId },
        'options.name': deletedOption.name,
      },
      { $pull: { options: { name: deletedOption.name } } },
      { multi: true }
    );
    res.status(200).json({
      message: `Skasowano opcję o _id: \/${optionId}\/ oraz znaleziono \/${updatedPriceLists.matchedCount}\/ cenników, w tym zmodyfikowano \/${updatedPriceLists.modifiedCount}\/`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
