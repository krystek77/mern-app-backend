import express from 'express';
import multer from 'multer';
import {
  getPosts,
  createPost,
  deletePost,
  updatePost,
  getPost,
  countPost,
  getMarkdownPosts,
  getMarkdownPost,
} from '../controllers/post.js';
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/assets/posts');
  },
  filename: (req, file, cb) => {
    const day = new Date().toLocaleDateString('pl-PL');
    const ext = file.originalname.split('.')[1];
    const filename = `${file.originalname.split('.')[0]}-${day}.${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  // FILE: {
  //     fieldname: 'post',
  //     originalname: '3-lata-gwarancji.md',
  //     encoding: '7bit',
  //     mimetype: 'text/markdown'
  //   }

  const ext = file.originalname.split('.')[1];
  if (file.mimetype === 'text/markdown' || ext === 'md' || ext === 'markdown') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload_post = multer({
  storage,
  fileFilter,
});

router.post('/', upload_post.single('post'), createPost);
router.get('/', getPosts);
router.get('/:slug', getPost);
router.get('/markdown/:id', getMarkdownPost);
router.get('/posts/count', countPost);
router.get('/posts/markdown', getMarkdownPosts);
router.delete('/:slug', deletePost);
router.patch('/:slug', updatePost);

export default router;
