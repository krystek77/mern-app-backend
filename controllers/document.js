import fs from 'fs';
import { promisify } from 'util';

import File from '../models/document.js';
import Product from '../models/product.js';

export const uploadDocument = (req, res, next) => {
  const files = req.files;
  /**
   *  withoiut storage
   {
    fieldname: 'documents',
    originalname: 'Nowy Dokument tekstowy OpenDocument.odt',
    encoding: '7bit',
    mimetype: 'application/vnd.oasis.opendocument.text',
    destination: './public/assets/documents',
    filename: '0dda38adcf0981950fdc53412b4719a3',
    path: 'public/assets/documents/0dda38adcf0981950fdc53412b4719a3',
    size: 642
    }
   */

  files.forEach((file) => {
    const type = file.mimetype.split('/')[1];
    const fileName = file.originalname.split('.')[0];
    const newFileName = `${fileName}.${type}`;
    fs.rename(
      `./public/assets/documents/${file.filename}`,
      `./public/assets/documents/${newFileName}`,
      function (error) {
        if (error) {
          throw new Error(error.message);
        }
      }
    );
  });
  const mappedFiles = files.map((file) => {
    const type = file.mimetype.split('/')[1];
    const fileName = file.originalname.split('.')[0];
    const newFileName = `${fileName}.${type}`;
    const path = `http://localhost:4000/assets/documents/${newFileName}`;
    const size = file.size;
    return {
      fileName: `${fileName}.${type}`,
      path: `http://localhost:4000/assets/documents/${newFileName}`,
      size: file.size,
    };
  });
  res.status(200).json(mappedFiles);
};

export const uploadDocumentDB = async (req, res, next) => {
  /**
   * with multer storage
  {
    fieldname: 'documents',
    originalname: 'GLine ELine.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    destination: 'public/assets',
    filename: 'GLine ELine-17.01.2023.pdf',
    path: 'public/assets/GLine ELine-17.01.2023.pdf',
    size: 5145795
  }
   */
  const documents = req.files;
  const newDocuments = documents.map((file) => {
    return {
      fieldname: file.fieldname,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      destination: file.destination,
      filename: file.filename,
      path: file.path,
      size: file.size,
    };
  });
  const originalnames = documents.map((file) => file.originalname);

  try {
    const doc = await File.findOne({ originalname: { $in: originalnames } });
    if (doc) {
      return res
        .status(409)
        .json({ message: `Document o \/${doc.filename}\/ już istnieje` });
    }
    await File.create(newDocuments);
    res.status(201).json({
      message: `Pomyślnie dodano: ${newDocuments.length} dokument/y/ów`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getUploadedDocuments = async (req, res, next) => {
  try {
    const documents = await File.find({}, '-__v').sort({ createdAt: -1 });
    if (!documents.length) {
      return res.status(404).json({ message: 'Brak dokumentów' });
    }
    res.status(200).json(documents);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteFile = promisify(fs.unlink);

export const deleteDocument = async (req, res) => {
  const { slug } = req.params;
  try {
    const document = await File.findOneAndDelete({ slug: slug });
    if (document) {
      const _id = document._id;
      await Product.updateMany(
        { 'documents._id': _id },
        { $pull: { documents: { slug: slug } } },
        { multi: true }
      );
      deleteFile(document.path);
      return res.status(200).json({
        message: `Dokument został pomyślnie usunięty`,
      });
    } else {
      return res.status(404).json({ message: `Taki dokument nie istnieje` });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateDisplayFileName = async (req, res) => {
  const { slug } = req.params;
  const { displayFileName } = req.body;
  try {
    const document = await File.findOne({ slug: slug });
    if (document) {
      const _id = document._id;
      await File.findByIdAndUpdate({ _id }, { displayFileName }, { new: true });
      await Product.updateMany(
        { 'documents._id': _id },
        { $set: { 'documents.$.displayFileName': displayFileName } }
      );
      res.status(200).json({
        message: `Zmieniono nazwę wyświetlania dokumentu: \/ ${slug} \/ z \/ ${document.slug} \/ na \/ ${displayFileName} \/ `,
      });
    } else {
      res.status(404).json({ message: `Brak dokumentu ${slug}` });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
