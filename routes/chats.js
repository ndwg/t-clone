const express = require('express');
const router = express.Router();
const chats = require('../controllers/chats');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validatePost} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

router.route('/')
.get(catchAsync(chats.index));

module.exports = router;