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
    ),userController.createSession);

module.exports = router;