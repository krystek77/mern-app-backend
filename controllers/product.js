import mongoose from 'mongoose';
import Product from '../models/product.js';
/**
 * Get all products or filterd products according to query
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @return
 */

export const getProducts = async (req, res) => {
  const { title } = req.query;
  const queryTitle = new RegExp(title, 'i');
  let products = [];
  try {
    if (title) {
      products = await Product.aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'cat',
          },
        },
        {
          $match: {
            title: { $regex: queryTitle },
          },
        },
        {
          $sort: {
            model: 1,
          },
        },
        {
          $project: {
            category: 0,
            'cat.image': 0,
            'cat.icon': 0,
            'cat.desc': 0,
            'cat.position': 0,
            'cat.createdAt': 0,
            'cat.updatedAt': 0,
            'cat.features': 0,
            __v: 0,
          },
        },
      ]);
    } else {
      products = await Product.aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'cat',
          },
        },
        {
          $sort: {
            model: 1,
          },
        },
        {
          $project: {
            category: 0,
            'cat.image': 0,
            'cat.icon': 0,
            'cat.desc': 0,
            'cat.position': 0,
            'cat.createdAt': 0,
            'cat.updatedAt': 0,
            'cat.features': 0,
            __v: 0,
          },
        },
      ]);
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
/**
 * Get products by tags
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @return
 */
export const getProductsByCategoryId = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const models = await Product.find({ category: categoryId })
      .select('model _id')
      .sort({ model: 1 });
    if (models.length) {
      return res.status(200).json(models);
    }
    return res
      .status(404)
      .json({ message: `Brak produktów w podanej kategorii` });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
/**
 * Get products for nirseries
 * @param {object} req
 * @param {object} res
 * @returns array of products for nurseries
 */
export const getProductsBasedOnSpecyfiedTags = async (req, res) => {
  const { tags } = req.query;
  try {
    if (!tags) {
      return res.status(400).json({ message: `Nie podano żanych tagów` });
    }
    const products = await Product.find({
      'tags.name': { $in: tags.split(',') },
    }).populate('category', 'title slug coin');
    if (!products.length) {
      return res
        .status(404)
        .json({ message: 'Brak produktów dla podanych tagów' });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const getProductsByTags = async (req, res) => {
  const { tags } = req.query;
  const { model } = req.params;
  let products = [];
  try {
    const product = await Product.findOne({ model }, '-__v');
    if (!product) {
      return res
        .status(404)
        .json({ message: `Brak produktu o modelu: \/${model}\/` });
    }
    if (tags) {
      products = await Product.find(
        {
          $and: [
            {
              'tags.name': { $all: tags.split(',') },
            },
            { _id: { $not: { $eq: product._id } } },
          ],
        },
        '-documents -icon -__v -body -tags -createdAt -updatedAt -parameters -controls'
      ).populate('category', 'slug -_id');
    } else {
      const tags = product.tags.map((t) => t.name);
      products = await Product.find(
        {
          $and: [
            { 'tags.name': { $in: tags } },
            { _id: { $not: { $eq: product._id } } },
          ],
        },
        '-documents -icon -__v -body -tags -createdAt -updatedAt -parameters -controls'
      ).populate('category', 'slug -_id');
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
/**
 * Get products by category name
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @return
 */
export const getProductsByCategoryName = async (req, res) => {
  const { categoryName } = req.params;

  try {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'cat',
        },
      },
      {
        $match: {
          'cat.slug': categoryName,
        },
      },
      {
        $sort: {
          model: 1,
        },
      },
      {
        $project: {
          category: 0,
          'cat.image': 0,
          'cat.icon': 0,
          'cat.position': 0,
          'cat.createdAt': 0,
          'cat.updatedAt': 0,
          'cat.features': 0,
          __v: 0,
        },
      },
    ]);
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
/**
 * Get product by id
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @return
 */
export const getProductDetails = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: `Podane _id: \/${id}\/ dla produktu jest nieprawidłowe`,
      });
    }
    const product = await Product.findById({ _id: id }, '-__v');
    if (!product) {
      return res
        .status(404)
        .json({ message: `Nie ma produktu o _id: \/ ${id} \/` });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
/**
 * Get product by model name
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @return product pbject or null
 */
export const getProductDetailsByModel = async (req, res) => {
  const { model } = req.params;
  try {
    const product = await Product.findOne({ model }, '-__v').populate(
      'category'
    );
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * Create product
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @return
 */
export const createProduct = async (req, res) => {
  const data = req.body;
  const { documents } = req.body;
  const mappedDocuments = documents
    ? documents.map((document) => ({
        _id: document._id,
        displayFileName: document.displayFileName,
        filename: document.filename,
      }))
    : [];
  data.documents = mappedDocuments;
  const product = new Product(data);

  try {
    const isExistProduct = await Product.findOne({ model: product.model });
    if (isExistProduct) {
      res.status(409).json({
        message: `Produkt, model: ${product.model} już istnieje. Nazwa modelu produktu musi być unikatowa`,
      });
    } else {
      await product.save();
      res.status(201).json({
        message: `Pomyślnie utworzono produkt, model ${product.model} `,
      });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
/**
 * Update product
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns
 */
export const updateProduct = async (req, res) => {
  const { model } = req.params;
  const data = req.body;
  // console.log(model);
  // console.log(data);
  try {
    const product = await Product.findOne({ model: model });
    if (!product)
      return res
        .status(404)
        .json({ message: `Produkt, model: ${model} nie istnieje` });

    const productId = product._id;
    await Product.findOneAndUpdate({ _id: productId }, data, { new: true });
    res
      .status(201)
      .json({ message: `Produkt model: \/${model} \/ uaktualniony` });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
/**
 * Delete product
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns
 */
export const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(productId))
    return res
      .status(404)
      .json({ message: `No product with _id: ${productId}` });
  try {
    await Product.findByIdAndRemove({ _id: productId });
    res.status(200).json({
      message: `Product with _id: ${productId} was deleted successfuly`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
/**
 * Delete product by model
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns object
 */
export const deleteProductByModel = async (req, res, next) => {
  const { model } = req.params;

  try {
    const product = await Product.findOne({ model: model });
    if (!product) {
      return res
        .status(404)
        .json({ message: `Model produktu: \/ ${model} \/ nie istnieje` });
    }
    const result = await Product.deleteOne({ model: model });
    if (result.deletedCount) {
      return res
        .status(200)
        .json({ message: `Model produktu: \/ ${model} \/ skasowany` });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
