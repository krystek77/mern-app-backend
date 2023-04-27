import fs from 'fs';
import path from 'path';
import markdown from 'gray-matter';
import html from 'remark-html';
import { remark } from 'remark';
import { promisify } from 'util';

import Post from '../models/post.js';

const POSTS_DIRECTORY = path.join(process.cwd(), 'public/assets/posts');
/**
 * GET POSTS
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({}, '-__v').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
/**
 * GET MARKDOWN PARSED POST by ID
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
export const getMarkdownPost = async (req, res, next) => {
  const { id } = req.params;
  const pathname = path.join(POSTS_DIRECTORY, `${id}.md`);
  const contentPost = fs.readFileSync(pathname, { encoding: 'utf8' });
  const markDown = markdown(contentPost);
  const tags = markDown.data.tags
    .toLowerCase()
    .split(',')
    .filter((tag) => tag !== ',' && tag !== '')
    .map((tag) => tag.trim());
  try {
    const processedContent = await remark().use(html).process(markDown.content);
    const contentHTML = processedContent.toString();
    res
      .status(200)
      .json({ _id: id, tags: tags, ...markDown.data, content: contentHTML });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/**
 * GET MARKDOWN PARSED POSTS
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
export const getMarkdownPosts = (req, res, next) => {
  const fileNames = fs.readdirSync(POSTS_DIRECTORY, { encoding: 'utf8' });
  const markdownPosts = fileNames.map(async (filename) => {
    const _id = filename.replace(/(\.md)|(\.markdown)/, '');
    const contentPost = fs.readFileSync(path.join(POSTS_DIRECTORY, filename), {
      encoding: 'utf8',
    });
    const markDown = markdown(contentPost);
    const tags = markDown.data.tags
      .toLowerCase()
      .split(',')
      .filter((tag) => tag !== ',' && tag !== '')
      .map((tag) => tag.trim());
    const processedContent = await remark().use(html).process(markDown.content);
    const contentHTML = processedContent.toString();
    return {
      _id: _id,
      tags: tags,
      ...markDown.data,
      content: contentHTML,
    };
  });

  Promise.all(markdownPosts)
    .then((markdownPost) => {
      // const posts = [];
      // posts.push(markdownPost);
      return markdownPost;
    })
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(409).json({ message: error.message });
    });
};
export const getPost = async (req, res, next) => {
  res.status(200).json({ message: 'GET POST BY SLUG' });
};
/**
 * CREATE POST - SAVE
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns
 */
export const createPost = async (req, res, next) => {
  //   FILE: {
  //     fieldname: 'post',
  //     originalname: '3-lata-gwarancji.md',
  //     encoding: '7bit',
  //     mimetype: 'text/markdown',
  //     destination: './public/assets/posts',
  //     filename: '3-lata-gwarancji-6.02.2023.markdown',
  //     path: 'public/assets/posts/3-lata-gwarancji-6.02.2023.markdown',
  //     size: 2169
  //   }

  const post = req.file;
  req.file.mimetype = 'text/markdown';
  try {
    const newPost = new Post(post);
    const isExistPost = await Post.findOne({
      originalname: newPost.originalname,
    });
    if (isExistPost) {
      return res.status(409).json({
        message: `Artykuł o nazwie \/ ${post.originalname} \/ już istnieje`,
      });
    }
    await newPost.save();
    res.status(201).json({
      message: `Pomyślnie utworzono artykuł o nazwie \/ ${newPost.originalname} \/`,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const deleteFile = promisify(fs.unlink);
/**
 * DELETE ONE POST BY SLUG
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
export const deletePost = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const post = await Post.findOneAndDelete({
      filename: `${slug}.md`,
    });
    if (post) {
      deleteFile(post.path);
      res.status(200).json({
        message: `Artykuł o \/ ${post.originalname} \/ został pomyślnie usunięty`,
      });
    } else {
      res.status(404).json({ message: `Taki artykuł nie istnieje` });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
/**
 * UPDATE POST BY SLUG
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
export const updatePost = async (req, res, next) => {
  res.status(200).json({ message: 'UPDATE POST' });
};

export const countPost = async (req, res, next) => {
  try {
    const count = await Post.count();
    res.status(200).json(count);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
