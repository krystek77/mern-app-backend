import express from 'express';
import multer from 'multer';
import {
  uploadDocumentDB,
  getUploadedDocuments,
  deleteDocument,
  updateDisplayFileName,
} from '../controllers/document.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    /**
      {
      fieldname: 'documents',
      originalname: 'GMP.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf'
      }
       */
    cb(null, './public/assets/documents');
  },
  filename: (req, file, cb) => {
    const day = new Date().toLocaleDateString('pl-PL');
    const ext = file.mimetype.split('/')[1];
    const filename = `${file.originalname.split('.')[0]}-${day}.${ext}`;
    cb(null, filename);
  },
});

const upload_doc = multer({
  storage,
});

router.post('/', upload_doc.array('document', 15), uploadDocumentDB);
router.get('/', getUploadedDocuments);
router.patch('/:slug', updateDisplayFileName);
router.delete('/:slug', upload_doc.array('document', 15), deleteDocument);

export default router;
