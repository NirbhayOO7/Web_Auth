const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/sign-up', userController.signup);
router.get('/sign-in', userController.signin);
router.post('/create', userController.create);
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/user/sign-in'},
    ), userController.createSession);

router.get('/sign-out', userController.destroySession);
router.get('/auth/google', passport.authenticate('google', {scope : ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate(
    'google',
    {failureRedirect: '/user/sign-in'},
    ), userController.createSession);


router.get('/forget-password', userController.forgetPassword);
router.post('/reset-password', userController.resetPassword);
router.get('/change-password-link/:id', userController.changePassword);
router.post('/submit-password-change/:id', userController.submitChangePassword);
router.post('/change-password-after-signed-in/:id', userController.changePassword1);

module.exports = router;