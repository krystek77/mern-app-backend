import mongoose from 'mongoose';
import Category from '../models/category.js';
import Control from '../models/control.js';
import Heating from '../models/heating.js';
import Option from '../models/option.js';
import PriceList from '../models/priceList.js';
import Product from '../models/product.js';
import SparePart from '../models/sparePart.js';
import Voltage from '../models/voltage.js';

/**
 * Get all categories
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @return
 */
export const getCategories = async (req, res) => {
  // const { category } = req.query;
  // const query = category ? { name: { $regex: category } } : {};
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products',
        },
      },
      {
        $addFields: {
          productsCount: {
            $size: '$products',
          },
        },
      },
      {
        $project: {
          products: 0,
          __v: 0,
        },
      },
      { $sort: { title: 1 } },
    ]);
    if (!categories.length) {
      return res.status(404).json({ message: 'Brak kategorii' });
    }
    res.status(200).json(categories);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * Get category by id
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @return
 */
export const getCategoryDetails = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: `Podane _id: \ /${id} \/ kategorii jest nieprawidlowe`,
      });
    }
    const category = await Category.findById({ _id: id }, '-__v');
    if (!category) {
      return res.status(404).json({
        message: `Nie znaleziono kategorii o _id: \/ ${id} \/`,
      });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * Create category
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @return
 */
export const createCategory = async (req, res) => {
  const data = req.body;
  try {
    const category = new Category(data);
    const isExistCategory = await Category.findOne({
      $and: [{ title: data.title }, { coin: category.coin }],
    });
    if (isExistCategory) {
      res.status(409).json({
        message: `Kategoria o nazwie: ${category.title} dla produktów z grupy ${
          category.coin
            ? 'samoobsługowych'
            : 'ze standardowym sterowaniem obsługowym'
        } już istnieje`,
      });
    } else {
      const savedCategory = await category.save();
      if (!savedCategory) {
        return res.status(409).json({
          message: `Nie udało się utworzyć kategorii \/ ${
            category.title
          } \/ z grupy produktów ${
            category.coin
              ? 'samoobsługowych'
              : 'ze standardowym sterowaniem obsługowym'
          } pomyślnie utworzona `,
        });
      }
      res.status(201).json({
        message: `Pomyślnie utworzono kategorię: ${
          category.title
        } z grupy produktów ${
          category.coin
            ? 'samoobsługowych'
            : 'ze standardowym sterowaniem obsługowym'
        } pomyślnie utworzona `,
      });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/**
 * Update category
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns
 */
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: `Podane _id: \/ ${id} \/ kategorii jest nieprawidłowe`,
      });
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      { _id: id },
      data,
      { new: true }
    );
    if (!updatedCategory) {
      return res
        .status(404)
        .json({ message: `Nie ma kategorii o _id: \/ ${id} \/` });
    }
    res.status(200).json({
      message: `Kategoria o nazwie: \/ ${
        updatedCategory.title
      } \/ z grupy kategorii ${
        updatedCategory.coin
          ? 'samoobsługowych'
          : 'ze standardowym sterowaniem obsługowym'
      } została pomyślnie uaktualniona`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/**
 * Delete product
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns
 */
export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: `Podane _id: \/ ${id} \/ kategorii jest nieprawidłowe`,
      });
    }
    const dependentControls = await Control.find({ categoryId: id }, 'name');
    const dependentOptions = await Option.find({ categoryId: id }, 'name');
    const dependentHeatings = await Heating.find({ categoryId: id }, 'name');
    const dependentVoltages = await Voltage.find({ categoryId: id }, 'name');
    const dependentPriceLists = await PriceList.find({ category: id });
    const dependentProducts = await Product.find({ category: id });
    const dependentSpareParts = await SparePart.find({ categoryId: id });

    const dependentDocuments = await Promise.all([
      dependentControls,
      dependentOptions,
      dependentHeatings,
      dependentVoltages,
      dependentPriceLists,
      dependentProducts,
      dependentSpareParts,
    ]);

    const controlNames = dependentControls.length
      ? dependentControls.map((c) => c.name).join(', ')
      : 0;
    const optionNames = dependentOptions.length
      ? dependentOptions.map((c) => c.name).join(', ')
      : 0;
    const heatingNames = dependentHeatings.length
      ? dependentHeatings.map((c) => c.name).join(', ')
      : 0;
    const voltageNames = dependentVoltages.length
      ? dependentVoltages.map((c) => c.name).join(', ')
      : 0;

    const dependentDocumentsCount = dependentDocuments.reduce((a, element) => {
      a += element.length;
      return a;
    }, 0);
    if (dependentDocumentsCount) {
      return res.status(400).json({
        message: `Nie można skasować kategorii ponieważ istnieje / ${dependentDocumentsCount}/ zależnych od niej dokumentów, m.in od sterowników: ${
          controlNames ? controlNames : '-'
        }, opcji o nazwach: ${
          optionNames ? optionNames : '-'
        }, podgrzewów o nazwach: ${
          heatingNames ? heatingNames : '-'
        }, napieć o wartościach: ${voltageNames ? voltageNames : '-'} oraz \/${
          dependentPriceLists.length
        }\/ cenników, \/ ${dependentProducts.length} \/ produktów i \/ ${
          dependentSpareParts.length
        } \/ części zamiennych`,
      });
    }
    const deletedCategory = await Category.findByIdAndDelete({ _id: id });
    if (!deletedCategory) {
      return res
        .status(404)
        .json({ message: `Nie ma kategorii o podanym _id: \/ ${id} \/` });
    }
    res.status(200).json({
      message: `Kategoria o _id: \/ ${id} \/ została pomyślnie usunięta`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
