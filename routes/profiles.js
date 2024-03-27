const express = require('express');
const router = express.Router();
const profiles = require('../controllers/profiles');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isProfile} = require('../middleware');

router.route('/:id')
.get(catchAsync(profiles.renderProfile))
.put(isLoggedIn, isProfile, /*validateProfile,*/ catchAsync(profiles.updateProfile));

router.get('/:id/edit', isLoggedIn, isProfile, catchAsync(profiles.renderNewEdit));

module.exports = router;