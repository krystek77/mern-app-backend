import Tag from '../models/tag.js';
import mongoose from 'mongoose';
import Product from '../models/product.js';
export const getTags = async (req, res) => {
  try {
    const tags = await Tag.find({}, '-__v').sort({ name: 1 });
    if (!tags.length) {
      return res.status(404).json({ message: `Brak tagów` });
    }
    res.status(200).json(tags);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getTagByName = async (req, res) => {
  const { tagName } = req.params;
  try {
    const tag = await Tag.findOne({ name: tagName }, '-__v');
    if (tag) {
      res.status(200).json(tag);
    } else {
      res.status(404).json({
        message: { message: `Tag o nazwie \/ ${tagName} \/ nie istnieje` },
      });
    }
  } catch (error) {
    res.status(409).json(error.message);
  }
};
export const createTags = async (req, res) => {
  const { tags } = req.body;
  const arrayOfTags = tags.split(',').map((tag) => {
    return { name: tag.trim().toLowerCase() };
  });
  try {
    const tag = await Tag.findOne({ name: { $in: tags.split(',') } });

    if (tag) {
      return res
        .status(409)
        .json({ message: `Tag: \/ ${tag.name} \/ już istnieje` });
    } else {
      await Tag.create(arrayOfTags);
      return res
        .status(201)
        .json({ message: `Tag \/ tagi: \/ ${tags} \/ dodane pomyślnie` });
    }
  } catch (error) {
    res.status(409).json({ message: 'Nie udało się dodać tagu/tagów' });
  }
};
export const deleteTag = async (req, res) => {
  const { tagName } = req.params;
  try {
    const tag = await Tag.deleteOne({ name: tagName });
    if (tag.deletedCount === 1) {
      return res.status(200).json({
        message: `Tag o nazwie: \/ ${tagName} \/ został pomyślnie usunięty`,
      });
    } else {
      return res
        .status(404)
        .json({ message: `Tag o nazwie: \/ ${tagName} \/ nie istnieje` });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const editTag = async (req, res) => {
  const { tagName } = req.params;
  const { tagId: _id, tagUpdatedAt: updatedAt, tagName: name } = req.body;
  const newTag = { _id, name, updatedAt };
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res
      .status(404)
      .json({ message: `Nie ma tagu: \/ ${tagName} \/ i _id: \/ ${_id} \/` });
  try {
    const updatedTag = await Tag.findByIdAndUpdate(_id, newTag, { new: true });
    await Product.updateMany(
      { 'tags.name': tagName },
      { $set: { 'tags.$.name': newTag.name } }
    );
    res.status(201).json({
      message: `Zmieniono tag: \/ ${tagName} \/ na \/ ${updatedTag.name} \/ `,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
