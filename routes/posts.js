const express = require('express');
const router = express.Router();
const posts = require('../controllers/posts');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validatePost} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

const Post = require('../models/post');

router.route('/')
.get(catchAsync(posts.index))
.post(isLoggedIn, upload.array('images'), validatePost, catchAsync(posts.createPost));

router.get('/new', isLoggedIn, posts.renderNewPost);

router.route('/:id')
.get(catchAsync(posts.showPost))
.put(isLoggedIn, isAuthor, upload.array('images'), validatePost, catchAsync(posts.updatePost))
.post(isLoggedIn, upload.array('images'), validatePost, catchAsync(posts.createReply))
.delete(isLoggedIn, isAuthor, catchAsync(posts.deletePost));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(posts.renderNewEdit));

router.get('/:id/reply', isLoggedIn, catchAsync(posts.renderNewReply));

router.get('/:id/like', isLoggedIn, catchAsync(posts.like));

module.exports = router;