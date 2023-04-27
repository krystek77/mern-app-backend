import express from 'express';
import {
  getTags,
  getTagByName,
  createTags,
  deleteTag,
  editTag,
} from '../controllers/tag.js';
const routes = express.Router();

routes.get('/', getTags);
routes.get('/:tagName', getTagByName);
routes.post('/', createTags);
routes.delete('/skasuj-tag/:tagName', deleteTag);
routes.patch('/edytuj-tag/:tagName', editTag);
export default routes;
