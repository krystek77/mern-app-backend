import mongoose from "mongoose";
import SparePart from "../models/sparePart.js";

export const getSpareParts = async (req, res) => {
  const query = req.query;
  console.log("SPARE PARTS - getSpareParts");
  res.status(200).json({ message: "SPARE PARTS - query" });
};

export const getAllSpareParts = async (req, res) => {
  try {
    const allSpareParts = await SparePart.find({}, "name images slug").populate("categoryId", "title").sort({
      createdAt: -1,
    });
    res.status(200).json(allSpareParts);
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};

export const getSparePartDetails = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: `Podane _id: \/ ${id} \/ jest nieprawidłowe` });
    }
    const sparePart = await SparePart.findById({ _id: id }, "-__v")
      .populate("categoryId", "title slug coin")
      .populate("products", "model title coin")
      .populate("supplier");

    if (!sparePart) {
      return res.status(404).json({ message: `Brak części zamiennej dla _id: \/ ${id} \/` });
    }

    return res.status(200).json(sparePart);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getSparePartsByCategoryId = async (req, res) => {
  const { categoryId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(409).json({
        message: `_id: \/ ${categoryId} \/ nie jest poprawnym identyfikatorem`,
      });
    }
    const spareparts = await SparePart.find({ categoryId: categoryId });
    if (!spareparts.length) {
      return res.status(404).json({
        message: `Brak części zamiennych dla kategorii o _id: \/ ${categoryId} \/`,
      });
    }
    res.status(200).json(spareparts);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const createSparePart = async (req, res) => {
  const data = req.body;
  try {
    const newSparePart = new SparePart(data);
    const savedSparePart = await newSparePart.save();
    if (!savedSparePart) {
      return res.status(400).json({ message: "Nie udało się zapisać części zamiennej" });
    }
    res.status(200).json({ _id: savedSparePart._id });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const createSpareParts = async (req, res) => {
  const data = req.body;
  console.log("SPARE PARTS - createSpareParts");
  res.status(200).json({ message: "SPARE PARTS CREATE" });
};
export const updateSparePart = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: `Podane _id: \/${id}\/ jest nieprawidłowe` });
    }
    const updatedSparePart = await SparePart.findByIdAndUpdate({ _id: id }, data, { new: true });
    if(!updatedSparePart){
      return res.status(404).json({message:`Brak części zamiennej o _id: \/${id}\/`})
    }
    res.status(200).json({ _id: updatedSparePart._id });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateSpareParts = async (req, res) => {
  const data = req.body;
  console.log("SPARE PARTS - updateSparePartS");
  res.status(200).json({ message: "SPARE PARTS UPDATE" });
};
export const deleteSparePart = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: `Podane _id: \/${id}\/ jest nieprawidłowe ` });
    }
    const deletedSparePart = await SparePart.findByIdAndDelete({ _id: id });
    if (!deletedSparePart) {
      return res.status(404).json({
        message: `Nie udało się usunąć cześci zamiennej o _id: \/${id}\/'`,
      });
    }
    res.status(200).json({
      message: `Pomyślnie skasowano część zamienną \/${deletedSparePart.name}\/ o _id: \/${id}\/ `,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const deleteSpareParts = async (req, res) => {
  const data = req.body;
  console.log("SPARE PARTS - deleteSpareParts");
  res.status(200).json({ message: "SPARE PARTS DELETE" });
};
