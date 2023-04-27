import fs from 'fs';
import mongoose from 'mongoose';
import { promisify } from 'util';

import LaundryPhoto from '../models/laundryPhoto.js';
export const getLaundryPhotos = async (req, res) => {
  const { page, onpage } = req.query;
  try {
    const count = await LaundryPhoto.count();
    const images = await LaundryPhoto.find({}, '-__v', {
      skip: page * 1 > 0 ? (page * 1 - 1) * onpage * 1 : 0,
      limit: onpage * 1,
    }).sort({ createdAt: -1 });
    res.status(200).json({ images, count });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getAllLaundryPhotos = async (req, res) => {
  try {
    const images = await LaundryPhoto.find({}, '-__v').sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getLaundryPhoto = async (req, res) => {
  const { laundryPhotoId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(laundryPhotoId)) {
      return res
        .status(409)
        .json({ message: `Błędne _id: \/ ${laundryPhotoId} \/ zdjęci` });
    }
    const image = await LaundryPhoto.findById({ _id: laundryPhotoId }, '-__v');
    if (!image) {
      return res.status(404).json({
        message: `Zdjęcie o _id: \/ ${laundryPhotoId} \/ nie istnieje`,
      });
    }
    res.status(200).json(image);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const createLaundryPhotos = async (req, res) => {
  const images = req.files;
  const { alts, titles } = req.body;

  const newImages = images.map((image, index) => ({
    ...image,
    alt: Array.isArray(alts) ? alts[index] : alts,
    title: Array.isArray(titles) ? titles[index] : titles,
  }));
  const originalnames = images.map((image) => image.originalname);
  try {
    const image = await LaundryPhoto.findOne({
      originalname: { $in: originalnames },
    });
    if (image) {
      return res
        .status(409)
        .json({ message: `Zdjęcie \/ ${image.originalname} \/ już istnieje` });
    }
    await LaundryPhoto.create(newImages);
    res.status(201).json({
      message: `Pomyslnie dodano \/ ${newImages.length} \/ zdjęć/cie/cia`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
const deleteImage = promisify(fs.unlink);
export const deleteLaundryPhoto = async (req, res) => {
  const { laundryPhotoId } = req.params;
  try {
    const image = await LaundryPhoto.findByIdAndDelete({ _id: laundryPhotoId });
    if (image) {
      deleteImage(image.path);
      return res.status(200).json({
        message: `Zdjęcie zostało pomyślnie usunięte`,
      });
    } else {
      return res.status(404).json({ message: `Takie zdjęcie nie istnieje` });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const updateLaundryPhoto = async (req, res) => {
  const { laundryPhotoId } = req.params;
  const image = req.file;
  const data = req.body;
  const updatedData = {
    ...image,
    alt: data.alt,
    title: data.title,
    updatedAt: new Date().toISOString(),
  };
  try {
    if (!mongoose.Types.ObjectId.isValid(laundryPhotoId)) {
      return res
        .status(400)
        .json({ message: `Nie poprawne _id: \/${laundryPhotoId}\/` });
    }
    const updatingPhoto = await LaundryPhoto.findById({ _id: laundryPhotoId });
    if (updatingPhoto) {
      const updatedPhoto = await LaundryPhoto.findByIdAndUpdate(
        {
          _id: laundryPhotoId,
        },
        updatedData,
        { new: true }
      );
      if (updatingPhoto.path !== updatedPhoto.path) {
        deleteImage(updatingPhoto.path);
        res.status(200).json({ message: 'Zdjęcie zostało ukatualnione' });
      } else {
        res.status(200).json({ message: 'Te same nazwy zdjęć' });
      }
    } else {
      res.status(404).json({ message: 'Nie ma takiego zdjęcia' });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const countLaundryPhotos = async (req, res) => {
  console.log('Controler Laundry Photos - countLaundryPhotos');
};
