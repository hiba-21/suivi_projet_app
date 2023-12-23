const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
//router.get('/isLoggedIn', authController.isLoggedIn);
router.get('/logout', authController.logout);

router.post('/send',authController.getbill);
router.post('/sendReel',authController.getReel);
router.use(authController.protect);
router.patch('/updateMyPassword',authController.updatePassword);
//router.patch('/updateMe',userController.updateMe);
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
