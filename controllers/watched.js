import Watched from "../models/watched.js";
import Product from "../models/product.js";

export const addLastWatched = async (req, res) => {
  const ip = req.ip;
  const {model} = req.body;

  try {
    const product = await Product.findOne({ model: model });
    if (!product) {
      return res.status(404).json({ message: `Product for model: \/${model}\/ does not exist` });
    }
    const existingDoc = await Watched.findOne({ clientIP: ip });
    if (!existingDoc) {
      const doc = { clientIP: ip, models: [product._id] };
      const newDoc = new Watched(doc);
      await newDoc.save();
      return res.status(201).json({
        message: `New model from new IP: \/${ip}\/ added to last watched items successfully`,
      });
    }
    const result = await Watched.updateOne(
      {
        _id: existingDoc._id,
        models: { $ne: product._id },
      },
      {
        $push: {
          models: {
            $each: [product._id],
            $slice: -10,
          },
        },
      }
    );
    if (result.acknowledged) {
      return res.status(200).json({
        message: `Find \/${result.matchedCount}\/ item and modified \/${result.modifiedCount}\/ item for exist IP: \/${ip}\/`,
      });
    }
    return res.status(404).json({ message: "Not defined value of model" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getLastWatched = async (req, res) => {
  const ip = req.ip;
  try {
    const result = await Watched.find({ clientIP: ip }, "-_id -clientIP -createdAt -updatedAt").populate({
      path: "models",
      select: { _id: 0, title: 1, model: 1, coin: 1, image: 1,wide:1 },
      populate: { path: "category", model: "Category", select: { slug: 1, _id: 0 } },
    });
    return res.status(200).json(result);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
