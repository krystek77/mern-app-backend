import mongoose from 'mongoose';
import AdditionalEquipment from '../models/additionalEquiment.js';

export const getAdditionalEquipment = async (req, res) => {
  const { slug } = req.params;
  try {
    const additionalEquiment = await AdditionalEquipment.findOne(
      { slug: slug },
      '-__v'
    ).populate('featuredFor', 'title slug coin');
    if (!additionalEquiment) {
      return res.status(404).json({
        message: `Brak wyposażenia dodatkowego dla slug: \/${slug}\/`,
      });
    }
    res.status(200).json(additionalEquiment);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getAdditionalEquipments = async (req, res) => {
  try {
    const additionalEquipments = await AdditionalEquipment.find({}, '-__v')
      .populate('featuredFor', 'title slug coin')
      .sort({ model: 1 });

    if (!additionalEquipments.length) {
      return res.status(404).json({
        message: `Brak wyposażenia dodatkowego pralni przemysłowej tj. wózków, regałów, stołów manipulacyjnych, kontenerów jezdnych`,
      });
    }
    res.status(200).json(additionalEquipments);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const createAdditionalEquipment = async (req, res) => {
  const data = req.body;
  try {
    const existingAdditionalEquipment = await AdditionalEquipment.findOne({
      model: data.model,
    });
    if (existingAdditionalEquipment) {
      return res.status(200).json({
        message: `Wyposażenie dodatkowe o oznaczeniu \/${existingAdditionalEquipment.model}\/ już istnieje`,
      });
    }
    const newAdditionalEquipment = new AdditionalEquipment(data);
    const savedAdditionalEquipment = await newAdditionalEquipment.save();
    if (!savedAdditionalEquipment) {
      return res.status(400).json({
        message: `Nie udało się dodać wyposażenia dodatkowego o nazwie: \/${data.name}\/ o oznaczeniu: \/${data.model}\/`,
      });
    }
    res.status(200).json({
      message: `Pomyslnie dodano wyposażenie dodatkowe o nazwie: \/${savedAdditionalEquipment.name}\/ o oznaczeniu: \/${savedAdditionalEquipment.model}\/`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const updateAdditionalEquipment = async (req, res) => {
  const { slug } = req.params;
  const data = req.body;
  try {
    const updatedAdditionalEquipment =
      await AdditionalEquipment.findOneAndUpdate({ slug: slug }, data, {
        new: true,
      });
    if (!updatedAdditionalEquipment) {
      return res.status(404).json({
        message: `Brak wyposażenia dodatkowego o podanym slug: \/${slug}\/`,
      });
    }
    res.status(200).json({
      message: `Pomyślnie uaktualnoiono wyposażenie dodatkowe - model: \/${updatedAdditionalEquipment.model}\/, nazwa: - \/${updatedAdditionalEquipment.name}\/`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const deleteAdditionalEquipment = async (req, res) => {
  const { slug } = req.params;
  try {
    const deletedAdditionalEquipment =
      await AdditionalEquipment.findOneAndDelete({ slug: slug });
    if (!deletedAdditionalEquipment) {
      return res.status(404).json({
        message: `Brak wyposażenia dodatkowego dla slug: \/${slug}\/`,
      });
    }
    res.status(200).json({
      message: `Pomyślnie skasowano wyposażenie dodatkowe o nazwie: \/${deletedAdditionalEquipment.name}\/ i oznaczeniu \/${deletedAdditionalEquipment.model}\/`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
