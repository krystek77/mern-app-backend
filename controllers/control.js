import mongoose from 'mongoose';
import Control from '../models/control.js';
import Product from '../models/product.js';

export const getControls = async (req, res) => {
  try {
    const controls = await Control.find().sort({ name: 1 });
    if (!controls.length) {
      return res.status(400).json({ message: 'Brak sterowników' });
    }
    res.status(200).json(controls);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createControl = async (req, res) => {
  const data = req.body;
  const control = await Control.findOne({ name: data.name });
  if (control)
    return res.status(409).json({
      message: `Sterownik o nazwie: ${data.name} i _id: ${control._id} już istnieje`,
    });
  try {
    const newControl = new Control(data);
    const savedControl = await newControl.save();
    if (!savedControl) {
      return res.status(400).json({
        message: `Nie udało się zapisać sterownika o nazwie: \/${newControl.name}\/`,
      });
    }
    res.status(201).json(savedControl);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const getControlByName = async (req, res) => {
  const { controlName } = req.params;
  try {
    const control = await Control.aggregate([
      {
        $match: { name: controlName },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $project: {
          categoryId: 0,
          'category.icon': 0,
          'category.image': 0,
          'category.desc': 0,
          'category.__v': 0,
          'category.features': 0,
          'category.position': 0,
          'category.wide': 0,
          'category.createdAt': 0,
          'category.updatedAt': 0,
          __v: 0,
        },
      },
    ]);

    if (control.length) {
      res.status(200).json(control);
    } else {
      res
        .status(404)
        .json({ message: `Sterownik o nazwie ${controlName} nie istnieje` });
    }
  } catch (error) {
    res.status(404);
  }
};
export const getControlsByCategoryId = async (req, res) => {
  const { categoryId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(409)
        .json({ message: `Niepoprawne _id categorii: \/ ${categoryId} \/` });
    }
    const controls = await Control.find(
      { categoryId: categoryId },
      '-__v'
    ).sort({ name: 1 });
    res.status(200).json(controls);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const updateControl = async (req, res) => {
  const { controlName } = req.params;
  console.log(controlName);
  const data = req.body;
  try {
    const control = await Control.findOne({ name: controlName });
    if (!control) {
      return res.status(404).json({
        message: `Sterownik o nazwie: ${controlName}  nie istnieje`,
      });
    }
    const updatedControl = await Control.findOneAndUpdate(
      { name: controlName },
      data,
      { new: true }
    );
    if (!updatedControl) {
      return res
        .status(409)
        .json({ message: `Nie udało się uaktualnić sterownika` });
    }
    const existingProducts = await Product.updateMany(
      { 'controls.name': controlName },
      { $set: { controls: data } }
    );

    if (!existingProducts.matchedCount) {
      return res.status(404).json({
        message: `Żaden z produktów nie miał przypisanego sterownika o nazwie: \/ ${controlName} \/. Sterownik został uaktualniony`,
      });
    }
    res.status(200).json({
      message: `Sterownik o nazwie: \/ ${controlName} \/ został ukatualnoony do nazwy: \/ ${updatedControl.name} \/. Jednocześnie znaleziono \/ ${existingProducts.matchedCount} \/ produkt/ów posiadających edytowany sterownik i uaktualniono \/ ${existingProducts.modifiedCount} \/ produktów`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const deleteControl = async (req, res) => {
  const { controlName } = req.params;
  try {
    const existingControl = await Control.findOne({ name: controlName });

    if (!existingControl) {
      return res.status(404).json({
        message: `Sterownik o podanej nazwie: \/ ${controlName} \/ nie istnieje`,
      });
    }
    const existingProducts = await Product.updateMany(
      {
        'controls.name': controlName,
      },
      { $pull: { controls: { name: controlName } } },
      { multi: true }
    );
    if (!existingProducts.matchedCount) {
      const deletedControl = await Control.findOneAndDelete({
        name: controlName,
      });

      if (deletedControl) {
        return res.status(200).json({
          message: `Sterownik o nazwie \/${deletedControl.name}\/ został skasowany.Sterownik nie był przypisany żadnemu produktowi.`,
        });
      } else {
        return res.status(400).json({
          message: `Nie udało się skasować sterownika o nazwie: \/ ${controlName} \. Sterownik nie jest przypisany żadnemu produktowi.`,
        });
      }
    } else {
      const deletedControl = await Control.findOneAndDelete({
        name: controlName,
      });

      if (deletedControl) {
        return res.status(200).json({
          message: `Sterownik o nazwie \/${deletedControl.name}\/ został skasowany. Sterownik był przypisany \/${existingProducts.matchedCount}\/ produktom/owi.`,
        });
      } else {
        return res.status(400).json({
          message: `Nie udało się skasować sterownika o nazwie: \/ ${controlName} \. Sterownik był przypisany \/${existingProducts.matchedCount}\/ produktom/owi.`,
        });
      }
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
