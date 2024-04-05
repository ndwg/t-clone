const express = require('express');
const router = express.Router();
const profiles = require('../controllers/profiles');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isProfile} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

router.route('/:id')
.get(catchAsync(profiles.renderProfile))
.put(isLoggedIn, isProfile, upload.single('pfp'), /*validateProfile,*/ catchAsync(profiles.updateProfile));

router.get('/:id/edit', isLoggedIn, isProfile, catchAsync(profiles.renderNewEdit));

router.get('/:id/follow', isLoggedIn, catchAsync(profiles.follow));

module.exports = router;