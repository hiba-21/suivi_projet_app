const express = require('express');
const viewsController= require('../controllers/viewController');
const authController = require('./../controllers/authController');

const router= express.Router();



router.get('/login',viewsController.getLoginForm);
router.get('/',viewsController.getOverview);
router.get('/me',authController.protect,viewsController.getAccount);
module.exports = router;