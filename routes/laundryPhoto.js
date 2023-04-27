import express from 'express';
import multer from 'multer';
import {
  getLaundryPhotos,
  getLaundryPhoto,
  deleteLaundryPhoto,
  updateLaundryPhoto,
  createLaundryPhotos,
  countLaundryPhotos,
  getAllLaundryPhotos,
} from '../controllers/laundryPhoto.js';
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/static/media');
  },
  filename: (req, file, cb) => {
    const day = new Date().toLocaleDateString('pl-PL');
    const ext = file.originalname.split('.')[1];
    const filename = `${file.originalname.split('.')[0]}-${day}.${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = file.originalname.split('.')[1];
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/webp' ||
    file.image === 'image/png' ||
    ext === 'jpeg' ||
    ext === 'webp' ||
    ext === 'png'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload_laundryPhotos = multer({
  storage,
  fileFilter,
});

router.post('/', upload_laundryPhotos.array('images', 30), createLaundryPhotos);
router.get('/', getLaundryPhotos);
router.get('/laundryPhotos/all', getAllLaundryPhotos);
router.get('/:laundryPhotoId', getLaundryPhoto);
router.get('/laundryPhotos/count', countLaundryPhotos);
router.delete('/:laundryPhotoId', deleteLaundryPhoto);
router.patch(
  '/:laundryPhotoId',
  upload_laundryPhotos.single('image'),
  updateLaundryPhoto
);

export default router;
